# ai/recommender/sync_and_train.py
import pymongo
import pandas as pd
from recommendation import train_model_logic 

def sync_data_from_mongo():
    try:
        client = pymongo.MongoClient("mongodb+srv://admin:admin%40123@cluster0.10lyasj.mongodb.net/smarthub")
        db = client["smarthub"]
        
        # 1. Lấy dữ liệu Cartevents và làm phẳng (Flatten)
        # Chúng ta cần mỗi item trong giỏ hàng trở thành 1 dòng riêng biệt
        cart_cursor = db["cartevents"].find({}, {"user": 1, "items": 1})
        cart_list = []
        for doc in cart_cursor:
            user_id = str(doc.get("user")) # Chuyển ObjectId sang String
            items = doc.get("items", [])
            for item in items:
                cart_list.append({
                    "user": user_id,
                    "product": str(item.get("product")) # Chuyển ObjectId sang String
                })
        cart_df = pd.DataFrame(cart_list)

        # 2. Lấy dữ liệu Searchevents
        search_cursor = db["searchevents"].find({}, {"user": 1, "keyword": 1})
        search_list = []
        for doc in search_cursor:
            search_list.append({
                "user": str(doc.get("user")),
                "keyword": doc.get("keyword")
            })
        search_df = pd.DataFrame(search_list)
        
        if cart_df.empty and search_df.empty:
            print("Cảnh báo: Không có dữ liệu tương tác nào trong MongoDB!")
            return

        print(f"Đã lấy {len(cart_df)} dòng giỏ hàng và {len(search_df)} dòng tìm kiếm từ MongoDB.")
        
        # 3. GỌI HÀM HUẤN LUYỆN
        train_model_logic(cart_df, search_df)
        
    except Exception as e:
        print(f"Lỗi khi đồng bộ dữ liệu: {e}")

if __name__ == "__main__":
    sync_data_from_mongo()