from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pydantic import BaseModel
from dotenv import dotenv_values

config = dotenv_values(".env")

uri = f"mongodb+srv://siddharthc1:{config["MONGODB_PASSWORD"]}@cluster0.ax1iny7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


class UserSchema(BaseModel):
    metaMaskID: str
    orders: list[str] # list of order IDs
    
class OrderSchema(BaseModel):
    orderID: str
    eventName: str
    searchString: str
    status: int

class MongoDB:
    def __init__(self):
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        self.db = self.client["1inchdb"]
        self.users = self.db["users"]
        self.orders = self.db["orders"]
        self.tweets = self.db["tweets"]
        
    def ping(self):
        try:
            self.client.admin.command('ping')
            return True
        except:
            return False
        
    def init_db(self):
        if "users" not in self.db.list_collection_names():
            self.db.create_collection("users")
        if "orders" not in self.db.list_collection_names():
            self.db.create_collection("orders")

    
if __name__ == "__main__":
    db = MongoDB()
    db.ping()
    db.init_db()
    

# user_data = UserSchema(name="Bob", age=30, email="bob@example.com")
# users.insert_one(user_data.dict())

