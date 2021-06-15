#!/usr/bin/env python3

from scrapy.crawler import CrawlerProcess
from scrapy.settings import Settings

from scraper import settings as project_settings

crawler_settings = Settings()
crawler_settings.setmodule(project_settings)
process = CrawlerProcess(settings=crawler_settings)

spiders = [
    "wikipedia",
    "wikipedia_visuals",
    "byolympiads",
]

for spider in spiders:
    process.crawl(spider)

process.start()
