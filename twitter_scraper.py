from twikit import Client, Tweet
import time
import json

USERNAME = 'tigpig0707'
EMAIL = 'tigpig0707@gmail.com'
PASSWORD = 'tiggyisapiggy'

USERNAMES = ['tigpig0707', ]
EMAILS = ['tigpig0707@gmail.com',]
PASSWORDS = ['tiggyisapiggy', ]

ACCOUNTS_TO_TRACK = [
    "cz_binance",          # Binance updates, regulatory news
    "VitalikButerin",     # Ethereum development insights
    "aantonop",           # Bitcoin education, blockchain fundamentals
    "CoinDesk",           # Crypto news and analysis
    "MessariCrypto",      # On-chain data, market research
    "laurashin",          # Crypto journalism, in-depth interviews
    "wun",                # Bitcoin price analysis
    "RaoulPalReal",       # Macro trends impacting crypto
    "Nansen_ai",          # On-chain analytics, sentiment
    "Coinbase",           # Exchange listings, regulatory updates
    "WatcherGuru",        # Real-time crypto news
    "CryptoWendyO",       # Trading insights, market trends
    "scottmelker",        # Trading and market commentary
    "APompliano",         # Bitcoin advocacy, market updates
    "TheBlock__",         # Crypto news, regulatory updates
    "Cointelegraph",      # Breaking crypto news
    "balajis",            # Decentralized tech, market insights
    "brian_armstrong",    # Coinbase CEO, regulatory news
    "michael_saylor",     # Bitcoin institutional adoption
    "nic__carter",        # Bitcoin analysis, macro insights
    "samczsun",           # Ethereum security, smart contract audits
    "ChrisBlec",          # DeFi and regulatory commentary
    "zachxbt",            # Crypto scam investigations
    "sassal0x",           # Ethereum ecosystem updates
    "chainlinkgod",       # Chainlink and DeFi insights
    "SECGov",             # US regulatory updates
    "CFTC",               # US commodity regulation
    "federalreserve",     # Macroeconomic policy updates
    "eigenlayer"          # Ethereum restaking developments
]

CASHTAGS_TO_TRACK = [
    "$BTC",    # Bitcoin
    "$ETH",    # Ethereum
    "$USDT",   # Tether
    "$BNB",    # Binance Coin
    "$SOL",    # Solana
    "$XRP",    # XRP
    "$USDC",   # USD Coin
    "$ADA",    # Cardano
    "$LDO",    # Lido (Ethereum staking)
    "$LINK",   # Chainlink
    "$MATIC",  # Polygon
    "$STETH"   # Lido Staked ETH
]

HASHTAGS_TO_TRACK = [
    "#Ethereum",
    "#ETH",
    "#Bitcoin",
    "#BTC",
    "#Crypto",
    "#Blockchain",
    "#DeFi",
    "#NFT",
    "#Web3",
    "#CryptoNews",
    "#EthereumNews",
    "#BitcoinNews",
    "#CryptoTrading",
    "#FOMC",
    "#CryptoRegulation",
    "#EthereumETF",
    "#BitcoinETF",
    "#Dencun",
    "#Layer2",
    "#BitcoinHalving",
    "#CryptoMarket",
    "#Airdrop",
    "#Binance",
    "#Coinbase",
    "#CryptoAnalysis",
    "#SmartContracts",
    "#EthereumStaking",
    "#EIP1559",
    "#PectraUpgrade",
    "#StablecoinRegulation",
    "#CryptoETFs"
]

SEARCH_TERMS = [
    "FOMC Ethereum",
    "FOMC Bitcoin",
    "SEC crypto regulation ETH",
    "SEC crypto regulation BTC",
    "Ethereum ETF",
    "Bitcoin ETF",
    "Dencun upgrade",
    "EIP-1559",
    "Layer 2 Ethereum",
    "CPI inflation ETH",
    "CPI inflation BTC",
    "Fed rate hike Ethereum",
    "Fed rate hike Bitcoin",
    "crypto regulation",
    "Ethereum staking",
    "DeFi Ethereum",
    "Web3 Ethereum",
    "Binance listing ETH",
    "Binance listing BTC",
    "Coinbase listing ETH",
    "Coinbase listing BTC",
    "crypto whale ETH",
    "crypto whale BTC",
    "altcoin season",
    "Trump tariffs crypto",
    "US debt ceiling ETH",
    "US debt ceiling BTC",
    "Ethereum scalability",
    "Bitcoin mining",
    "crypto hack ETH",
    "crypto hack BTC",
    "blockchain technology",
    "Ethereum restaking Eigenlayer",
    "Pectra upgrade Ethereum",
    "Stablecoin regulation",
    "AI crypto integration",
    "Geopolitical events crypto"
]

print(len(ACCOUNTS_TO_TRACK+CASHTAGS_TO_TRACK+HASHTAGS_TO_TRACK+SEARCH_TERMS))

# Initialize client
client = Client('en-US')

async def scrape_twitter():
    search_results = []
    
    accounts_to_track_index = 0
    others_index = 0
    account_no = 0
    
    while True:
    
        try:

            await client.login(
                auth_info_1=USERNAMES[account_no],
                auth_info_2=EMAILS[account_no],
                password=PASSWORDS[account_no],
                cookies_file='cookies.json'
            )
            
            for user in ACCOUNTS_TO_TRACK[accounts_to_track_index:]:
                user = await client.get_user_by_screen_name("chainlink")
                
                tweets = await client.get_user_tweets(user_id=user.id, tweet_type="Tweets", count=2)
                
                search_results.extend(tweets)
                accounts_to_track_index +=1
                print(accounts_to_track_index)

            for keyword in (ACCOUNTS_TO_TRACK+HASHTAGS_TO_TRACK+SEARCH_TERMS)[others_index:]:    

                tweets = await client.search_tweet(keyword, product="Top", count=2)

                search_results.extend(tweets)
                others_index+=1
                
            
                
            return search_results
        

                
        except Exception as e:
            print("chudgya")
            await client.logout()
            time.sleep(5)
            if account_no == len(USERNAMES)-1:
                return e
            account_no+=1
            print(e)
            

    
def format_tweets(search_resuts: list[Tweet]):
    ret = {"tweets": []}
    for tweet in search_resuts:
        ret["tweets"].append(
            {
                "from" : tweet.user.name,
                "time": tweet.created_at,
                "body": tweet.full_text,
                # "lang": tweet.lang,
                "likes_count": tweet.favorite_count,
                "view_count": tweet.view_count,
                "view_count": tweet.community_note                
            }
        )
    return ret

def save_tweets(dict_of_tweets):
    with open("data.json", 'r') as f:
        f.write(json.dumps(dict_of_tweets))