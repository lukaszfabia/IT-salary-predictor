from typing import Optional
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from urllib.parse import quote_plus
from pymongo.collection import Collection
from pymongo.database import Database


def create_connection() -> Optional[MongoClient]:
    """creates connection to db api

    Returns:
        MongoClient: client
    """

    load_dotenv()
    USER = quote_plus(os.getenv("MONGO_USER"))
    PASSWORD = quote_plus(os.getenv("MONGO_PASSWORD"))
    URI = os.getenv("MONGO_URI")

    # uri = URI
    # Create a new client and connect to the server
    uri = f"mongodb+srv://{USER}:{PASSWORD}@atlascluster.jwbtz27.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster"
    client: MongoClient = MongoClient(uri)

    # Send a ping to confirm a successful connection
    try:
        client.admin.command("ping")
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(e)
        return None


def get_collection_or_db(
    client: MongoClient,
    collection: Optional[str] = None,
    db_name: str = "data_for_model",
) -> Collection | Database:
    try:
        return client[db_name][collection] if collection else client[db_name]
    except Exception as e:
        print(e)
        return None
