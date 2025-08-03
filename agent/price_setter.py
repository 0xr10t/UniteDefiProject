import requests
from web3 import Web3
from dotenv import dotenv_values

config = dotenv_values(".env")

def get_wei_in_1_usdc():
    url = "https://api.binance.com/api/v3/ticker/price"
    params = {"symbol": "ETHUSDC"}
    response = requests.get(url, params=params)
    data = response.json()
    rate =  float(data['price'])
    return 1/rate * 10**18


def get_uei_in_1_eth():
    url = "https://api.binance.com/api/v3/ticker/price"
    params = {"symbol": "ETHUSDC"}
    response = requests.get(url, params=params)
    data = response.json()
    return float(data['price'])* 10**6

def update():
    wei_in_1_usdc = get_wei_in_1_usdc()
    uei_in_1_eth = get_uei_in_1_eth()
    
    w3 = Web3(Web3.HTTPProvider("https://eth-sepolia.g.alchemy.com/v2/2MP119h1LpgpO7DALxVly"))
    contract_address = Web3.toChecksumAddress("0x738e439ABcc68664aa6DFFD7ab497cbb76745652")
    abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": False,
            "inputs": [
                {
                    "indexed": False,
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "indexed": False,
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "DataUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "wei_usdc",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "uei_eth",
                    "type": "uint256"
                }
            ],
            "name": "updateData",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getUeiIn1ETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "x",
                    "type": "uint256"
                }
            ],
            "name": "getUeiInxETH",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getWeiIn1USDC",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "x",
                    "type": "uint256"
                }
            ],
            "name": "getWeiInxUSDC",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
   
    contract = w3.eth.contract(address=contract_address, abi=abi)
    private_key = config["PRIVATE_KEY"]
    oracle_account = w3.eth.account.from_key(private_key)

    tx = contract.functions.updateData(wei_in_1_usdc, uei_in_1_eth).build_transaction({
    'from': oracle_account.address,
    'nonce': w3.eth.get_transaction_count(oracle_account.address),
    'gas': 100000,
    'gasPrice': w3.toWei('5', 'gwei')
    })

    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)

    print(f"Submitted data tx: {w3.toHex(tx_hash)}")
