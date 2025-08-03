import price_setter, status_updater
from db import MongoDB, OrderSchema

def maintainer():
    # runs once every day.
    # needs to update the gas price.
    # cycles through the list of orders, checks the ones which are pending (status 0), if it has occured, then exeute it and set status to 1 
    
    price_setter.update()
    
    mdb = MongoDB()
    orders_coll = mdb.orders
    
    raw_orders = list(orders_coll.find())
    orders = [OrderSchema(**order) for order in raw_orders]
    for order in orders:
        print(order.orderID, order.status)


    
