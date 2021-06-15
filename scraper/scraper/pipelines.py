# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
import pymongo
import os


class ScraperPipeline:
    def __init__(self):
        self.client = pymongo.MongoClient(os.getenv("MONGO_DATABASE_URL", "localhost"))
        self.collection = self.client["mnemonics"]["items"]

    def process_item(self, item, spider):
        if item["mnemonic"] is not None and item["description"] is not None:
            self.collection.insert_one(dict(item))
            return item
