from typing import Optional
from urllib.parse import quote_plus
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.database import Database
from pymongo.server_api import ServerApi
import os


def create_connection() -> Optional[MongoClient]:
    """creates connection to db api

    Returns:
        MongoClient: client
    """

    load_dotenv()
    USER = quote_plus(os.getenv("MONGO_USER"))
    PASSWORD = quote_plus(os.getenv("MONGO_PASSWORD"))

    uri = f"mongodb+srv://{USER}:{PASSWORD}@atlascluster.jwbtz27.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"

    # Create a new client and connect to the server
    client = MongoClient(uri, server_api=ServerApi("1"))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)
        return None


def get_db(client: MongoClient, db_name: str) -> Database:
    """grab given db

    Args:
        client (MongoClient): _description_
        db_name (str): _description_

    Returns:
        Database: _description_
    """
    return client[db_name]
