# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class SmarthubItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()

    product_name = scrapy.Field()   # Tên sản phẩm
    price = scrapy.Field()          # Giá (vd: 26.199.000)

    rating_value = scrapy.Field()   # Số sao đánh giá
    rating_count = scrapy.Field()   # Số lượt đánh giá

    brand = scrapy.Field()          # Thương hiệu
    ram = scrapy.Field()            # RAM
    storage = scrapy.Field()        # Bộ nhớ trong

    screen_size = scrapy.Field()    # Kích thước màn hình
    resolution = scrapy.Field()     # Độ phân giải
    chipset = scrapy.Field()        # Chipset
    os = scrapy.Field()             # Hệ điều hành

    rear_camera = scrapy.Field()    # Camera sau
    front_camera = scrapy.Field()   # Camera trước

    battery = scrapy.Field()        # Dung lượng pin
    dimensions = scrapy.Field()     # Kích thước máy
    weight = scrapy.Field()         # Trọng lượng

    image_url = scrapy.Field()      # Ảnh sản phẩm
    # product_url = scrapy.Field()    # Link sản phẩm