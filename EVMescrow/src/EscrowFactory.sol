// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { IERC20 } from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import { Create2 } from "lib/openzeppelin-contracts/contracts/utils/Create2.sol";

import { IEscrowFactory } from "./interfaces/IEscrowFactory.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { Escrow } from "./Escrow.sol";
import { EscrowLib } from "./libraries/EscrowLib.sol";

/**
 * @title EscrowFactory contract
 * @notice Factory contract for creating escrow contracts
 */
contract EscrowFactory is IEscrowFactory {
    using SafeERC20 for IERC20;
    using EscrowLib for IEscrow.EscrowData;

    /// @notice Implementation contract for escrow
    address public immutable ESCROW_IMPLEMENTATION;
    
    /// @notice Bytecode hash for deterministic address computation
    bytes32 public immutable ESCROW_BYTECODE_HASH;
    
    /// @notice Rescue delay for escrow contracts
    uint256 public immutable RESCUE_DELAY;

    constructor(uint256 rescueDelay) {
        bytes32 bytecodeHash = keccak256(type(Escrow).creationCode);
        ESCROW_IMPLEMENTATION = address(new Escrow(rescueDelay, bytecodeHash));
        ESCROW_BYTECODE_HASH = bytecodeHash;
        RESCUE_DELAY = rescueDelay;
    }

    /**
     * @notice Create a new escrow contract
     * @param escrowData The escrow data
     * @return escrow The address of the created escrow
     */
    function createEscrow(IEscrow.EscrowData calldata escrowData) external payable returns (address escrow) {
        // Validate escrow data
        escrowData.validate();
        
        // Set deployment timestamp
        IEscrow.EscrowData memory data = escrowData;
        data.deployedAt = block.timestamp;
        
        // Compute salt for deterministic address
        bytes32 salt = data.hash();
        
        // Deploy escrow contract with constructor parameters
        bytes memory creationCode = abi.encodePacked(
            type(Escrow).creationCode,
            abi.encode(RESCUE_DELAY, ESCROW_BYTECODE_HASH)
        );
        escrow = Create2.deploy(0, salt, creationCode);
        
        // Transfer tokens to the escrow contract
        if (data.token == address(0)) {
            // Native token - send ETH to escrow
            (bool success,) = escrow.call{value: data.amount}("");
            if (!success) revert InsufficientEscrowBalance();
        } else {
            // ERC20 token - transfer tokens to escrow
            IERC20(data.token).safeTransfer(escrow, data.amount);
        }
        
        // Check that the escrow has sufficient balance
        if (data.token == address(0)) {
            // Native token
            if (escrow.balance < data.amount + data.safetyDeposit) {
                revert InsufficientEscrowBalance();
            }
        } else {
            // ERC20 token
            if (IERC20(data.token).balanceOf(escrow) < data.amount) {
                revert InsufficientEscrowBalance();
            }
        }
        
        emit EscrowCreated(escrow, data.orderHash, data);
    }

    /**
     * @notice Get the address of an escrow contract
     * @param escrowData The escrow data
     * @return The address of the escrow
     */
    function addressOfEscrow(IEscrow.EscrowData calldata escrowData) external view returns (address) {
        bytes32 salt = escrowData.hash();
        return Create2.computeAddress(salt, ESCROW_BYTECODE_HASH);
    }
} 