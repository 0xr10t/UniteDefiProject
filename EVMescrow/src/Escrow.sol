// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { Create2 } from "lib/openzeppelin-contracts/contracts/utils/Create2.sol";

import { BaseEscrow } from "./BaseEscrow.sol";
import { IEscrow } from "./interfaces/IEscrow.sol";
import { EscrowLib } from "./libraries/EscrowLib.sol";

/**
 * @title Escrow contract
 * @notice Main escrow contract for atomic swaps
 */
contract Escrow is BaseEscrow {
    using EscrowLib for IEscrow.EscrowData;

    /// @notice Bytecode hash for deterministic address computation
    bytes32 public immutable PROXY_BYTECODE_HASH;

    constructor(uint256 rescueDelay, bytes32 bytecodeHash) BaseEscrow(rescueDelay) {
        // Use the provided bytecode hash for deterministic addresses
        PROXY_BYTECODE_HASH = bytecodeHash;
    }

    /**
     * @dev Validates that the escrow data matches this contract's address
     */
    function _validateEscrowData(EscrowData calldata escrowData) internal view override {
        bytes32 escrowDataHash = escrowData.hash();
        address expectedAddress = Create2.computeAddress(escrowDataHash, PROXY_BYTECODE_HASH, FACTORY);
        if (expectedAddress != address(this)) revert InvalidImmutables();
    }

    /**
     * @dev Internal withdraw function - transfers tokens to taker and ETH to caller
     */
    function _withdraw(bytes32 secret, EscrowData calldata escrowData) internal override {
        // Transfer tokens to taker
        _uniTransfer(escrowData.token, escrowData.taker, escrowData.amount);
        
        // Transfer safety deposit to caller
        _ethTransfer(msg.sender, escrowData.safetyDeposit);
        
        emit EscrowWithdrawal(escrowData.orderHash, secret);
    }

    /**
     * @dev Internal cancel function - transfers tokens back to maker and ETH to caller
     */
    function _cancel(EscrowData calldata escrowData) internal override {
        // Transfer tokens back to maker
        _uniTransfer(escrowData.token, escrowData.maker, escrowData.amount);
        
        // Transfer safety deposit to caller
        _ethTransfer(msg.sender, escrowData.safetyDeposit);
        
        emit EscrowCancelled(escrowData.orderHash);
    }
} 