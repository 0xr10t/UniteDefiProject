import price_setter, status_updater
from db import MongoDB, OrderSchema
from langchain.agents import initialize_agent, AgentType
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import dotenv_values
from tools import search_tool, write_to_file
import time

config=dotenv_values(".env")

def check_occurence(eventName, searchString, description):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key = config["GEMINI_API_KEY"],
        temperature=0.7
    )

    tools = [search_tool, write_to_file]
    system_prompt = r"""You need to research about an event that I tell you about, and you tell me if they have occured or not.  The event contains a search string. I will also be giving you a description of the event prepared by another agent. Use this string and description with the search tool to get information about this event.  Make sure that the event which has occured is the same one as in the description. Also, make sure that the effect of both the events is in the same direction, i.e if the original event was intended to be in a positive sense, and if the event that has occured, albeit same, is negative, you will report (1,0). If the event has occured in the same sense as intended, you will report (1,1). If the event has not occured yet, you will report (0,0). 
    YOUR REPORT SHOULD BE ONLY THE TEXT (0/1, 0/1), including the paranthesis, but no other text"""
        
    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        agent_kwargs={
            "system_message": system_prompt
        },
        verbose=True
    )
    
    user_prompt = f"Tell me about this event, its format is- event name: {eventName}; search string: {searchString}; description: {description}"
    
    response = agent.invoke(user_prompt)
    happened = response['output'][1]
    order_flagged_for_execution = response['output'][3]
    
    return (happened, order_flagged_for_execution)



def maintainer():
    # runs once every day.
    # needs to update the gas price.
    # cycles through the list of orders, checks the ones which are pending (status 0), if it has occured, then exeute it and set status to 1 
    
    # price_setter.update() 
    
    mdb = MongoDB()
    orders_coll = mdb.orders
    
    raw_orders = list(orders_coll.find())
    orders = [OrderSchema(**order) for order in raw_orders]
    for order in orders:
        if order.status == 0:
            happened, order_flagged_for_execution = check_occurence(order.eventName, order.searchString, order.description)
            if happened and order_flagged_for_execution:
                status_updater.update(order.orderID, bool(1))
        
        time.sleep(5)
                
            


    
maintainer()