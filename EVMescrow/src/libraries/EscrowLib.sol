// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { IEscrow } from "../interfaces/IEscrow.sol";

/**
 * @title EscrowLib library
 * @notice Library for escrow data manipulation and validation
 */
library EscrowLib {
    using EscrowLib for IEscrow.EscrowData;

    /**
     * @notice Compute the hash of escrow data
     * @param data The escrow data
     * @return The hash of the escrow data
     */
    function hash(IEscrow.EscrowData memory data) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                data.orderHash,
                data.hashlock,
                data.maker,
                data.taker,
                data.token,
                data.amount,
                data.safetyDeposit,
                data.deployedAt,
                data.withdrawalStart,
                data.cancellationStart
            )
        );
    }

    /**
     * @notice Validate that the escrow data is valid
     * @param data The escrow data
     */
    function validate(IEscrow.EscrowData memory data) internal pure {
        require(data.maker != address(0), "Invalid maker");
        require(data.taker != address(0), "Invalid taker");
        require(data.token != address(0), "Invalid token");
        require(data.amount > 0, "Invalid amount");
        require(data.withdrawalStart > data.deployedAt, "Invalid withdrawal time");
        require(data.cancellationStart > data.withdrawalStart, "Invalid cancellation time");
    }

    /**
     * @notice Check if withdrawal is allowed
     * @param data The escrow data
     * @return True if withdrawal is allowed
     */
    function canWithdraw(IEscrow.EscrowData memory data) internal view returns (bool) {
        return block.timestamp >= data.withdrawalStart && block.timestamp < data.cancellationStart;
    }

    /**
     * @notice Check if cancellation is allowed
     * @param data The escrow data
     * @return True if cancellation is allowed
     */
    function canCancel(IEscrow.EscrowData memory data) internal view returns (bool) {
        return block.timestamp >= data.cancellationStart;
    }
} 