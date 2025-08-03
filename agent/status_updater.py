from web3 import Web3
from dotenv import dotenv_values

config = dotenv_values(".env")

def update(orderID, status):
    
    w3 = Web3(Web3.HTTPProvider("https://eth-sepolia.g.alchemy.com/v2/2MP119h1LpgpO7DALxVly"))
    contract_address = Web3.to_checksum_address("0x738e439ABcc68664aa6DFFD7ab497cbb76745652")
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
				"internalType": "string",
				"name": "orderID",
				"type": "string"
			},
			{
				"indexed": False,
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "DataUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "orderID",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "updateData",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "orderID",
				"type": "string"
			}
		],
		"name": "getData",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
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
    private_key = private_key = config["PRIVATE_KEY"]
    oracle_account = w3.eth.account.from_key(private_key)

    tx = contract.functions.updateData(orderID, status).build_transaction({
        'from': oracle_account.address,
        'nonce': w3.eth.get_transaction_count(oracle_account.address),
        'gas': 100000,
        'gasPrice': w3.to_wei('5', 'gwei')
    })

    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

    print(f"Submitted data tx: {w3.toHex(tx_hash)}")

