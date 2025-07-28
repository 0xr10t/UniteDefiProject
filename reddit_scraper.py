import praw 
from dotenv import dotenv_values

config = dotenv_values(".env")


reddit = praw.Reddit(
    client_id=config["REDDIT_CLIENT_ID"],
    client_secret=config["REDDIT_CLIENT_SECRET"],
    password=config["REDDIT_PASSWORD"],
    user_agent="testscript for 1inchi lauda",
    username=config["REDDIT_USERNAME"]
)

print(reddit.user.me())

