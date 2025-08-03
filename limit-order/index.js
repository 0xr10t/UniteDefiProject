import { Sdk, Address, MakerTraits, randBigInt, FetchProviderConnector, LimitOrderPredicateBuilder } from '@1inch/limit-order-sdk';
import { ethers, Interface } from 'ethers';
import { encodeAmountGetter } from '@1inch/limit-order-protocol-utils';
import { LimitOrderProtocolFacade } from '@1inch/limit-order-protocol-utils';
import { LimitOrderBuilder } from '@1inch/limit-order-protocol-utils';
import { Web3ProviderConnector } from '@1inch/limit-order-protocol-utils'; // or similar depending on SDK version




async function createLimitOrder(orderID, makingAmount, takingAmount, makerAssetAddress, takerAssetAddress) {
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const connector = new Web3ProviderConnector(window.ethereum);

    const chainId = 11155111; // Sepolia
    const verifyingContract = '0x5ae1afcd924bf1a0ec576b0d7740cabbc9f4f356';

    const limitOrderBuilder = new LimitOrderBuilder(
        verifyingContract,
        chainId,
        provider // ethers.js provider connected to Sepolia
    );


    const sdk = new Sdk({
        authKey: 'dummy',
        contractAddress: '0x5ae1afcd924bf1a0ec576b0d7740cabbc9f4f356',
        chainId: 11155111,
        provider: connector,
        httpConnector: new FetchProviderConnector()
    });


    const predicateBuilder = new LimitOrderPredicateBuilder(
        sdk.contracts.limitOrderProtocol.address,
        sdk.provider
    );
    const expiration = BigInt(Math.floor(Date.now() / 1000)) + 31_536_000n; // 1 year expiry

    const timePredicate = predicateBuilder.timestampBelow(expiration);


    const oracleAddress = '0x603A0B8aeD412116875De035b8D31D35E1E1CA18'; // flag oracle
    const key = orderID; //string

    const abi = ['function getData(string) view returns (bool)'];
    const iface = new Interface(abi);

    const callData = iface.encodeFunctionData('getData', [key]);
    const oraclePredicate = predicateBuilder.callStatic(oracleAddress, callData);

    const combinedPredicate = predicateBuilder.and([timePredicate, oraclePredicate]);


    const UINT_40_MAX = (1n << 48n) - 1n;

    const traits = MakerTraits.default()
        .withExpiration(expiration)
        .withNonce(randBigInt(UINT_40_MAX))
        .withPredicate(combinedPredicate);

    if (typeof makingAmount !== "bigint" || typeof takingAmount !== "bigint"){
        // error
        return;
    }

    const priceOracleAddress = '0x738e439ABcc68664aa6DFFD7ab497cbb76745652'; // price oracle

    // these token addresses are for sepolia testnet
    var takerAssetData;

    if (makerAssetAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE" && takerAssetAddress === "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238	"){
        // eth se usdc me swap 
        const iface2 = new Interface(['function getUeiInxETH(uint256) view returns uint256']);// returns the number of usdc/10^6 in eth
        const getterCalldata = iface2.encodeFunctionData('getUeiInxETH', [makingAmount]);
        takerAssetData = encodeAmountGetter(
            priceOracleAddress,
            getterCalldata
        );

    }
    else if (makerAssetAddress === "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" && takerAssetAddress === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"){
        // usdc se eth me swap 
        const iface2 = new Interface(['function getWeiInxUSDC(uint256) view returns uint256']);// returns the number of eth/10^18 in usdc
        const getterCalldata = iface2.encodeFunctionData('getWeiInxUSDC', [makingAmount]);
        takerAssetData = encodeAmountGetter(
            priceOracleAddress,
            getterCalldata
        );

    }
    else{
        //error
        return;
    }

    var order;


    if (takingAmount === 1n){
        order = await sdk.createOrder({
            makerAsset: new Address(makerAssetAddress),
            takerAsset: new Address(takerAssetAddress),
            makingAmount,
            takingAmount,
            takerAssetData: takerAssetData, 
            maker: new Address(userAddress)
        }, traits);
    }
    else{
        // error (for now)
        return;
    }

    const typedData = order.getTypedData();

    const signature = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [
            userAddress,
            JSON.stringify({
                domain: typedData.domain,
                message: typedData.message,
                primaryType: 'Order',
                types: {
                    EIP712Domain: typedData.types.EIP712Domain,
                    Order: typedData.types.Order
                }
            })
        ]
    });
    
    
    console.log('Order:', order.buildOrderData());
    // then send the details of this order back to the server to store in the db and display to the user.
    console.log('Signature:', signature);

    await sdk.submitOrder(order, signature);
    const orderHash = LimitOrderProtocolFacade.getOrderHash(order, '0x5ae1afcd924bf1a0ec576b0d7740cabbc9f4f356');

}



// user flow:
// pehle frontend pe user bolega mujhe satta lagana hai, fir vaha se agent invoke hoga. fir vo agent ek limit order likhega, aur frontend pe bhejega sign karne ke lie. 
// we make the user sign the order with a long expiry (1yr). 
// this order is sent on chain. 
// the order checks using a predicate with our server, to check if needs to be executed.
// when the API is set to true (ie execute), an expiry bomb is created, after which the predicate is permanently set to no.
// the taker amount is dynamic, which would be set near the current market price.
