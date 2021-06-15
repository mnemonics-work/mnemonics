# This package will contain the spiders of your Scrapy project
#
# Please refer to the documentation for information on how to create and manage
# your spiders.

from scrapy import Spider
from scraper.items import MnemonicItem


class BaseSpider(Spider):
    def make_item(
        self,
        mnemonic=None,
        description=None,
        source=None,
        links=[],
        category=None,
        mnemonic_type=["text"],
    ):
        item = MnemonicItem()
        item["mnemonic"] = mnemonic
        item["description"] = description
        item["source"] = source
        item["links"] = links
        item["category"] = category
        item["type"] = mnemonic_type
        return item
