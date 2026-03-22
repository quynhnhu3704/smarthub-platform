# import pandas as pd
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
# from scipy.sparse import csr_matrix
# import pickle
# import os

# def train_model_logic(cart_df=None, search_df=None):
#     # Xác định đường dẫn file
#     base_dir = os.path.dirname(os.path.abspath(__file__))
#     # Tìm đến thư mục backend/data từ vị trí file này
#     data_dir = os.path.abspath(os.path.join(base_dir, "..", "..", "backend", "data"))

#     print(f"📂 Đang kiểm tra dữ liệu tại: {data_dir}")

#     # Nếu không có dữ liệu truyền vào từ Mongo, đọc từ CSV
#     if cart_df is None:
#         cart_path = os.path.join(data_dir, "smarthub.cartevents.csv")
#         if os.path.exists(cart_path):
#             cart_df = pd.read_csv(cart_path)
#             # Chuẩn hóa tên cột theo file CSV của Oanh
#             cart_df = cart_df.rename(columns={"user": "user_id", "items[0].product": "product_id"})
#             if 'product_id' not in cart_df.columns and 'product' in cart_df.columns:
#                 cart_df = cart_df.rename(columns={"product": "product_id"})
#         else:
#             print(f"❌ Không tìm thấy file: {cart_path}")
#             return

#     if search_df is None:
#         search_path = os.path.join(data_dir, "smarthub.searchevents.csv")
#         if os.path.exists(search_path):
#             search_df = pd.read_csv(search_path)
#             search_df = search_df.rename(columns={"user": "user_id", "keyword": "product_id"})
#         else:
#             search_df = pd.DataFrame(columns=["user_id", "product_id"])

#     # --- LOGIC HUẤN LUYỆN ---
#     cart_df['rating'] = 5
#     search_df['rating'] = 1
    
#     df = pd.concat([cart_df[["user_id", "product_id", "rating"]], 
#                     search_df[["user_id", "product_id", "rating"]]], ignore_index=True)
#     df = df.dropna(subset=['user_id', 'product_id'])
#     df = df.groupby(['user_id', 'product_id'], as_index=False)['rating'].sum()

#     print(f"📊 Đang xử lý {len(df)} tương tác từ file CSV...")

#     # Tạo ma trận tương đồng
#     df['user_id'] = df['user_id'].astype('category')
#     df['product_id'] = df['product_id'].astype('category')
#     user_index = df['user_id'].cat.categories
    
#     sparse_matrix = csr_matrix((df['rating'], (df['user_id'].cat.codes, df['product_id'].cat.codes)))
#     user_similarity = cosine_similarity(sparse_matrix)
#     user_similarity_df = pd.DataFrame(user_similarity, index=user_index, columns=user_index)

#     # Lưu model
#     save_path = os.path.join(base_dir, "recommender.pkl")
#     with open(save_path, "wb") as f:
#         pickle.dump({"user_similarity": user_similarity_df, "train_data": df}, f)
    
#     print(f"✅ Thành công! Đã tạo file {save_path}")

# if __name__ == "__main__":
#     train_model_logic()


import os
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity

# đường dẫn lưu model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "recommender.pkl")

# train model
def train_model_logic(cart_df=None):
    try:
        print("train model...")

        if cart_df is None or cart_df.empty:
            print("không có dữ liệu cart!")
            return

        # tạo rating giả
        cart_df["rating"] = 1

        # tạo user-item matrix
        user_item_matrix = cart_df.pivot_table(
            index="user_id",
            columns="product_id",
            values="rating",
            fill_value=0
        )
        print(f"matrix shape: {user_item_matrix.shape}")

        # tính similarity giữa user
        user_similarity = cosine_similarity(user_item_matrix)
        user_similarity_df = pd.DataFrame(
            user_similarity,
            index=user_item_matrix.index,
            columns=user_item_matrix.index
        )

        # lưu model
        with open(model_path, "wb") as f:
            pickle.dump({
                "user_similarity": user_similarity_df,
                "train_data": cart_df
            }, f)
        print("train xong! đã lưu recommender.pkl")

    except Exception as e:
        print(f"lỗi khi train: {e}")

# load model, auto reload
last_modified_time = 0
user_similarity_df = None
train_data = None

def reload_model_if_needed():
    global last_modified_time, user_similarity_df, train_data

    if not os.path.exists(model_path):
        print("chưa có model!")
        return

    current_mtime = os.path.getmtime(model_path)
    if current_mtime > last_modified_time:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
            user_similarity_df = model["user_similarity"]
            train_data = model["train_data"]

        last_modified_time = current_mtime
        print("model đã được cập nhật!")

# recommend products
def recommend_products(user_id, top_n=10):
    reload_model_if_needed()

    if user_similarity_df is None or train_data is None:
        print("chưa có model hoặc data!")
        return []

    user_id = str(user_id)

    # cold start: user mới → trả về popular
    if user_id not in user_similarity_df.index:
        print("user mới → trả về popular")
        popular = (
            train_data
            .groupby("product_id")["rating"]
            .sum()
            .sort_values(ascending=False)
            .head(top_n)
            .index
            .tolist()
        )
        return popular

    # lấy user tương đồng
    similar_users = (
        user_similarity_df[user_id]
        .sort_values(ascending=False)[1:11]
        .index
    )

    # sản phẩm user đã mua
    user_bought = train_data[
        train_data["user_id"] == user_id
    ]["product_id"].tolist()

    # lấy data từ user khác
    recommendations = train_data[
        train_data["user_id"].isin(similar_users)
    ]

    # loại bỏ sản phẩm đã mua
    recommendations = recommendations[
        ~recommendations["product_id"].isin(user_bought)
    ]

    # rank sản phẩm theo tổng rating
    result = (
        recommendations
        .groupby("product_id")["rating"]
        .sum()
        .sort_values(ascending=False)
        .head(top_n)
        .index
        .tolist()
    )

    return result