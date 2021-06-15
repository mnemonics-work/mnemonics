from scraper.spiders import BaseSpider
import unicodedata


class ByolympiadsSpider(BaseSpider):
    name = "byolympiads"
    start_urls = [
        "https://biolympiads.com/list-of-chemistry-mnemonics/",
    ]
    default_category = "Chemistry"

    def extract_text(self, selector):
        return "".join(
            [unicodedata.normalize("NFKD", element) for element in selector.getall()]
        )

    def parse_elements(self, selector):
        return selector.xpath(
            'div[has-class("entry-content")]//*[self::h3|self::table|self::ul|self::figure]'
        )

    def parse(self, response, **kwargs):
        content = response.xpath('/html/body//div[has-class("entry-wrap")]')

        topic = ""
        description = ""
        table_links = []
        category_links = []

        for element in self.parse_elements(content):
            element_tag = element.xpath("name()").get()

            if element_tag == "h3":
                text = element.xpath("text()").get()
                topic = text if text else topic
                category_links = element.xpath(".//a/@href").getall()
            elif element_tag == "table":
                text = self.extract_text(element.xpath("tbody//td//text()"))
                description = "{}: {}".format(topic, text)
                table_links = element.xpath(".//a/@href").getall()
            elif element_tag == "figure":
                yield self.make_item(
                    element.xpath(".//img/@src").get(),
                    description,
                    response.request.url,
                    category_links + table_links + element.xpath(".//a/@href").getall(),
                    self.default_category,
                    ["image"],
                )
            else:
                mnemonics = element.xpath("li")
                for mnemonic in mnemonics:
                    yield self.make_item(
                        self.extract_text(
                            mnemonic.xpath(".//text()[not(ancestor::a)]")
                        ),
                        description,
                        response.request.url,
                        category_links
                        + table_links
                        + mnemonic.xpath(".//a/@href").getall(),
                        self.default_category,
                    )
