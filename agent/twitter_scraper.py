import json
import requests
from datetime import datetime, timezone, timedelta

ACCOUNTS_TO_TRACK = [
    "cz_binance", "VitalikButerin", "aantonop", "CoinDesk", "MessariCrypto", "laurashin", "wun", "RaoulPalReal", "Nansen_ai", "Coinbase", "WatcherGuru", "CryptoWendyO", "scottmelker", "APompliano", "TheBlock__", "Cointelegraph", "balajis", "brian_armstrong", "michael_saylor", "nic__carter", "samczsun", "ChrisBlec", "zachxbt", "sassal0x", "chainlinkgod", "SECGov", "CFTC", "federalreserve", "eigenlayer"
]

CASHTAGS_TO_TRACK = [
    "$ETH", "$USDC"
]

HASHTAGS_TO_TRACK = [
    "#ETH", "#USDC", "#Ethereum", "#CryptoTrading", "#Stablecoins",
    "#ETHUSDC", "#EthereumNews", "#USDCNews", "#EthereumTrading",
    "#DeFi", "#CryptoMarket", "#StablecoinRegulation"
]

SEARCH_TERMS = [
    "ETH/USDC liquidity", "ETH/USDC arbitrage", "ETH USDC price",
    "ETH USDC depeg", "ETH USDC Coinbase", "ETH USDC Binance",
    "ETH USDC limit order", "ETH USDC whale", "ETH USDC trade volume",
    "ETH USDC volatility", "ETH USDC pool", "ETH USDC Uniswap",
    "ETH USDC Curve", "ETH USDC Fusion", "ETH USDC slippage",
    "USDC regulation", "Circle USDC", "ETH funding rates",
    "USDC interest rate", "ETH gas fee impact", "ETH stablecoin swap"
]




# Initialize client

def utc_timestring_1week() -> str:
    now = datetime.now(timezone.utc) - timedelta(weeks=1)
    return now.strftime("%Y-%m-%d_%H:%M:%S_UTC")




async def scrape_twitter():
    search_results = []
        
    ts = utc_timestring_1week()
    
    
    # try:
                
    for user in ACCOUNTS_TO_TRACK:

        url = 'https://api.twitterapi.io/twitter/tweet/advanced_search'
        # headers = {'x-api-key': 'd9735db64da744a49622fe5e6021b90f'}
        headers = {'x-api-key': 'ba3ce685346e4ed398ac213261902337'}
        # headers = {'x-api-key': 'ab57508a838a4d3db3b37d1ce062b39a'}
        params = {"query": f"from:{user} since:{ts}", "queryType":"Top"}
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise Exception(f"Error {response.status_code} in getting from twitter API")        
    
        data = response.json()
    
        search_results.extend(data["tweets"])

    for keyword in (ACCOUNTS_TO_TRACK+HASHTAGS_TO_TRACK+SEARCH_TERMS):    

        url = 'https://api.twitterapi.io/twitter/tweet/advanced_search'
        # headers = {'x-api-key': 'd9735db64da744a49622fe5e6021b90f'}
        headers = {'x-api-key': 'ba3ce685346e4ed398ac213261902337'}
        # headers = {'x-api-key': 'ab57508a838a4d3db3b37d1ce062b39a'}
        params = {"query": f"{keyword} since:{ts}", "queryType":"Top"}
        response = requests.get(url, headers=headers, params=params)

        if response.status_code != 200:
            raise Exception(f"Error {response.status_code} in getting from twitter API")        

        data = response.json()
    
        search_results.extend(data["tweets"])
        
    
    return search_results
            
    # except Exception as e:
    #     return e
            

    
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

