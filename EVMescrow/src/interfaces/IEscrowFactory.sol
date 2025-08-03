// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { IEscrow } from "./IEscrow.sol";

/**
 * @title IEscrowFactory interface
 * @notice Interface for escrow factory functionality
 */
interface IEscrowFactory {
    event EscrowCreated(
        address indexed escrow,
        bytes32 indexed orderHash,
        IEscrow.EscrowData data
    );

    error InsufficientEscrowBalance();
    error InvalidCreationTime();

    /**
     * @notice Create a new escrow contract
     * @param escrowData The escrow data
     * @return escrow The address of the created escrow
     */
    function createEscrow(IEscrow.EscrowData calldata escrowData) external payable returns (address escrow);

    /**
     * @notice Get the address of an escrow contract
     * @param escrowData The escrow data
     * @return The address of the escrow
     */
    function addressOfEscrow(IEscrow.EscrowData calldata escrowData) external view returns (address);
} 