from langchain.tools import tool
from langchain_tavily import TavilySearch
# from langchain.tools.ddg_search import DuckDuckGoSearchRun
from dotenv import dotenv_values
import os

config = dotenv_values(".env")
os.environ["TAVILY_API_KEY"] = config["TAVILY_API_KEY"]

search_tool = TavilySearch(k=3)
# search_tool = DuckDuckGoSearchRun()

@tool
def write_to_file(filename: str, content: str) -> None:
    """Write content to a localfile with the specified filename"""
    with open(filename, "w") as f:
        f.write(content)
    
        