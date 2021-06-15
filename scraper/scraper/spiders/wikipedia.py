import re
from scrapy import Spider, Selector
import unicodedata
from scraper.spiders import BaseSpider


class WikipediaSpider(BaseSpider):
    name = "wikipedia"
    start_urls = [
        "https://en.wikipedia.org/wiki/List_of_mnemonics",
    ]
    base_wikipedia_url = "https://wikipedia.org"
    skip_categories = [
        "Languages",
        "Mathematics",
        "Medicine",
        "Units of measure",
    ]
    exit_text = "See also"

    topic = ""
    category_links = []
    mnemonic_links = []
    description = ""
    pair_mnemonic = ""
    description_consumed = True
    pass_category = False

    def predict_mnemonic(self, content):
        matches = re.search(r"(?:[A-Z]{3,}\s)+", content)
        if matches:
            return matches.group(0)
        matches = re.search(r'"(.{3,}?)"', content)
        if matches:
            return matches.group(0)
        matches = re.search(r": (.+)\.", content)
        if matches:
            return matches.group(1)
        return None

    def extract_text(self, selector):
        content = "".join(
            [
                unicodedata.normalize("NFKD", element).replace("\n", "")
                for element in selector.getall()
            ]
        )
        content = re.sub(r"\[\d+\]", "", content)
        return content

    def parse_elements(self, selector):
        return selector.xpath("*[self::h2|self::ul|self::p|self::div|self::dl|self::p]")

    def normalize_urls(self, urls):
        return [
            (self.start_urls[0] + url)
            if url.startswith("#")
            else (self.base_wikipedia_url + url)
            for url in urls
        ]

    def parse_category(self, element):
        self.category_links = []
        text = element.xpath("span/text()").get()
        self.pair_mnemonic = ""
        self.description = ""
        self.mnemonic_links = []
        self.description_consumed = True

        if text in self.skip_categories:
            self.pass_category = True
        elif text == self.exit_text:
            return True
        else:
            self.pass_category = False
        self.topic = text if text else self.topic
        return False

    def process_sub_ul_tags(self, element, response):
        items = []
        for sub_element in element.xpath("li"):
            self.description = sub_element.extract()
            self.description = self.extract_text(
                Selector(
                    text=self.description[: self.description.find("<ul>")] + "</li>"
                ).xpath("//text()")
            )

            self.mnemonic_links = element.xpath("a/@href").getall()
            mnemonics = sub_element.xpath("ul//*[self::dd|self::li]")
            for mnemonic in mnemonics:
                items.append(
                    self.make_item(
                        self.extract_text(mnemonic.xpath(".//text()")),
                        self.description,
                        response.request.url,
                        self.normalize_urls(
                            self.category_links
                            + self.mnemonic_links
                            + mnemonic.xpath(".//a/@href").getall()
                        ),
                        self.topic,
                    )
                )

            if not len(mnemonics.getall()):
                items.append(
                    self.make_item(
                        self.predict_mnemonic(self.description),
                        self.description,
                        response.request.url,
                        self.normalize_urls(self.category_links + self.mnemonic_links),
                        self.topic,
                    )
                )
        return items

    def process_ul_tag(self, element, response):
        items = []
        if element.xpath("li//ul").get():  # complex mnemonic
            sub_items = self.process_sub_ul_tags(element, response)
            items += sub_items
        else:  # simple description
            if len(element.xpath("li").getall()) > 1:
                for sub_element in element.xpath("li"):
                    self.description = self.extract_text(sub_element.xpath(".//text()"))
                    items.append(
                        self.make_item(
                            self.predict_mnemonic(self.description),
                            self.description,
                            response.request.url,
                            self.normalize_urls(
                                self.category_links + self.mnemonic_links
                            ),
                            self.topic,
                        )
                    )
            else:
                self.description = self.extract_text(element.xpath(".//text()"))
                self.mnemonic_links = element.xpath(".//a/@href").getall()
                self.description_consumed = False
        return items

    def process_dl_sub_elements(self, element, sub_elements, response):
        items = []
        sub_description = str(element.xpath("dd").get())
        if "<ul>" in sub_description:
            sub_description = self.extract_text(
                Selector(
                    text=sub_description[: sub_description.find("<ul>")] + "</dd>"
                ).xpath("//text()")
            )
        else:
            sub_description = ""

        for sub_element in sub_elements:
            items.append(
                self.make_item(
                    self.extract_text(sub_element.xpath(".//text()")),
                    "{} {}".format(self.description, sub_description),
                    response.request.url,
                    self.normalize_urls(
                        self.category_links
                        + self.mnemonic_links
                        + sub_element.xpath(".//a/@href").getall()
                    ),
                    self.topic,
                )
            )
        return items

    def process_dl_tag(self, element, response):
        items = []
        sub_elements = element.xpath("dd//*[self::dd|self::li]")

        if len(sub_elements.getall()):
            sub_items = self.process_dl_sub_elements(element, sub_elements, response)
            items += sub_items
        else:
            for sub_element in element.xpath("dd"):
                if not self.description_consumed:
                    items.append(
                        self.make_item(
                            self.extract_text(sub_element.xpath(".//text()")),
                            self.description,
                            response.request.url,
                            self.normalize_urls(
                                self.category_links
                                + self.mnemonic_links
                                + sub_element.xpath(".//a/@href").getall()
                            ),
                            self.topic,
                        )
                    )
                    self.description_consumed = True
                elif not self.pair_mnemonic:
                    self.mnemonic_links += element.xpath(".//a/@href").getall()
                    self.pair_mnemonic = self.extract_text(
                        sub_element.xpath(".//text()")
                    )
                else:
                    items.append(
                        self.make_item(
                            self.pair_mnemonic,
                            self.extract_text(sub_element.xpath(".//text()")),
                            response.request.url,
                            self.normalize_urls(
                                self.category_links
                                + self.mnemonic_links
                                + sub_element.xpath(".//a/@href").getall()
                            ),
                            self.topic,
                        )
                    )
        return items

    def parse(self, response, **kwargs):
        content = response.xpath('/html/body//div[has-class("mw-parser-output")]')

        for element in self.parse_elements(content):
            element_tag = element.xpath("name()").get()

            if element_tag == "h2":  # get topic name
                exit_category = self.parse_category(element)
                if exit_category:
                    return

            if self.pass_category:
                continue

            if (
                element_tag == "div" and element.xpath("@role").get() == "note"
            ):  # get related topic url
                self.category_links += element.xpath("a/@href").getall()
            elif element_tag == "ul":  # get complex mnemonics or simple description
                items = self.process_ul_tag(element, response)
                for item in items:
                    yield item
            elif element_tag == "dl":  # get mnemonics or complex mnemonics
                items = self.process_dl_tag(element, response)
                for item in items:
                    yield item
            elif element_tag == "p":  # get mnemonics description
                self.description = self.extract_text(element.xpath(".//text()"))
                self.mnemonic_links = element.xpath(".//a/@href").getall()
