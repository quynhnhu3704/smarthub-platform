import pymongo
import pandas as pd
from recommendation import train_model_logic


MONGO_URI = (
    "mongodb+srv://admin:admin%40123@cluster0.10lyasj.mongodb.net/smarthub"
)


def sync_data_from_mongo():

    try:

        print("===================================")
        print("CONNECTING TO MONGODB")
        print("===================================")

        client = pymongo.MongoClient(MONGO_URI)

        db = client["smarthub"]

        interactions = []

        # ==========================
        # LOAD BRAND MAP
        # ==========================

        brand_map = {}

        for brand in db["brands"].find():

            brand_map[str(brand["_id"])] = (
                brand.get("brand_name")
                or brand.get("name")
                or ""
            )

        print("Brands loaded:", len(brand_map))

        # ==========================
        # LOAD PRODUCT MAP
        # ==========================

        product_map = {}

        for product in db["products"].find():

            product_id = str(product["_id"])

            product_map[product_id] = {
                "brand": str(
                    product.get("brand")
                )
            }

        print("Products loaded:", len(product_map))

        # ==========================
        # CART EVENTS
        # ==========================

        print("Loading cart events...")

        cart_count = 0

        for doc in db["cartevents"].find():

            user_id = str(doc.get("user"))

            for item in doc.get("items", []):

                product_id = str(
                    item.get("product")
                )

                if not product_id:
                    continue

                # product interaction
                interactions.append({
                    "user_id": user_id,
                    "product_id": product_id,
                    "rating": 5
                })

                # brand interaction
                if product_id in product_map:

                    brand_id = product_map[
                        product_id
                    ]["brand"]

                    brand_name = brand_map.get(
                        brand_id
                    )

                    if brand_name:

                        interactions.append({
                            "user_id": user_id,
                            "product_id":
                                f"BRAND_{brand_name}",
                            "rating": 3
                        })

                cart_count += 1

        print(
            f"Cart interactions: {cart_count}"
        )

        # ==========================
        # SEARCH EVENTS
        # ==========================

        print("Loading search events...")

        search_count = 0

        keyword_cache = {}

        for doc in db["searchevents"].find():

            user_id = str(doc.get("user"))

            keyword = doc.get("keyword")

            if not keyword:
                continue

            keyword = keyword.strip()

            keyword_lower = keyword.lower()

            if keyword_lower in keyword_cache:

                matched_products = (
                    keyword_cache[keyword_lower]
                )

            else:

                matched_products = list(
                    db["products"].find(
                        {
                            "product_name": {
                                "$regex": keyword,
                                "$options": "i"
                            }
                        }
                    ).limit(20)
                )

                keyword_cache[
                    keyword_lower
                ] = matched_products

            for product in matched_products:

                product_id = str(
                    product["_id"]
                )

                interactions.append({
                    "user_id": user_id,
                    "product_id": product_id,
                    "rating": 2
                })

                brand_id = str(
                    product.get("brand")
                )

                brand_name = brand_map.get(
                    brand_id
                )

                if brand_name:

                    interactions.append({
                        "user_id": user_id,
                        "product_id":
                            f"BRAND_{brand_name}",
                        "rating": 2
                    })

                search_count += 1

        print(
            f"Search interactions: {search_count}"
        )

        # ==========================
        # ORDERS
        # ==========================

        print("Loading orders...")

        order_count = 0

        for order in db["orders"].find():

            user_id = str(order.get("user"))

            for item in order.get("items", []):

                product_id = str(
                    item.get("product")
                )

                if not product_id:
                    continue

                interactions.append({
                    "user_id": user_id,
                    "product_id": product_id,
                    "rating": 10
                })

                if product_id in product_map:

                    brand_id = product_map[
                        product_id
                    ]["brand"]

                    brand_name = brand_map.get(
                        brand_id
                    )

                    if brand_name:

                        interactions.append({
                            "user_id": user_id,
                            "product_id":
                                f"BRAND_{brand_name}",
                            "rating": 5
                        })

                order_count += 1

        print(
            f"Order interactions: {order_count}"
        )

        # ==========================
        # DATAFRAME
        # ==========================

        df = pd.DataFrame(interactions)

        if df.empty:
            print("No data")
            return

        df["user_id"] = (
            df["user_id"].astype(str)
        )

        df["product_id"] = (
            df["product_id"].astype(str)
        )

        print("\n========== DATA ==========")

        print(
            "Total interactions:",
            len(df)
        )

        print(
            "Unique users:",
            df["user_id"].nunique()
        )

        print(
            "Unique products:",
            df["product_id"].nunique()
        )

        train_model_logic(df)

        print("✅ RETRAIN DONE")

    except Exception as e:

        print("❌ ERROR")
        print(str(e))


if __name__ == "__main__":
    sync_data_from_mongo()