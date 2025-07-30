import asyncio
from twikit import Client

USERNAME = 'tigpig0707'
EMAIL = 'tigpig0707@gmail.com'
PASSWORD = 'tiggyisapiggy'

ACCOUNTS_TO_TRACK = [
    "@cz_binance", "@VitalikButerin", "@aantonop", "@CoinDesk", "@MessariCrypto", "@laurashin",
    "@wun", "@RaoulPalReal", "@Nansen_ai", "@Coinbase", "@WatcherGuru", "@CryptoWendyO",
    "@scottmelker", "@APompliano", "@TheBlock__", "@Cointelegraph", "@balajis", "@brian_armstrong",
    "@cameron", "@tyler", "@michael_saylor", "@nic__carter", "@el33th4xor", "@krakenfx", "@glassnode",
    "@samczsun", "@ChrisBlec", "@zachxbt", "@lawmaster", "@intocryptoverse", "@0xfoobar",
    "@ERCOTX", "@sassal0x", "@chainlink", "@chainlinkgod",
    "@SECGov", "@CFTC", "@federalreserve", "@eigenlayer", "@WorldEconomicForum", "@GaryGensler"
]

CASHTAGS_TO_TRACK = [
    "$BTC", "$ETH", "$USDT", "$BNB", "$SOL", "$XRP", "$USDC", "$ADA", "$DOGE", "$TRX",
    "$AVAX", "$SHIB", "$LINK", "$DOT", "$MATIC", "$LTC", "$BCH", "$NEAR", "$UNI",
    "$RUNE", "$LDO", "$GMX", "$JTO", "$PYTH", "$TIA", "$BLAST",
    "$STETH", "$USDE", "$AI", "$RWA", "$OP"
]

HASHTAGS_TO_TRACK = [
    "#Ethereum", "#ETH", "#Bitcoin", "#BTC", "#Crypto", "#Cryptocurrency", "#Blockchain", "#DeFi",
    "#NFT", "#Web3", "#CryptoNews", "#EthereumNews", "#BitcoinNews", "#CryptocurrencyNews",
    "#CryptoTrading", "#EthereumTrading", "#BitcoinTrading", "#FOMC", "#CryptoRegulation",
    "#EthereumETF", "#BitcoinETF", "#Layer2", "#BitcoinHalving",
    "#CryptoMarket", "#Airdrop", "#Binance", "#Coinbase", "#CryptoCommunity", "#CryptoAnalysis",
    "#BlockchainTechnology", "#CryptoInvestor", "#SmartContracts", "#EIP1559",
    "#Solana", "#Rollups", "#Restaking", "#ModularBlockchain", "#RealWorldAssets", "#DePIN",
    "#ETHRestaking", "#CryptoHack", "#CryptoLiquidations",
    "#PectraUpgrade", "#StablecoinRegulation", "#CryptoETFs", "#AIBlockchain", "#GeopoliticalCrypto"
]

SEARCH_TERMS = [
    "FOMC meeting 2025 crypto impact", "SEC crypto regulation ETH", "SEC crypto regulation BTC",
    "Ethereum ETF", "Bitcoin ETF", "EIP-1559",
    "Layer 2 Ethereum", "CPI inflation ETH 2025", "CPI inflation BTC 2025", "Fed rate hike Ethereum 2025",
    "Fed rate hike Bitcoin 2025", "crypto regulation USA EU India 2025", "Ethereum staking",
    "DeFi Ethereum", "Web3 Ethereum", "Binance listing ETH", "Binance listing BTC", "Coinbase listing ETH",
    "Coinbase listing BTC", "crypto whale ETH", "crypto whale BTC", "altcoin season",
    "Trump tariffs crypto", "US debt ceiling ETH", "US debt ceiling BTC", "Ethereum scalability",
    "Bitcoin mining", "crypto hack ETH", "crypto hack BTC", "blockchain technology",
    "Ethereum restaking Eigenlayer", "crypto liquidation alert", "crypto funding rate",
    "Solana downtime", "rollup upgrade", "Eigenlayer slashing", "real world assets DeFi",
    "ETH reorg", "Solana congestion",
    "Pectra upgrade Ethereum May 2025", "Trump crypto executive order January 2025",
    "Stablecoin bills STABLE Act GENIUS Act 2025", "Fed interest rate decision 2025",
    "AI crypto integration 2025", "Geopolitical events tariffs crypto 2025",
    "Ethereum sharding rollout 2025", "Ethereum post-Merge developments 2025"
]

# Initialize client
client = Client('en-US')

async def main():
    await client.login(
        auth_info_1=USERNAME,
        auth_info_2=EMAIL,
        password=PASSWORD,
        cookies_file='cookies.json'
    )
    
    user = await client.get_user_by_screen_name("chainlink")

    tweets = await client.get_user_tweets(user_id=user.id, tweet_type="Tweets")

    for tweet in tweets:
        # print(tweet.user.name)
        print(tweet.full_text)
        # print(tweet.created_at)
        print("--------------------------------")

asyncio.run(main())
