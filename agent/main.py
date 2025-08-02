from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, AgentType
from dotenv import dotenv_values
from twitter_scraper import scrape_twitter, format_tweets, save_tweets
from tools import search_tool, write_to_file
import asyncio
import json
import sys
import os
from datetime import datetime, timezone, timedelta



import google.generativeai as genai
config = dotenv_values(".env")

genai.configure(api_key=config["GEMINI_API_KEY"])




def is_cache_valid():
    if os.path.isfile("data.json"):
        with open("data.json", "r") as f:
            try:
                timestamp_str = json.loads(f.read())["timestamp"]
            except:
                return False
            
            dt = datetime.strptime(timestamp_str, "%Y-%m-%d_%H:%M:%S_UTC")
            dt = dt.replace(tzinfo=timezone.utc)
            now = datetime.now(timezone.utc)
            if now-dt < timedelta(days=7):
                return True

    return False


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    google_api_key = config["GEMINI_API_KEY"],
    temperature=0.7
)

tools = [search_tool, write_to_file]

agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.OPENAI_FUNCTIONS,
    agent_kwargs={
        "system_message": "You are an expert blockchain market analyst and trader. You look out for profit opportunities in the future, events that may affect the the exchange rate of crptocurrencies against the USD. You need to keep in mind both sides of the equations, the cryptocurrency and USD. But you only give an output when you are certain that it will cause a shift in the market prices, as the money of your clients depends on your decisions. As input I give you a JSON like object of tweets- use these to analyse the current market sentiment, and try to find events that are going to occur in the near future that may cause an impact on the exchange rates of any cryptocurrency against the USD. In addition to this data, if you need any more information or you are uncertain about anything, you can use the web search tool. You report your answer as a list of events, containing event name, estimated time of occurence, and affected crypocurrencies."
    },
    verbose=True
)


twitter_results_json = None
if is_cache_valid():
    with open("data.json", "r") as f:
        twitter_results_json = json.dumps(json.loads(f.read())["tweets"])

        
else:
    twitter_results = asyncio.run(scrape_twitter())

    if isinstance(twitter_results, Exception):
        sys.exit()
        
    formatted_tweets = format_tweets(twitter_results)
    save_tweets(formatted_tweets)
    twitter_results_json = json.dumps(formatted_tweets)


# ("human", "These are some tweests that show latest user sentiment. Study these to give me a list of relevant events: {twitter_results_json}"),
response = agent.run(f"Study the data I am giving, and use web search, to determine relevant upcoming events- {twitter_results_json}")

print(response)

# steps of chain:
# 1. analyze the tweets to find events, and also use search tool along with the twiter data
# 2. analyze the outcomes of these events and its effect on the stock prices, using a search tool.


#https://github.com/guidance-ai/guidance

# sources to analyze: twitter, reddit, polymarket, finshots, finimize
# https://finimize.com/topics/etfs
# langchain, puppeteer+bueifulsop4, chromadb, setiment analysis: https://huggingface.co/ProsusAI/finbert, 
# price api, coingekko or binance maybe, etherscan accha hai for on chain data to feed the agent,


