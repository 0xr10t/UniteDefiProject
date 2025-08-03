// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Test, console} from "lib/forge-std/src/Test.sol";
import {EscrowFactory} from "../src/EscrowFactory.sol";
import {SimpleLimitOrderProtocol} from "../src/SimpleLimitOrderProtocol.sol";
import {MockERC20} from "../src/test/MockERC20.sol";
import {IEscrow} from "../src/interfaces/IEscrow.sol";

contract EscrowTest is Test {
    EscrowFactory public escrowFactory;
    SimpleLimitOrderProtocol public limitOrderProtocol;
    MockERC20 public token1;
    MockERC20 public token2;

    address public owner;
    address public maker;
    address public taker;

    bytes32 public secret;
    bytes32 public hashlock;

    // Helper function to hash EIP-712 typed data
    function _hashTypedDataV4(bytes32 structHash) internal view returns (bytes32) {
        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("Simple Limit Order Protocol"),
                keccak256("1"),
                block.chainid,
                address(limitOrderProtocol)
            )
        );
        return keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
    }

    // Helper function to create a valid signature for testing
    function _createValidSignature(bytes32 orderHash) internal view returns (bytes memory) {
        bytes32 typedDataHash = _hashTypedDataV4(orderHash);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(uint256(uint160(maker)), typedDataHash);
        return abi.encodePacked(r, s, v);
    }

    function setUp() public {
        owner = address(this);
        maker = makeAddr("maker");
        taker = makeAddr("taker");

        // Fund addresses with ETH
        vm.deal(maker, 1000e18);
        vm.deal(taker, 1000e18);

        // Deploy mock tokens
        token1 = new MockERC20("Token1", "TK1");
        token2 = new MockERC20("Token2", "TK2");

        // Deploy EscrowFactory
        escrowFactory = new EscrowFactory(86400); // 24 hour rescue delay

        // Deploy SimpleLimitOrderProtocol
        limitOrderProtocol = new SimpleLimitOrderProtocol(address(escrowFactory));

        // Generate secret and hashlock
        secret = keccak256("secret");
        hashlock = keccak256(abi.encodePacked(secret));

        // Mint tokens to maker and taker
        token1.mint(maker, 1000e18);
        token2.mint(taker, 1000e18);
    }

    function test_EscrowFactoryDeployment() public view{
        assertTrue(address(escrowFactory) != address(0));
    }

    function test_LimitOrderProtocolDeployment() public view{
        assertTrue(address(limitOrderProtocol) != address(0));
    }

    function test_CreateEscrowWithCorrectData() public view{
        IEscrow.EscrowData memory escrowData = IEscrow.EscrowData({
            orderHash: keccak256("0x1234"),
            hashlock: hashlock,
            maker: maker,
            taker: taker,
            token: address(token1),
            amount: 100e18,
            safetyDeposit: 1e18,
            deployedAt: 0,
            withdrawalStart: block.timestamp + 3600,
            cancellationStart: block.timestamp + 7200
        });

        address escrowAddress = escrowFactory.addressOfEscrow(escrowData);
        assertTrue(escrowAddress != address(0));
    }

    function test_DirectEscrowCreation() public {
        // Test direct escrow creation without going through the limit order protocol
        IEscrow.EscrowData memory escrowData = IEscrow.EscrowData({
            orderHash: keccak256("direct_test"),
            hashlock: hashlock,
            maker: maker,
            taker: taker,
            token: address(token1),
            amount: 100e18,
            safetyDeposit: 1e18,
            deployedAt: 0,
            withdrawalStart: block.timestamp + 3600,
            cancellationStart: block.timestamp + 7200
        });

        // Transfer tokens to the factory contract first
        vm.startPrank(maker);
        token1.transfer(address(escrowFactory), 100e18);
        vm.stopPrank();

        // Create escrow directly
        address escrowAddress = escrowFactory.createEscrow{value: 1e18}(escrowData);
        assertTrue(escrowAddress != address(0));

        // Test withdrawal
        vm.warp(block.timestamp + 3600); // Fast forward to withdrawal time
        vm.startPrank(taker);
        
        IEscrow escrow = IEscrow(escrowAddress);
        escrow.withdraw(secret, escrowData);
        
        vm.stopPrank();

        // Verify taker received tokens
        assertTrue(token1.balanceOf(taker) == 100e18);
    }

    function test_EscrowCancellation() public {
        // Test direct escrow creation and cancellation
        IEscrow.EscrowData memory escrowData = IEscrow.EscrowData({
            orderHash: keccak256("cancel_test"),
            hashlock: hashlock,
            maker: maker,
            taker: taker,
            token: address(token1),
            amount: 100e18,
            safetyDeposit: 1e18,
            deployedAt: 0,
            withdrawalStart: block.timestamp + 3600,
            cancellationStart: block.timestamp + 7200
        });

        // Transfer tokens to the factory contract first
        vm.startPrank(maker);
        token1.transfer(address(escrowFactory), 100e18);
        vm.stopPrank();

        // Create escrow directly
        address escrowAddress = escrowFactory.createEscrow{value: 1e18}(escrowData);
        assertTrue(escrowAddress != address(0));

        // Test cancellation
        vm.warp(block.timestamp + 7200); // Fast forward to cancellation time
        vm.startPrank(taker);
        
        IEscrow escrow = IEscrow(escrowAddress);
        escrow.cancel(escrowData);
        
        vm.stopPrank();

        // Verify maker received tokens back
        assertTrue(token1.balanceOf(maker) == 1000e18);
    }

    function test_EmergencyRescue() public {
        // Test emergency rescue functionality
        IEscrow.EscrowData memory escrowData = IEscrow.EscrowData({
            orderHash: keccak256("rescue_test"),
            hashlock: hashlock,
            maker: maker,
            taker: taker,
            token: address(token1),
            amount: 100e18,
            safetyDeposit: 1e18,
            deployedAt: 0,
            withdrawalStart: block.timestamp + 3600,
            cancellationStart: block.timestamp + 7200
        });

        // Transfer tokens to the factory contract first
        vm.startPrank(maker);
        token1.transfer(address(escrowFactory), 100e18);
        vm.stopPrank();

        // Create escrow directly
        address escrowAddress = escrowFactory.createEscrow{value: 1e18}(escrowData);
        assertTrue(escrowAddress != address(0));

        // Test emergency rescue
        vm.warp(block.timestamp + 86400 + 1); // Fast forward past rescue delay
        vm.startPrank(taker);
        
        IEscrow escrow = IEscrow(escrowAddress);
        escrow.rescueFunds(address(token1), 100e18, escrowData);
        
        vm.stopPrank();

        // Verify taker received tokens through rescue
        assertTrue(token1.balanceOf(taker) == 100e18);
    }
} 