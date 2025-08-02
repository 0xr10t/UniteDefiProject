import{ethers} from "ethers"
import { buildMakerTraits } from "@1inch/limit-order-protocol-utils"

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
    makerAsset:  "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
    takerAsset:  "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
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
  const provider = new ethers.providers.Web3Provider(window.ethereum) 
  await provider.send("eth_requestAccounts", [])
  const signer = provider.getSigner()
  const signature = await signer._signTypedData(domain, types, message) 
  return signature
}

//forgot where to use this :( this the thing for relayer 
{
  order,
  signature,//signMessage se joh milra
  extension,//secrethash
  auctionStartDate,//makersignsafterthat
  auctionEndDate,//wedecide
  srcChainId,
  dstChainId
}// send this to backend relayer  



const types1={
  Immutables: [
    { name: "orderHash", type: "bytes32" },
    { name: "hashlock", type: "bytes32" },
    { name: "maker", type: "address" },
    { name: "taker", type: "address" },
    { name: "token", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "safetyDeposit", type: "uint256" },
    { name: "timelocks", type: "Timelocks" } ,
    { name: "parameters", type: "bytes" } 
  ],


 Timelocks:[
    { name: "srcWithdrawal", type: "uint256" },
    { name: "srcPublicWithdrawal", type: "uint256" },
    { name: "srcCancellation", type: "uint256" },
    { name: "srcPublicCancellation", type: "uint256" },
    { name: "dstWithdrawal", type: "uint256" },
    { name: "dstPublicWithdrawal", type: "uint256" },
    { name: "dstCancellation", type: "uint256" }
 ]
}

const now = Math.floor(Date.now() / 1000)

const timelocks = {
  SrcWithdrawal:   15 * 60,
  SrcPublicWithdrawal:   20 * 60,
  SrcCancellation:   30 * 60,
  SrcPublicCancellation:   40 * 60,
  DstWithdrawal:   15 * 60,
  DstPublicWithdrawal:   20 * 60,
  DstCancellation:   30 * 60
}

const finalImmutablessrc = {
  orderHash: computeMessageHash(),
  hashlock: secrethash,
  maker: makeraddress,
  taker: reciever,
  token: srctoken,
  amount: resolveramount,
  safetyDeposit:  ethers.utils.parseEther("0.0001"),
  timelocks: encodeTimelocks(timelocks, now) ,
  parameters: "0x" // for now
}

const finalImmutablesdst = {
  orderHash: computeMessageHash(),
  hashlock: secrethash,
  maker: makeraddress,
  taker: reciever,
  token: dsttoken,
  amount: makeramount,
  safetyDeposit:  ethers.utils.parseEther("0.0001"),
  timelocks: encodeTimelocks(timelocks, now) ,
  parameters: "0x" // for now
}

//timelock

function encodeTimelocks(timelocks, now){
  return (
    (BigInt(now) << 224n) |
    (BigInt(timelocks.SrcWithdrawal) << 192n) |
    (BigInt(timelocks.SrcPublicWithdrawal) << 160n) |
    (BigInt(timelocks.SrcCancellation) << 128n) |
    (BigInt(timelocks.SrcPublicCancellation) << 96n) |
    (BigInt(timelocks.DstWithdrawal) << 64n) |
    (BigInt(timelocks.DstPublicWithdrawal) << 32n) |
    BigInt(timelocks.DstCancellation)
  )
}


//r and vs
const sig = await signer._signTypedData(domain, types, message) 
const sigSplit = ethers.utils.splitSignature(sig)
const { r, s, v } = sigSplit
const vs = (s & 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn) | (v == 28 ? 1n << 255n : 0n)

  
const takerTraits = buildTakerTraits({
  argsHasTarget: true,
  argsInteractionLength: 32,
  argsExtensionLength: 0
});

function buildTakerTraits({ argsHasTarget = false, argsInteractionLength = 0, argsExtensionLength = 0 }) {
  let traits = 0n;
  if (argsHasTarget) traits |= 1n << 251n;
  traits |= BigInt(argsInteractionLength) << 200n; // because argsMem = abi.encodePacked(computed, args)` → first 20 bytes = target contract

//amount user is depositing
//from frontend it will come 

  traits |= BigInt(argsExtensionLength) << 224n;
  return traits.toString(); // to use in contracts
}


//args
const args = ethers.utils.concat([
  ethers.utils.zeroPad(resolveraddress, 20),
  secret
]);





 