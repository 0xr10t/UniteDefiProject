// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console} from "forge-std/Script.sol";
import "../LimitOrderProtocol.sol";
import {IWETH} from "../lib/solidity-utils/contracts/interfaces/IWETH.sol";

contract DeployLimitOrderProtocol is Script {
    // WETH addresses by network
    mapping(uint256 => address) public wethByChainId;
    
    constructor() {
        // Sepolia Testnet
        wethByChainId[11155111] = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
        // Tron (if using EVM-compatible deployment)
        // wethByChainId[728126428] = 0x418ca65d5dc1da211b8b984f6e5592474ce74cd062;
    }
    
    function run() external {
        console.log("Running deploy script");
        console.log("Chain ID:", block.chainid);
        
        address wethAddress = wethByChainId[block.chainid];
        require(wethAddress != address(0), "WETH address not configured for this chain");
        
        console.log("Using WETH address:", wethAddress);
        
        vm.startBroadcast();
        
        LimitOrderProtocol limitOrderProtocol = new LimitOrderProtocol(IWETH(wethAddress));
        
        vm.stopBroadcast();
        
        console.log("LimitOrderProtocol deployed to:", address(limitOrderProtocol));
        
        // Save deployment info
        string memory deploymentInfo = string(
            abi.encodePacked(
                "LimitOrderProtocol deployed at: ",
                vm.toString(address(limitOrderProtocol)),
                " on chain: ",
                vm.toString(block.chainid)
            )
        );
        
        // vm.writeFile("./broadcast/LimitOrderProtocol.txt", deploymentInfo);
    }
}