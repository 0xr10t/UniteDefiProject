import requests
from web3 import Web3

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
    
    w3 = Web3(Web3.HTTPProvider("<YOUR_INFURA_URL>"))
    contract_address = Web3.toChecksumAddress("<DEPLOYED_CONTRACT_ADDRESS>")
    abi = [...]
    contract = w3.eth.contract(address=contract_address, abi=abi)
    private_key = "<YOUR_PRIVATE_KEY>"
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
