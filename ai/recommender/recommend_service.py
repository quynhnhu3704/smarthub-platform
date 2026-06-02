# recommender/recommend_service.py
import os
import pickle
from collections import defaultdict

import pymongo
from bson import ObjectId



# =====================================
# MODEL PATH
# =====================================

base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "recommender.pkl")

# =====================================
# MONGODB
# =====================================

MONGO_URI = (
    "mongodb+srv://admin:admin%40123@cluster0.10lyasj.mongodb.net/smarthub"
)

client = pymongo.MongoClient(MONGO_URI)
db = client["smarthub"]

# =====================================
# PRODUCT CACHE
# =====================================

product_cache = {}

for product in db["products"].find():

    product_cache[str(product["_id"])] = {
        "name": product.get("product_name", ""),
        "brand": str(product.get("brand")),
        "price": product.get("price", 0),
        "ram": product.get("ram", 0),
        "storage": product.get("storage", 0)
    }

print("Loaded products:", len(product_cache))

# =====================================
# BRAND CACHE
# =====================================

brand_cache = {}

for brand in db["brands"].find():

    brand_cache[str(brand["_id"])] = (
        brand.get("brand_name")
        or brand.get("name")
        or ""
    )

print("Loaded brands:", len(brand_cache))

# =====================================
# MODEL CACHE
# =====================================

last_modified_time = 0

user_similarity_df = None
train_data = None


def reload_model_if_needed():

    global last_modified_time
    global user_similarity_df
    global train_data

    if not os.path.exists(model_path):
        return

    current_mtime = os.path.getmtime(model_path)

    if current_mtime > last_modified_time:

        with open(model_path, "rb") as f:

            model = pickle.load(f)

            user_similarity_df = model["user_similarity"]
            train_data = model["train_data"]

        last_modified_time = current_mtime

        print("✅ Model reloaded")


# =====================================
# POPULAR PRODUCTS
# =====================================

def get_popular_products(top_n=10):

    reload_model_if_needed()

    if train_data is None:
        return []

    popular = (
        train_data[
            ~train_data["product_id"]
            .str.startswith("BRAND_", na=False)
        ]
        .groupby("product_id")["rating"]
        .sum()
        .sort_values(ascending=False)
        .head(top_n)
        .index
        .tolist()
    )

    return popular


# =====================================
# USER PROFILE
# =====================================

def build_user_profile(user_id):

    preferred_brands = defaultdict(int)

    user_products = set()

    # ==========================
    # SEARCH HISTORY
    # ==========================

    try:

        searches = db["searchevents"].find({
            "user": ObjectId(user_id)
        })

        for search in searches:

            keyword = search.get("keyword")

            if not keyword:
                continue

            keyword = keyword.strip()

            products = db["products"].find({
                "product_name": {
                    "$regex": keyword,
                    "$options": "i"
                }
            }).limit(20)

            for product in products:

                pid = str(product["_id"])

                user_products.add(pid)

                brand_id = str(product["brand"])

                preferred_brands[brand_id] += 2

    except Exception as e:

        print("Search profile error:", e)

    # ==========================
    # CART HISTORY
    # ==========================

    try:

        carts = db["cartevents"].find({
            "user": ObjectId(user_id)
        })

        for cart in carts:

            for item in cart.get("items", []):

                pid = str(item.get("product"))

                user_products.add(pid)

                if pid in product_cache:

                    brand_id = product_cache[pid]["brand"]

                    preferred_brands[brand_id] += 5

    except Exception as e:

        print("Cart profile error:", e)

    # ==========================
    # ORDER HISTORY
    # ==========================

    try:

        orders = db["orders"].find({
            "user": ObjectId(user_id)
        })

        for order in orders:

            for item in order.get("items", []):

                pid = str(item.get("product"))

                user_products.add(pid)

                if pid in product_cache:

                    brand_id = product_cache[pid]["brand"]

                    preferred_brands[brand_id] += 10

    except Exception as e:

        print("Order profile error:", e)

    return user_products, preferred_brands


# =====================================
# RECOMMEND
# =====================================

def recommend_products(user_id, top_n=10):

    print("\n========================")
    print("REQUEST USER:", user_id)

    user_id = str(user_id)

    user_products = set()

    candidate_scores = defaultdict(float)

    # =====================================
    # CART BRANDS (MẠNH NHẤT)
    # =====================================

    cart_brands = defaultdict(int)

    try:

        cart = db["carts"].find_one({
            "user": ObjectId(user_id)
        })

        if cart:

            for item in cart.get("items", []):

                pid = str(item["product"])

                user_products.add(pid)

                if pid not in product_cache:
                    continue

                brand_id = product_cache[pid]["brand"]

                quantity = item.get("quantity", 1)

                cart_brands[brand_id] += quantity * 1000

    except Exception as e:
        print("Cart error:", e)

    # =====================================
    # ORDER HISTORY
    # =====================================

    order_brands = defaultdict(int)

    try:

        orders = db["orders"].find({
            "user": ObjectId(user_id)
        })

        for order in orders:

            for item in order.get("items", []):

                pid = str(item["product"])

                user_products.add(pid)

                if pid not in product_cache:
                    continue

                brand_id = product_cache[pid]["brand"]

                order_brands[brand_id] += 100

    except Exception as e:
        print("Order error:", e)

    # =====================================
    # SEARCH HISTORY
    # =====================================

    search_brands = defaultdict(int)

    try:

        searches = db["searchevents"].find({
            "user": ObjectId(user_id)
        })

        for search in searches:

            keyword = search.get("keyword")

            if not keyword:
                continue

            products = db["products"].find({
                "product_name": {
                    "$regex": keyword,
                    "$options": "i"
                }
            }).limit(20)

            for product in products:

                brand_id = str(product["brand"])

                search_brands[brand_id] += 10

    except Exception as e:
        print("Search error:", e)

    # =====================================
    # DEBUG
    # =====================================

    print("\nCART BRANDS")

    for brand_id, score in sorted(
        cart_brands.items(),
        key=lambda x: x[1],
        reverse=True
    ):

        print(
            brand_cache.get(
                brand_id,
                brand_id
            ),
            score
        )

    # =====================================
    # SCORE PRODUCTS
    # =====================================

    for pid, product in product_cache.items():

        if pid in user_products:
            continue

        brand_id = product["brand"]

        score = 0

        score += cart_brands.get(
            brand_id,
            0
        )

        score += order_brands.get(
            brand_id,
            0
        )

        score += search_brands.get(
            brand_id,
            0
        )

        if score <= 0:
            continue

        # flagship
        if product["price"] >= 15000000:
            score += 20

        # ram
        if product["ram"] >= 8:
            score += 10

        # storage
        if product["storage"] >= 256:
            score += 10

        candidate_scores[pid] = score

    # =====================================
    # SORT
    # =====================================

    recommendations = sorted(
        candidate_scores.items(),
        key=lambda x: x[1],
        reverse=True
    )

    final_result = []

    brand_count = defaultdict(int)

    for pid, score in recommendations:

        brand_id = product_cache[pid]["brand"]

        if brand_count[brand_id] >= 3:
            continue

        final_result.append(pid)

        brand_count[brand_id] += 1

        if len(final_result) >= top_n:
            break

    print("\n🎯 FINAL RECOMMEND")

    for pid in final_result:

        try:

            product = product_cache[pid]

            print(
                f"{product['name']} | "
                f"{brand_cache.get(product['brand'],'Unknown')}"
            )

        except:
            pass
        # =====================================
    # COLD START FALLBACK
    # =====================================

    if not final_result:

        print("\nNo personalized recommendation")
        print("Return popular products")

        return get_popular_products(top_n)
    
    return final_result