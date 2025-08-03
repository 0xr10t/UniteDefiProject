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
    searchString: str
    status: int

class MongoDB:
    def __init__(self):
        self.client = MongoClient(uri, server_api=ServerApi('1'))
        db = self.client["mydb"]
        self.users = db["users"]
        self.orders = db["orders"]
        
    def ping(self):
        try:
            self.client.admin.command('ping')
            return True
        except:
            return False
        
    
    

# user_data = UserSchema(name="Bob", age=30, email="bob@example.com")
# users.insert_one(user_data.dict())

