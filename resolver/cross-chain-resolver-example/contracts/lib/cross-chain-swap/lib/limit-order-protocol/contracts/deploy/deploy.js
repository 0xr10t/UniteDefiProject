const hre = require('hardhat');
const { getChainId, network } = hre;

const wethByNetwork = {
    hardhat: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    mainnet: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
};

module.exports = async ({ getNamedAccounts, deployments }) => {
    console.log('running deploy script');
    console.log('network id ', await getChainId());

    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const limitOrderProtocol = await deploy('LimitOrderProtocol', {
        from: deployer,
        args: [wethByNetwork[network.name]],
    });

    console.log('LimitOrderProtocol deployed to:', limitOrderProtocol.address);

    if (await getChainId() !== '31337') {
        await hre.run('verify:verify', {
            address: limitOrderProtocol.address,
            constructorArguments: [wethByNetwork[network.name]],
        });
    }
};

module.exports.skip = async () => true;