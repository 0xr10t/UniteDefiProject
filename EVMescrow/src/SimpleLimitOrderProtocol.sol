// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { IERC20 } from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import { Pausable } from "lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import { EIP712 } from "lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import { ECDSA } from "lib/openzeppelin-contracts/contracts/utils/cryptography/ECDSA.sol";
import { Math } from "lib/openzeppelin-contracts/contracts/utils/math/Math.sol";

import { IEscrowFactory } from "./interfaces/IEscrowFactory.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";

/**
 * @title SimpleLimitOrderProtocol contract
 * @notice Simple limit order protocol with escrow integration
 */
contract SimpleLimitOrderProtocol is EIP712, Ownable, Pausable {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

    struct Order {
        uint256 salt;
        address makerAsset;
        address takerAsset;
        address maker;
        address receiver;
        address allowedSender;
        uint256 makingAmount;
        uint256 takingAmount;
        uint256 offsets;
        bytes interactions;
        // Escrow specific fields
        bytes32 hashlock;
        uint256 withdrawalStart;
        uint256 cancellationStart;
        uint256 safetyDeposit;
    }

    bytes32 public constant ORDER_TYPEHASH =
        keccak256(
            "Order(uint256 salt,address makerAsset,address takerAsset,address maker,address receiver,address allowedSender,uint256 makingAmount,uint256 takingAmount,uint256 offsets,bytes interactions,bytes32 hashlock,uint256 withdrawalStart,uint256 cancellationStart,uint256 safetyDeposit)"
        );

    mapping(bytes32 => bool) public invalidatedOrders;
    mapping(bytes32 => uint256) public filledAmount;

    /// @notice Escrow factory contract
    IEscrowFactory public immutable ESCROW_FACTORY;

    event OrderFilled(
        bytes32 indexed orderHash,
        address indexed maker,
        uint256 makingAmount,
        uint256 takingAmount,
        address taker,
        address escrow
    );
    event OrderCancelled(bytes32 indexed orderHash);
    event Funded(address indexed sender, uint256 amount);
    event ETHWithdrawn(address indexed recipient, uint256 amount);

    error OrderAlreadyCancelled();
    error OrderOverfilled();
    error PrivateOrder();
    error InvalidSignature();
    error InsufficientBalance();

    constructor(address escrowFactory)
        EIP712("Simple Limit Order Protocol", "1")
        Ownable(msg.sender)
    {
        ESCROW_FACTORY = IEscrowFactory(escrowFactory);
    }

    /**
     * @notice Fill an order and create escrow
     * @param order The order to fill
     * @param signature The maker's signature
     * @param makingAmount The amount to fill
     * @param takingAmount The amount to take
     */
    function fillOrder(
        Order calldata order,
        bytes calldata signature,
        uint256 makingAmount,
        uint256 takingAmount
    ) external whenNotPaused {
        bytes32 orderHash = _hashTypedDataV4(hashOrder(order));

        if (invalidatedOrders[orderHash]) revert OrderAlreadyCancelled();
        if (filledAmount[orderHash] + makingAmount > order.makingAmount) revert OrderOverfilled();
        if (order.allowedSender != address(0) && order.allowedSender != msg.sender) revert PrivateOrder();

        address signer = orderHash.recover(signature);
        if (signer != order.maker) revert InvalidSignature();

        filledAmount[orderHash] += makingAmount;

        // Transfer tokens from maker to this contract
        IERC20(order.makerAsset).safeTransferFrom(
            order.maker,
            address(this),
            makingAmount
        );

        // Transfer tokens from taker to receiver
        IERC20(order.takerAsset).safeTransferFrom(
            msg.sender,
            order.receiver,
            takingAmount
        );

        // Create escrow data
        IEscrow.EscrowData memory escrowData = IEscrow.EscrowData({
            orderHash: orderHash,
            hashlock: order.hashlock,
            maker: order.maker,
            taker: msg.sender,
            token: order.makerAsset,
            amount: makingAmount,
            safetyDeposit: order.safetyDeposit,
            deployedAt: 0, // Will be set by factory
            withdrawalStart: order.withdrawalStart,
            cancellationStart: order.cancellationStart
        });

        // Create escrow contract
        address escrow = ESCROW_FACTORY.createEscrow{value: order.safetyDeposit}(escrowData);

        emit OrderFilled(
            orderHash,
            order.maker,
            makingAmount,
            takingAmount,
            msg.sender,
            escrow
        );
    }

    /**
     * @notice Cancel an order
     * @param order The order to cancel
     */
    function cancelOrder(Order calldata order) external {
        if (msg.sender != order.maker) revert InvalidSignature();

        bytes32 orderHash = _hashTypedDataV4(hashOrder(order));
        invalidatedOrders[orderHash] = true;

        emit OrderCancelled(orderHash);
    }

    /**
     * @notice Hash an order for signature verification
     * @param order The order to hash
     * @return The hash of the order
     */
    function hashOrder(Order calldata order) public pure returns (bytes32) {
        return keccak256(
            abi.encode(
                ORDER_TYPEHASH,
                order.salt,
                order.makerAsset,
                order.takerAsset,
                order.maker,
                order.receiver,
                order.allowedSender,
                order.makingAmount,
                order.takingAmount,
                order.offsets,
                keccak256(order.interactions),
                order.hashlock,
                order.withdrawalStart,
                order.cancellationStart,
                order.safetyDeposit
            )
        );
    }

    /**
     * @notice Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Fund the contract with ETH for gas fees
     */
    function fund() external payable {
        if (msg.value == 0) revert InsufficientBalance();
        emit Funded(msg.sender, msg.value);
    }

    /**
     * @notice Withdraw ETH from the contract
     * @param amount The amount to withdraw
     */
    function withdrawETH(uint256 amount) external onlyOwner {
        if (amount > address(this).balance) revert InsufficientBalance();
        payable(owner()).transfer(amount);
        emit ETHWithdrawn(owner(), amount);
    }

    /**
     * @notice Get contract ETH balance
     * @return The ETH balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
} 