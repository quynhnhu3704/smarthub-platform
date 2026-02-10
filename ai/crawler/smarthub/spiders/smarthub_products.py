from urllib import response
import scrapy
from smarthub.items import SmarthubItem
import json
from scrapy.selector import Selector
import re


class SmarthubProductsSpider(scrapy.Spider):
    name = "smarthub_products"
    allowed_domains = ["duchuymobile.com"]
    # API "Xem thêm" – tăng page
    # https://www.duchuymobile.com/index.php?dispatch=categories.view&category_id=80&page=2&=undefined&is_ajax=1
    start_urls = [
        f"https://www.duchuymobile.com/index.php"
        f"?dispatch=categories.view&category_id=80&page={i}&is_ajax=1"
        for i in range(1, 10)
    ]
    

    def parse(self, response):
        data = json.loads(response.text)

        html = data.get("text")
        if not html:
            self.logger.info("No more products, stop crawling")
            return

        selector = Selector(text=html)

        # lấy link sản phẩm (absolute)
        product_links = selector.css('a.product-title::attr(href)').getall()

        for url in product_links:
            yield scrapy.Request(url=url, callback=self.parse_product)


    def parse_product(self, response):
        item = SmarthubItem()

        # Tên sản phẩm
        item["product_name"] = (response.css('h1.mainbox-title::text').re_first(r'^.*?(?=\s*\(|\s*Chính Hãng)') or "").strip()

        # Giá
        item["price"] = response.css('span.price-num::text').get(default="").replace('.', '').strip()

        # Số sao đánh giá
        item["rating_value"] = len(response.css('#average_rating_product i.icon-star'))
        
        # Số lượt đánh giá
        item["rating_count"] = int(response.css('#average_rating_product a::text').get(default="").split('đánh giá')[0].strip())

        # Thương hiệu (lấy từ tên sản phẩm)
        # item["brand"] = response.css('h1.mainbox-title::text').get(default="").split()[0].strip()

        brand_map = {
            "iphone": "Apple",
            "samsung": "Samsung",
            "xiaomi": "Xiaomi",
            "oppo": "OPPO",
            "motorola": "Motorola",
            "vivo": "Vivo",
            "realme": "Realme",
            "nokia": "Nokia",
            "oneplus": "OnePlus",
            "google": "Google",
            "pixel": "Google",
            "huawei": "Huawei",
            "tecno": "Tecno",
            "honor": "HONOR",
            "nothing": "Nothing",
            "nubia": "Nubia",
            "infinix": "Infinix",
            "redmagic": "RedMagic"
        }

        raw = response.css('h1.mainbox-title::text').get(default="")
        key = raw.lower()
        item["brand"] = next((v for k, v in brand_map.items() if k in key), None)

        # RAM (GB)
        item["ram"] = response.css('label:contains("RAM") + div.feature-value ::text').get(default="").replace("GB", "").strip()

        # Bộ nhớ trong (GB) – chuyển TB sang GB
        storage_raw = response.css('label:contains("Bộ nhớ trong ( Rom)") + div.feature-value ::text').get(default="").strip()

        item["storage"] = (
            int(float(storage_raw.replace("TB", "")) * 1024) if "TB" in storage_raw
            else int(storage_raw.replace("GB", "")) if "GB" in storage_raw
            else None
        )

        # Kích thước màn hình
        item["screen_size"] = response.css('label:contains("Màn hình rộng") + div.feature-value ::text').re_first(r'\d+\.\d+|\d+')

        # Độ phân giải
        item["resolution"] = (response.css('label:contains("Độ phân giải") + div.feature-value ::text').re_first(r'\d{3,4}\s*[x×]\s*\d{3,4}') or "").replace(" ", "").replace("×", "x") or None

        # Chipset
        item["chipset"] = response.css('label:contains("Chipset") + div.feature-value ::text').get(default="").replace("®", "").strip()
        
        # Hệ điều hành
        item["os"] = response.css('label:contains("Hệ điều hành") + div.feature-value ::text').get(default="").strip()

        # Camera sau
        item["rear_camera"] = response.css('label:contains("Camera sau") + div.feature-value ::text').get(default="").strip()

        # Camera trước
        item["front_camera"] = response.css('label:contains("Camera trước") + div.feature-value ::text').get(default="").strip()

        # Dung lượng pin (mAh)
        item["battery"] = response.css('label:contains("Dung lượng pin") + div.feature-value ::text').get(default="").replace(",", "").lower().split("mah")[0].strip()

        # Kích thước máy (mm) - a x b x c
        dimensions_raw = response.css('label:contains("Kích thước") + div.feature-value ::text').get(default="").strip()
        nums = re.findall(r'\d+(?:\.\d+)?', dimensions_raw.replace(",", "."))
        item["dimensions"] = (f"{nums[0]}x{nums[1]}x{nums[2]}" if len(nums) >= 3 else None)

        # Trọng lượng (g)
        item["weight"] = response.css('label:contains("Trọng lượng") + div.feature-value ::text').get(default="").split("g")[0].strip()

        # Ảnh sản phẩm
        item["image_url"] = (
            response.css('meta[property="og:image"]::attr(content)').get()
            or response.css('link[rel="image_src"]::attr(href)').get()
            or response.css('img.ty-pict::attr(data-src)').get()
            or response.css('img.ty-pict::attr(src)').get()
        )

        # Link sản phẩm
        # item["product_url"] = response.url

        yield item