import asyncio
from twikit import Client

USERNAME = 'tigpig0707'
EMAIL = 'tigpig0707@gmail.com'
PASSWORD = 'tiggyisapiggy'

# Initialize client
client = Client('en-US')

async def main():
    await client.login(
        auth_info_1=USERNAME,
        auth_info_2=EMAIL,
        password=PASSWORD,
        cookies_file='cookies.json'
    )

    tweets = await client.search_tweet('etherium', 'Latest')

    for tweet in tweets:
        print(tweet.user.name)
        print(tweet.text)
        print(tweet.created_at)
        print("--------------------------------")

asyncio.run(main())
