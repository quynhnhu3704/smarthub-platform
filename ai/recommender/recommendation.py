# ai/recommender/recommendation.py
# import pandas as pd
# import numpy as np
# from sklearn.metrics.pairwise import cosine_similarity
# from scipy.sparse import csr_matrix
# import pickle
# import os

# # TUYỆT ĐỐI KHÔNG CÓ DÒNG: from recommendation import ...

# def train_model_logic(cart_df=None, search_df=None):
#     # Nội dung hàm xử lý của Oanh
#     base_dir = os.path.dirname(os.path.abspath(__file__))
#     # ... logic xử lý DataFrame ...
#     print("Huấn luyện AI thành công!")

# # Phần này để Oanh có thể chạy độc lập file này nếu muốn
# if __name__ == "__main__":
#     train_model_logic()
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
import pickle
import os

def train_model_logic(cart_df=None, search_df=None):
    # Xác định đường dẫn file
    base_dir = os.path.dirname(os.path.abspath(__file__))
    # Tìm đến thư mục backend/data từ vị trí file này
    data_dir = os.path.abspath(os.path.join(base_dir, "..", "..", "backend", "data"))

    print(f"📂 Đang kiểm tra dữ liệu tại: {data_dir}")

    # Nếu không có dữ liệu truyền vào từ Mongo, đọc từ CSV
    if cart_df is None:
        cart_path = os.path.join(data_dir, "smarthub.cartevents.csv")
        if os.path.exists(cart_path):
            cart_df = pd.read_csv(cart_path)
            # Chuẩn hóa tên cột theo file CSV của Oanh
            cart_df = cart_df.rename(columns={"user": "user_id", "items[0].product": "product_id"})
            if 'product_id' not in cart_df.columns and 'product' in cart_df.columns:
                cart_df = cart_df.rename(columns={"product": "product_id"})
        else:
            print(f"❌ Không tìm thấy file: {cart_path}")
            return

    if search_df is None:
        search_path = os.path.join(data_dir, "smarthub.searchevents.csv")
        if os.path.exists(search_path):
            search_df = pd.read_csv(search_path)
            search_df = search_df.rename(columns={"user": "user_id", "keyword": "product_id"})
        else:
            search_df = pd.DataFrame(columns=["user_id", "product_id"])

    # --- LOGIC HUẤN LUYỆN ---
    cart_df['rating'] = 5
    search_df['rating'] = 1
    
    df = pd.concat([cart_df[["user_id", "product_id", "rating"]], 
                    search_df[["user_id", "product_id", "rating"]]], ignore_index=True)
    df = df.dropna(subset=['user_id', 'product_id'])
    df = df.groupby(['user_id', 'product_id'], as_index=False)['rating'].sum()

    print(f"📊 Đang xử lý {len(df)} tương tác từ file CSV...")

    # Tạo ma trận tương đồng
    df['user_id'] = df['user_id'].astype('category')
    df['product_id'] = df['product_id'].astype('category')
    user_index = df['user_id'].cat.categories
    
    sparse_matrix = csr_matrix((df['rating'], (df['user_id'].cat.codes, df['product_id'].cat.codes)))
    user_similarity = cosine_similarity(sparse_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_index, columns=user_index)

    # Lưu model
    save_path = os.path.join(base_dir, "recommender.pkl")
    with open(save_path, "wb") as f:
        pickle.dump({"user_similarity": user_similarity_df, "train_data": df}, f)
    
    print(f"✅ Thành công! Đã tạo file {save_path}")

if __name__ == "__main__":
    train_model_logic()