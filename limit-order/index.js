import { Sdk, Address, MakerTraits, randBigInt, FetchProviderConnector, LimitOrderPredicateBuilder } from '@1inch/limit-order-sdk';
import { ethers, Interface } from 'ethers';
import { AbiCoder } from 'ethers/lib/utils';




async function createLimitOrder(orderID, makingAmount, takingAmount, makerAssetAddress, takerAssetAddress) {
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();

    const sdk = new Sdk({
        authKey: 'dummy',
        networkId: 1,
        httpConnector: new FetchProviderConnector()
    });


    const predicateBuilder = new LimitOrderPredicateBuilder(
        sdk.contracts.limitOrderProtocol.address,
        sdk.provider
    );
    const expiration = BigInt(Math.floor(Date.now() / 1000)) + 31_536_000n; // 1 year expiry

    const timePredicate = predicateBuilder.timestampBelow(expiration);


    const oracleAddress = '0xYourOracleAddress';
    const key = orderID; //uint256

    const abi = ['function getData(uint256) view returns (bool)'];
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

    var order;

    if (makingAmount === 1n){
        order = await sdk.createOrder({
            makerAsset: new Address(makerAssetAddress),
            takerAsset: new Address(takerAssetAddress),
            makingAmount,
            takingAmount,
            makerAssetData: encodeAmountGetter("something"), 
            maker: new Address(userAddress)
        }, traits);

    }
    else if (takingAmount === 1n){
        order = await sdk.createOrder({
            makerAsset: new Address(makerAssetAddress),
            takerAsset: new Address(takerAssetAddress),
            makingAmount,
            takingAmount,
            takerAssetData: encodeAmountGetter("something"), 
            maker: new Address(userAddress)
        }, traits);

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

}



// user flow:
// pehle frontend pe user bolega mujhe satta lagana hai, fir vaha se agent invoke hoga. fir vo agent ek limit order likhega, aur frontend pe bhejega sign karne ke lie. 
// we make the user sign the order with a long expiry (1yr). 
// this order is sent on chain. 
// the order checks using a predicate with our server, to check if needs to be executed.
// when the API is set to true (ie execute), an expiry bomb is created, after which the predicate is permanently set to no.
// the taker amount is dynamic, which would be set near the current market price.
