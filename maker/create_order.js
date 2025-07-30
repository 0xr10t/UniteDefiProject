require("dotenv").config()

import {
  getRandomBytes32,
  SDK,
  HashLock,
  PrivateKeyProviderConnector,
  NetworkEnum,
} from "@1inch/cross-chain-sdk"

const blockchainProvider = new MetamaskProviderConnector(signer)

const sdk = new SDK({
  url: "https://api.1inch.dev/fusion-plus",
  authKey: process.env.API_KEY_1INCH,
  blockchainProvider:signerfromgetsignermetamask,
})

const params = {
  srcChainId: 11155111, //sepoliachainID
  dstChainId: 728126428, //tronChainID
  srcTokenAddress: usdc,
  dstTokenAddress: usdctron,
  amount: usdcamount,
  enableEstimate: true,
  walletAddress: makerAddress,
}

const quote = await sdk.getQuote(params)

const secretsCount = quote.getPreset().secretsCount

const secrets = Array.from({ length: secretsCount }).map(() =>
  getRandomBytes32(),
)
const secretHashes = secrets.map((x) => HashLock.hashSecret(x))

const hashLock =
  secretsCount === 1
    ? HashLock.forSingleFill(secrets[0])
    : HashLock.forMultipleFills(
        secretHashes.map(leaves
      )
    )
const leaves = secretHashes.map((secretHash, i) => {
  const leaf = solidityPackedKeccak256(["uint64", "bytes32"], [i, secretHash.toString()])
  leaf._tag = "MerkleLeaf" // Add tag manually
  return leaf
})

//when the maker call the order this comes 
sdk
  .createOrder(quote, {
    walletAddress: makerAddress,
    hashLock,
    secretHashes,
    fee: {
      takingFeeBps: 100, // 1% as we use bps format, 1% is equal to 100bps
      takingFeeReceiver: ouraddress, //  fee receiver address
    },
  })
  .then(console.log)