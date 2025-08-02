from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from dotenv import dotenv_values
from twitter_scraper import scrape_twitter, format_tweets
import asyncio
import json
import sys
import os
from datetime import datetime, timezone, timedelta



import google.generativeai as genai
config = dotenv_values(".env")

genai.configure(api_key=config["GEMINI_API_KEY"])



genai.configure(api_key=config["GEMINI_API_KEY"])




llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    google_api_key = config["GEMINI_API_KEY"],
    temperature=0.7
)

twitter_results = asyncio.run(scrape_twitter())

if isinstance(twitter_results, Exception):
    print(twitter_results)
    sys.exit()
    
print(twitter_results)
twitter_results_json = json.dumps(format_tweets(twitter_results))


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are an expert blockchain market analyst and trader. You look out for profit opportunities in the future, events that may \
                affect the the exchange rate of crptocurrencies against the USD. You need to keep in mind both sides of the equations, the cryptocurrency and USD.\
                    But you only give an output when you are certain that it will cause a shift in the market prices, as the money of your clients depends on your\
                        decisions. You report your answer as a list of events, containing event name, estimated time of occurence, and affected crypocurrencies.",
        ),
        ("human", "These are some tweets that show latest user sentiment. Study these to give me a list of relevant events: {twitter_results_json}"),
    ]
)

chain = prompt | llm
msg  = chain.invoke(
    {
        "twitter_results_json": twitter_results_json,
    }
)

# steps of chain:
# 1. analyze the tweets to find events, and also use search tool along with the twiter data
# 2. analyze the outcomes of these events and its effect on the stock prices, using a search tool.


#https://github.com/guidance-ai/guidance

# sources to analyze: twitter, reddit, polymarket, finshots, finimize
# https://finimize.com/topics/etfs
# langchain, puppeteer+bueifulsop4, chromadb, setiment analysis: https://huggingface.co/ProsusAI/finbert, 
# price api, coingekko or binance maybe, etherscan accha hai for on chain data to feed the agent,

print(msg.content)

