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

print(msg.content)

# # Define a simple prompt for the agent
# template = """
# You are an AI assistant with an expertise in blockchain.
# Answer the following question: {question}
# """

# # Set up the prompt and LLM chain
# prompt = PromptTemplate(template=template, input_variables=["question"])
# chain = LLMChain(prompt=prompt, llm=llm)

# # Example query
# query = "What is the impact of AI in blockchain industry?"
# response = chain.run(question=query)
# print(f"Agent Response: {response}")
