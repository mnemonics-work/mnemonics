# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class MnemonicItem(scrapy.Item):
    mnemonic = scrapy.Field()
    description = scrapy.Field()
    source = scrapy.Field()
    links = scrapy.Field()
    category = scrapy.Field()
    type = scrapy.Field()
