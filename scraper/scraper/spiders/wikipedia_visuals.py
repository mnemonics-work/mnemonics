import re
from scraper.spiders import BaseSpider
import unicodedata


class WikipediaVisualsSpider(BaseSpider):
    name = "wikipedia_visuals"
    start_urls = [
        "https://en.wikipedia.org/wiki/List_of_visual_mnemonics",
    ]
    base_wikipedia_url = "https://wikipedia.org"
    exit_text = "See also"

    def extract_text(self, selector):
        content = "".join(
            [unicodedata.normalize("NFKD", element) for element in selector.getall()]
        )
        content = re.sub(r"\[\d+\]", "", content)
        return content

    def normalize_urls(self, urls):
        return [
            (self.start_urls[0] + url)
            if url.startswith("#")
            else (self.base_wikipedia_url + url)
            for url in urls
        ]

    def parse_elements(self, selector):
        return selector.xpath("*[self::h3|self::h2|self::ul|self::p|self::div]")

    def parse(self, response, **kwargs):
        content = response.xpath('/html/body//div[has-class("mw-parser-output")]')

        topic = ""
        category_links = []

        for element in self.parse_elements(content):
            element_tag = element.xpath("name()").get()

            if (
                element_tag == "h2"
                and element.xpath("span/text()").get() == self.exit_text
            ):
                return
            if element_tag == "h3":
                category_links = []
                text = element.xpath(".//text()").get()
                topic = text if text else topic
            elif element_tag == "p" and topic:
                yield self.make_item(
                    self.extract_text(element.xpath(".//text()")),
                    topic,
                    response.request.url,
                    self.normalize_urls(
                        category_links + element.xpath(".//a/@href").getall()
                    ),
                    topic,
                )
            elif element_tag == "div" and element.xpath("@role").get() == "note":
                category_links += element.xpath("a/@href").getall()
            elif element_tag == "ul" and "gallery" not in str(
                element.xpath("@class").get()
            ):
                mnemonics = element.xpath("li")
                for mnemonic in mnemonics:
                    yield self.make_item(
                        self.extract_text(mnemonic.xpath(".//text()")),
                        topic,
                        response.request.url,
                        self.normalize_urls(
                            category_links + mnemonic.xpath(".//a/@href").getall()
                        ),
                        topic,
                    )
