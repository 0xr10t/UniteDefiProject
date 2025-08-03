from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.agents import initialize_agent, AgentType
from dotenv import dotenv_values
from twitter_scraper import scrape_twitter, format_tweets
from tools import search_tool, write_to_file
import asyncio
import json
from datetime import datetime, timezone, timedelta
from db import MongoDB, OrderSchema
import time

config = dotenv_values(".env")


def is_cache_valid(tweets_doc):
        
    try:
        timestamp_str = tweets_doc["timestamp"]
    except:
        return False
    
    dt = datetime.strptime(timestamp_str, "%Y-%m-%d_%H:%M:%S_UTC")
    dt = dt.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    if now-dt < timedelta(days=7):
        
        return True

    return False

def get_curr_timestamp():
    now = datetime.now(timezone.utc)
    timestamp_str = now.strftime("%Y-%m-%d_%H:%M:%S_UTC")
    return timestamp_str

def mint_order():
    timestamp = datetime.now().strftime('%H%M%S%d%m%y')
    return timestamp # order id

def save_tweets(mdb, tweets):
    tweets["timestamp"] = get_curr_timestamp()
    try:
        mdb["tweets"].drop()
    except: 
        pass

    mdb["tweets"].insert_one(tweets)
    
def save_order(mdb, orderID, orderName, searchTerm):
    orders_coll = mdb.orders
    order_data = OrderSchema(orderID==orderID, eventName=orderName, searchString=searchTerm, status=0)
    orders_coll.insert_one(order_data.model_dump())


def handle_new_request(direction):
    # direction = "ETH->USDC" or "USDC->ETH"
    twitter_results_json = None
    mdb = MongoDB()
    tweets_coll = mdb.tweets
    tweets_doc = tweets_coll.find_one()
    
    try:
        tweets_doc["_id"] = str(tweets_doc["_id"])
    except:
        pass

    if is_cache_valid(tweets_doc):
        print("Using cached tweets")
        twitter_results_json = json.dumps(tweets_doc)

    else:
        print("Fetching fresh tweets")
        twitter_results = asyncio.run(scrape_twitter())

        if isinstance(twitter_results, Exception):
            #error
            print(twitter_results)
            return False
        
        print(twitter_results)
            
        formatted_tweets = format_tweets(twitter_results)
        print(formatted_tweets)
        save_tweets(mdb.db, formatted_tweets)
        formatted_tweets["_id"] = str(formatted_tweets["_id"])
        twitter_results_json = json.dumps(formatted_tweets)
        
        
        
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-pro",
        google_api_key = config["GEMINI_API_KEY"],
        temperature=0.7
    )

    tools = [search_tool, write_to_file]

    system_prompt = r"""You are an expert blockchain market analyst and trader. You look out for profit opportunities in the future, events that may affect the the exchange rate of etherium against USDC. You need to keep in mind both sides of the equations, eth and USDC. But you only give an output when you are certain that it will cause a shift in the market prices, as the money of your clients depends on your decisions. As input I give you a JSON like object of tweets- use these to analyse the current market sentiment, and try to find events that are going to occur in the near future (at max within the next 10 months, but try to keep the timeframe as short as possbile) that may cause an impact on the exchange rates of eth against the USD. In addition to this data, if you need any more information or you are uncertain about anything, you can use the web search tool. REMEMBER: You only need to choose trades having one type of swap, either USDC->ETH or ETH->USDC. I WILL SPECIFY IN THE USER PROMPT WHICH ONE I WANT. THE EVENT NEEDS TO BE SUCH THAT IF I PERFORM THE SWAP AFTER THE OCCURENCE OF THE EVENT, THE SWAP SHOULD BE PROFITABLE FOR ME. In the description of the event, include a rough estimate of the time of the event. You report your answer in the form of a json, containing the name of event, a description of the event, and a confidence score for the impact of this event. 
            Sample outputs are {{"events":[[{{"name": "US Elections", "description":"A 100 word description of the event, containing key facts, the estimated date of the event and factors that affect the market.", "confidence":0.9}}, {{...}}]]}}
    
    YOU NEED TO GIVE ATLEAST 3-5 RELEVANT EVENTS.
            """

    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        agent_kwargs={
            "system_message": system_prompt
        },
        verbose=True
    )
    
    if direction == "ETH->USDC":

        user_prompt = f"Study the tweet data I am giving, and use web search, to provide a relevant and trustworthy response. KEEP IN MIND, I ONLY WANT TRADES THAT WILL BE PROFITABLE IF I HAVE ETH TO SELL, THAT IS I WANT TO SWAP ETH TO USDC. - {twitter_results_json}"
    elif direction=="USDC->ETH":
        user_prompt = f"Study the tweet data I am giving, and use web search, to provide a relevant and trustworthy response. KEEP IN MIND, I ONLY WANT TRADES THAT WILL BE PROFITABLE IF I HAVE USDC TO SELL, THAT IS I WANT TO SWAP USDC TO ETH. - {twitter_results_json}"

    print(llm.get_num_tokens(system_prompt+user_prompt))

    response = agent.invoke(user_prompt)
    print(response)

    system_prompt_2 = r"""You are a financial advisor at a high stakes firm. You will be given an input, which will contain some entries of events in the near future, which may affect the trade prices of ETH vs USDC. You may use the search tool provided to you to get any info about these events you need. You need to take this input and analyse each event, with all of the given parameters, see if the input has any errors. If there are any errors, discard that event. After tihs, choose one event which you think will create the maximum opportunity for profit, and make any corrections needed in the input data. Bsaed on this event, make a BUY or SELL directive for you customer, with the aim of maximizing his/her profit. Also, for this event, generate a search term which you think will help another agent get all the info about this event using search tools, just as you did. In this search term, also include the rough estimate of date/time of occurence of this event. REMEMBER: You only need to choose trades having one type of swap, either USDC->ETH or ETH->USDC. I WILL SPECIFY IN THE USER PROMPT WHICH ONE I WANT. THE EVENT NEEDS TO BE SUCH THAT IF I PERFORM THE SWAP AFTER THE OCCURENCE OF THE EVENT, THE SWAP SHOULD BE PROFITABLE FOR ME. Output all this data in a json with the format:
    {{"name": "Event Name", "search_term": "Your generated search term"}}. The list of dates will be provided in the original input, but you can make corrections in it if you deem necessary. ONLY INCLUDE THE JSON IN THE OUTPUT, NO OTHER TEXT. STRICTLY FOLLOW THE OUTPUT JSON FORMAT.

  """
  
    print("Sleeping")
    time.sleep(62)
  
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        agent_kwargs={
            "system_message": system_prompt_2
        },
        verbose=True
    )
    
    if direction == "ETH->USDC":
        user_prompt2 = f"I am providing you the input data of events- analyse it and give the required output. KEEP IN MIND, I ONLY WANT TRADES THAT WILL BE PROFITABLE IF I HAVE ETH TO SELL, THAT IS I WANT TO SWAP ETH TO USDC. - {response}"
        
    elif direction=="USDC->ETH":
        user_prompt2 = f"I am providing you the input data of events- analyse it and give the required output. KEEP IN MIND, I ONLY WANT TRADES THAT WILL BE PROFITABLE IF I HAVE USDC TO SELL, THAT IS I WANT TO SWAP USDC TO ETH. - {response}"


    print(llm.get_num_tokens(system_prompt_2+user_prompt2))

    response2 = agent.invoke(user_prompt2)
    
    print(response2)
    # final_out = json.loads(response2)
    final_out = response2
    
    search_term = final_out["search_term"]
    event_name = final_out["name"]
    dates = final_out["dates"]
    orderID = mint_order()
    
    save_order(mdb, orderID, event_name, search_term) # status 0 means hasnt been changed yet. status 1 means it has been changed already.
    
handle_new_request("USDC->ETH")

# import time

# timestamp_str = str(int(time.time()))
# print(timestamp_str)
# use this to make the order id of a new order

# steps of chain:
# 1. analyze the tweets to find events, and also use search tool along with the twiter data
# 2. analyze the outcomes of these events and its effect on the stock prices, using a search tool.


#https://github.com/guidance-ai/guidance

# sources to analyze: twitter, reddit, polymarket, finshots, finimize
# https://finimize.com/topics/etfs
# langchain, puppeteer+bueifulsop4, chromadb, setiment analysis: https://huggingface.co/ProsusAI/finbert, 
# price api, coingekko or binance maybe, etherscan accha hai for on chain data to feed the agent,



