// Use global ethers from CDN instead of importing
// import{ethers} from "ethers"
// buildMakerTraits will be defined locally since we can't import from npm in browser

const domain={
  name: "1inch Limit Order Protocol",
  version: "3",
  chainId: 1, //don't know right now 
  verifyingContract: "0x1111111254EEB25477B68fb85Ed929f73A960582" //verifying contract in our case it will be limit order protocol
}

const types = {//check type are correct or not 
    Order:[
    { name: "salt", type: "string" },
    { name: "maker", type: "address" },
    { name: "receiver", type: "address" },
    { name: "makerAsset", type: "address" },
    { name: "takerAsset", type: "address" },
    { name: "makingAmount", type: "uint256" },
    { name: "takingAmount", type: "uint256" },
    { name: "makerTraits", type: "uint256" },//doubtful in this will it be string or something else
    // { name: "secretHashes", type: "bytes32[]" },//bytes32,it is a array ig
    // {name:"fills",type:"string[]"}
    ]
}

const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32))

// Function to build maker traits (local implementation)
function buildMakerTraits({
  allowMultipleFills = false,
  allowPartialFills = false,
  usePermit2 = false,
  hashLock = false,
}) {
  let traits = 0n;

  if (allowMultipleFills) traits |= 1n << 255n;
  if (allowPartialFills)  traits |= 1n << 253n;
  if (usePermit2)         traits |= 1n << 252n;
  if (hashLock)           traits |= 1n << 250n;

  return traits.toString(); // use this as makerTraits
}

const makerTraits = buildMakerTraits({// ek baar check krlena limit order protocol ki lib se
  allowMultipleFills: false,
  allowPartialFills: false,
  usePermit2: false,
  hashLock: true,
})

const secrethash=ethers.utils.keccak256(secret)

const message={
    salt: secret,//it should be uint256 ig
    maker:  makeraddress,
    receiver:  "0x0000000000000000000000000000000000000000",
    makerAsset:  usdceth,
    takerAsset:  usdcmonad,
    makingAmount:  makingAmount,
    takingAmount :  takingamount,
    makerTraits:makerTraits,
    // secretHashes:[secrethash],
    // fills:[]
}

function computeMessageHash(){
    const hash = ethers.TypedDataEncoder.hash(domain,types,message)
    return hash
}


 async function signMessage() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, {
    name: 'sepolia',
    chainId: 11155111
  }) 
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  const signature = await signer._signTypedData(domain, types, message) 
  return signature
}


