from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from dotenv import dotenv_values

config = dotenv_values(".env")


llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-pro",
    google_api_key = config["GEMINI_API_KEY"],
    temperature=0.7
)


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant that translates {input_language} to {output_language}.",
        ),
        ("human", "{input}"),
    ]
)

chain = prompt | llm
msg  = chain.invoke(
    {
        "input_language": "English",
        "output_language": "Dutch",
        "input": "I love eating pizza.",
    }
)

# sources to analyze: twitter, reddit, polymarket, finshots, finimize
# https://finimize.com/topics/etfs
# langchain, puppeteer+bueifulsop4, chromadb, setiment analysis: https://huggingface.co/ProsusAI/finbert, 
# price api, coingekko or binance maybe, etherscan accha hai for on chain data to feed the agent,

print(msg.content)

