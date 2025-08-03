// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {Script, console} from "lib/forge-std/src/Script.sol";
import {EscrowFactory} from "../src/EscrowFactory.sol";
import {SimpleLimitOrderProtocol} from "../src/SimpleLimitOrderProtocol.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy EscrowFactory
        EscrowFactory escrowFactory = new EscrowFactory(86400); // 24 hour rescue delay
        console.log("EscrowFactory deployed to:", address(escrowFactory));

        // Deploy SimpleLimitOrderProtocol
        SimpleLimitOrderProtocol limitOrderProtocol = new SimpleLimitOrderProtocol(address(escrowFactory));
        console.log("SimpleLimitOrderProtocol deployed to:", address(limitOrderProtocol));

        vm.stopBroadcast();

        console.log("Deployment completed!");
        console.log("EscrowFactory:", address(escrowFactory));
        console.log("SimpleLimitOrderProtocol:", address(limitOrderProtocol));
    }
} 