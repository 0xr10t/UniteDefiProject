import json
import requests
from datetime import datetime, timezone, timedelta

# ACCOUNTS_TO_TRACK = [
#     "cz_binance", "VitalikButerin", "aantonop", "CoinDesk", "MessariCrypto", "laurashin", "wun", "RaoulPalReal", "Nansen_ai", "Coinbase", "WatcherGuru", "CryptoWendyO", "scottmelker", "APompliano", "TheBlock__", "Cointelegraph", "balajis", "brian_armstrong", "michael_saylor", "nic__carter", "samczsun", "ChrisBlec", "zachxbt", "sassal0x", "chainlinkgod", "SECGov", "CFTC", "federalreserve", "eigenlayer"
# ]
ACCOUNTS_TO_TRACK = [
    "cz_binance", "VitalikButerin", "aantonop", "CoinDesk", "MessariCrypto", "laurashin", "wun", "RaoulPalReal", "Nansen_ai", "Coinbase", "WatcherGuru", "CryptoWendyO", "scottmelker", "APompliano"]


CASHTAGS_TO_TRACK = [
    "$BTC", "$ETH", "$USDT", "$BNB", "$SOL", "$XRP", "$USDC", "$ADA", "$LDO", "$LINK", "$MATIC", "$STETH"
]

HASHTAGS_TO_TRACK = [
    "#Ethereum", "#ETH", "#Bitcoin", "#BTC", "#Crypto", "#Blockchain", "#DeFi", "#NFT", "#Web3", "#CryptoNews", "#EthereumNews", "#BitcoinNews", "#CryptoTrading", "#FOMC", "#CryptoRegulation", "#EthereumETF", "#BitcoinETF", "#Dencun", "#Layer2", "#BitcoinHalving", "#CryptoMarket", "#Airdrop", "#Binance", "#Coinbase", "#CryptoAnalysis", "#SmartContracts", "#EthereumStaking", "#EIP1559", "#PectraUpgrade", "#StablecoinRegulation", "#CryptoETFs"
]

SEARCH_TERMS = [
    "FOMC Ethereum", "FOMC Bitcoin", "SEC crypto regulation ETH", "SEC crypto regulation BTC", "Ethereum ETF", "Bitcoin ETF", "Dencun upgrade", "EIP-1559", "Layer 2 Ethereum", "CPI inflation ETH", "CPI inflation BTC", "Fed rate hike Ethereum", "Fed rate hike Bitcoin", "crypto regulation", "Ethereum staking", "DeFi Ethereum", "Web3 Ethereum", "Binance listing ETH", "Binance listing BTC", "Coinbase listing ETH", "Coinbase listing BTC", "crypto whale ETH", "crypto whale BTC", "altcoin season", "Trump tariffs crypto", "US debt ceiling ETH", "US debt ceiling BTC", "Ethereum scalability", "Bitcoin mining", "crypto hack ETH", "crypto hack BTC", "blockchain technology", "Ethereum restaking Eigenlayer", "Pectra upgrade Ethereum", "Stablecoin regulation", "AI crypto integration", "Geopolitical events crypto"
]

print(len(ACCOUNTS_TO_TRACK+CASHTAGS_TO_TRACK+HASHTAGS_TO_TRACK+SEARCH_TERMS))

# Initialize client

def utc_timestring_1week() -> str:
    now = datetime.now(timezone.utc) - timedelta(weeks=1)
    return now.strftime("%Y-%m-%d_%H:%M:%S_UTC")

def get_curr_timestamp():
    now = datetime.now(timezone.utc)
    timestamp_str = now.strftime("%Y-%m-%d_%H:%M:%S_UTC")
    return timestamp_str



async def scrape_twitter():
    search_results = []
        
    ts = utc_timestring_1week()
    
    
    try:
                
        for user in ACCOUNTS_TO_TRACK:

            url = 'https://api.twitterapi.io/twitter/tweet/advanced_search'
            # headers = {'x-api-key': 'd9735db64da744a49622fe5e6021b90f'}
            # headers = {'x-api-key': 'ba3ce685346e4ed398ac213261902337'}
            headers = {'x-api-key': 'ab57508a838a4d3db3b37d1ce062b39a'}
            params = {"query": f"from:{user} since:{ts}", "queryType":"Top"}
            response = requests.get(url, headers=headers, params=params)

            if response.status_code != 200:
                raise Exception(f"Error {response.status_code} in getting from twitter API")        
        
            data = response.json()
        
            search_results.extend(data["tweets"])

        for keyword in (ACCOUNTS_TO_TRACK+HASHTAGS_TO_TRACK+SEARCH_TERMS):    

            url = 'https://api.twitterapi.io/twitter/tweet/advanced_search'
            # headers = {'x-api-key': 'd9735db64da744a49622fe5e6021b90f'}
            # headers = {'x-api-key': 'ba3ce685346e4ed398ac213261902337'}
            headers = {'x-api-key': 'ab57508a838a4d3db3b37d1ce062b39a'}
            params = {"query": f"{keyword} since:{ts}", "queryType":"Top"}
            response = requests.get(url, headers=headers, params=params)

            if response.status_code != 200:
                raise Exception(f"Error {response.status_code} in getting from twitter API")        

            data = response.json()
        
            search_results.extend(data["tweets"])
            
        
        return search_results
            
    except Exception as e:
        print("chudgya")
        print(e)
        return e
            

    
def format_tweets(search_resuts):
    ret = {"tweets": []}
    for tweet in search_resuts:
        ret["tweets"].append(
            {
                "from" : tweet["author"]["userName"],
                "isAuthorVerified": tweet["author"]["isBlueVerified"],
                "time": tweet["createdAt"],
                "body": tweet["text"],
                # "lang": tweet.lang,
                "likes_count": tweet["likeCount"],
                "view_count": tweet["viewCount"]
            }
        )
    return ret

def save_tweets(dict_of_tweets):
    dict_of_tweets["timestamp"] = get_curr_timestamp()
    with open("data.json", 'w') as f:
        f.write(json.dumps(dict_of_tweets))