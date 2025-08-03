// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { IERC20 } from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import { Create2 } from "lib/openzeppelin-contracts/contracts/utils/Create2.sol";

import { IEscrow } from "./interfaces/IEscrow.sol";
import { EscrowLib } from "./libraries/EscrowLib.sol";

/**
 * @title BaseEscrow contract
 * @notice Base escrow contract for atomic swaps
 */
abstract contract BaseEscrow is IEscrow {
    using SafeERC20 for IERC20;
    using EscrowLib for IEscrow.EscrowData;

    /// @notice Factory contract that created this escrow
    address public immutable FACTORY;
    
    /// @notice Rescue delay for emergency fund recovery
    uint256 public immutable RESCUE_DELAY;

    constructor(uint256 rescueDelay) {
        FACTORY = msg.sender;
        RESCUE_DELAY = rescueDelay;
    }

    modifier onlyTaker(address taker) {
        if (msg.sender != taker) revert InvalidCaller();
        _;
    }

    modifier onlyValidEscrowData(EscrowData calldata escrowData) {
        _validateEscrowData(escrowData);
        _;
    }

    modifier onlyValidSecret(bytes32 secret, bytes32 hashlock) {
        if (keccak256(abi.encodePacked(secret)) != hashlock) revert InvalidSecret();
        _;
    }

    modifier onlyAfter(uint256 start) {
        if (block.timestamp < start) revert InvalidTime();
        _;
    }

    modifier onlyBefore(uint256 stop) {
        if (block.timestamp >= stop) revert InvalidTime();
        _;
    }

    /**
     * @notice Withdraw funds from escrow using the secret
     * @param secret The secret that unlocks the escrow
     * @param escrowData The escrow data
     */
    function withdraw(bytes32 secret, EscrowData calldata escrowData)
        external
        onlyTaker(escrowData.taker)
        onlyValidEscrowData(escrowData)
        onlyValidSecret(secret, escrowData.hashlock)
        onlyAfter(escrowData.withdrawalStart)
        onlyBefore(escrowData.cancellationStart)
    {
        _withdraw(secret, escrowData);
    }

    /**
     * @notice Cancel the escrow and return funds to maker
     * @param escrowData The escrow data
     */
    function cancel(EscrowData calldata escrowData)
        external
        onlyTaker(escrowData.taker)
        onlyValidEscrowData(escrowData)
        onlyAfter(escrowData.cancellationStart)
    {
        _cancel(escrowData);
    }

    /**
     * @notice Rescue funds in emergency situations
     * @param token The token to rescue
     * @param amount The amount to rescue
     * @param escrowData The escrow data
     */
    function rescueFunds(address token, uint256 amount, EscrowData calldata escrowData)
        external
        onlyTaker(escrowData.taker)
        onlyValidEscrowData(escrowData)
        onlyAfter(escrowData.deployedAt + RESCUE_DELAY)
    {
        _uniTransfer(token, msg.sender, amount);
        emit FundsRescued(token, amount);
    }

    /**
     * @dev Transfers ERC20 or native tokens to the recipient
     */
    function _uniTransfer(address token, address to, uint256 amount) internal {
        if (token == address(0)) {
            _ethTransfer(to, amount);
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    /**
     * @dev Transfers native tokens to the recipient
     */
    function _ethTransfer(address to, uint256 amount) internal {
        (bool success,) = to.call{ value: amount }("");
        if (!success) revert NativeTokenSendingFailure();
    }

    /**
     * @dev Validates that the escrow data matches this contract
     */
    function _validateEscrowData(EscrowData calldata escrowData) internal view virtual;

    /**
     * @dev Internal withdraw function to be implemented by derived contracts
     */
    function _withdraw(bytes32 secret, EscrowData calldata escrowData) internal virtual;

    /**
     * @dev Internal cancel function to be implemented by derived contracts
     */
    function _cancel(EscrowData calldata escrowData) internal virtual;
} 