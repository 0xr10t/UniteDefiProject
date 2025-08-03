// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IEscrow interface
 * @notice Core interface for escrow functionality
 */
interface IEscrow {
    struct EscrowData {
        bytes32 orderHash;
        bytes32 hashlock;
        address maker;
        address taker;
        address token;
        uint256 amount;
        uint256 safetyDeposit;
        uint256 deployedAt;
        uint256 withdrawalStart;
        uint256 cancellationStart;
    }

    event EscrowCreated(bytes32 indexed orderHash, address indexed escrow, EscrowData data);
    event EscrowWithdrawal(bytes32 indexed orderHash, bytes32 secret);
    event EscrowCancelled(bytes32 indexed orderHash);
    event FundsRescued(address indexed token, uint256 amount);

    error InvalidCaller();
    error InvalidSecret();
    error InvalidTime();
    error InvalidImmutables();
    error NativeTokenSendingFailure();
    error InsufficientEscrowBalance();

    /**
     * @notice Withdraw funds from escrow using the secret
     * @param secret The secret that unlocks the escrow
     * @param escrowData The escrow data
     */
    function withdraw(bytes32 secret, EscrowData calldata escrowData) external;

    /**
     * @notice Cancel the escrow and return funds to maker
     * @param escrowData The escrow data
     */
    function cancel(EscrowData calldata escrowData) external;

    /**
     * @notice Rescue funds in emergency situations
     * @param token The token to rescue
     * @param amount The amount to rescue
     * @param escrowData The escrow data
     */
    function rescueFunds(address token, uint256 amount, EscrowData calldata escrowData) external;
} 