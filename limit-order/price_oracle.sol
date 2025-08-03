// SPDX-License-Identifier: MIT 
// Oracle.sol
pragma solidity ^0.8.0;

contract PriceOracle {
    address public owner;

    // i will call the smallest unit of usdc = uei
    // 1usdc = 10^6 uei
    // 1eth = 10^18 wei

    uint256 wei_in_1_usdc;
    uint256 uei_in_1_eth;

    event DataUpdated(uint256, uint256);

    constructor() {
        owner = msg.sender;
    }
    
    function updateData(uint256 wei_usdc, uint256 uei_eth) public{
        require(msg.sender == owner, "Only oracle updater can post data");
        wei_in_1_usdc = wei_usdc;
        uei_in_1_eth = uei_eth;

        emit DataUpdated(wei_usdc, uei_eth);

    }

    function getWeiIn1USDC() external view returns (uint256) {
        return wei_in_1_usdc;
    }
    function getUeiIn1ETH() external view returns (uint256) {
        return uei_in_1_eth;
        
    }
    function getWeiInxUSDC(uint256 x) external view returns (uint256) {
        return wei_in_1_usdc*x;
    }
    function getUeiInxETH(uint256 x) external view returns (uint256) {
        return uei_in_1_eth*x;
        
    }
}

