# # ai/recommender/recommend_service.py
# import os
# import pickle # Bổ sung import

# # Định nghĩa đường dẫn file model
# base_dir = os.path.dirname(os.path.abspath(__file__))
# model_path = os.path.join(base_dir, "recommender.pkl")

# last_modified_time = 0
# user_similarity_df = None
# train_data = None

# def reload_model_if_needed():
#     global last_modified_time, user_similarity_df, train_data
#     if not os.path.exists(model_path):
#         print("Chưa có file recommender.pkl. Vui lòng chạy train trước!")
#         return

#     current_mtime = os.path.getmtime(model_path)
    
#     if current_mtime > last_modified_time:
#         with open(model_path, "rb") as f:
#             model = pickle.load(f)
#             user_similarity_df = model["user_similarity"]
#             train_data = model["train_data"]
#         last_modified_time = current_mtime
#         print("AI đã tự động cập nhật bộ nhớ mới!")

# def recommend_products(user_id, top_n=10):
#     reload_model_if_needed()
    
#     # Kiểm tra nếu user_id không tồn tại (Cold Start)
#     if user_similarity_df is None or user_id not in user_similarity_df.index:
#         # Trả về các sản phẩm phổ biến nhất nếu là user mới
#         if train_data is not None:
#             return train_data.groupby('product_id')['rating'].sum().sort_values(ascending=False).head(top_n).index.tolist()
#         return []

#     # Logic lấy các user tương đồng
#     similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:11].index
    
#     # Gợi ý sản phẩm mà các user tương đồng đã mua nhưng user này chưa mua
#     user_bought = train_data[train_data['user_id'] == user_id]['product_id'].tolist()
#     recommendations = train_data[train_data['user_id'].isin(similar_users)]
#     recommendations = recommendations[~recommendations['product_id'].isin(user_bought)]
    
#     result = recommendations.groupby('product_id')['rating'].sum().sort_values(ascending=False).head(top_n).index.tolist()
#     return result


import os
import pickle

# xác định thư mục hiện tại và đường dẫn file model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "recommender.pkl")

# biến toàn cục lưu trạng thái model
last_modified_time = 0  # thời gian sửa đổi file lần cuối
user_similarity_df = None  # ma trận tương đồng người dùng
train_data = None  # dữ liệu train gốc

def reload_model_if_needed():
    """
    load lại model nếu file recommender.pkl mới hơn lần load trước
    nếu chưa có file thì thông báo và return
    """
    global last_modified_time, user_similarity_df, train_data

    if not os.path.exists(model_path):
        print("❌ Chưa có file recommender.pkl. Hãy train trước!")
        return

    current_mtime = os.path.getmtime(model_path)  # lấy thời gian sửa đổi hiện tại

    if current_mtime > last_modified_time:
        # load dữ liệu từ file pickle
        with open(model_path, "rb") as f:
            model = pickle.load(f)
            user_similarity_df = model["user_similarity"]  # ma trận tương đồng user
            train_data = model["train_data"]  # dữ liệu train

        last_modified_time = current_mtime
        print("✅ Model đã load / cập nhật!")

def recommend_products(user_id, top_n=10):
    """
    trả về danh sách product_id gợi ý cho user_id
    top_n: số lượng sản phẩm tối đa
    """
    reload_model_if_needed()

    user_id = str(user_id).strip()  # đảm bảo user_id là string
    print("👤 User request:", user_id)

    if user_similarity_df is not None:
        print("📊 Tổng user:", len(user_similarity_df.index))
        print("🧪 Sample users:", list(user_similarity_df.index)[:5])

    # nếu user chưa tồn tại trong ma trận similarity, dùng sản phẩm phổ biến
    if user_similarity_df is None or user_id not in user_similarity_df.index:
        print("⚠️ User chưa tồn tại → dùng popular products")
        if train_data is not None:
            return (
                train_data.groupby('product_id')['rating']
                .sum()
                .sort_values(ascending=False)
                .head(top_n)
                .index
                .tolist()
            )
        return []

    # lấy 10 user tương tự gần nhất
    similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:11].index
    print("👥 Similar users:", list(similar_users))

    # lấy danh sách sản phẩm user đã mua
    user_bought = train_data[train_data['user_id'] == user_id]['product_id'].tolist()

    # lọc sản phẩm từ các user tương tự và bỏ sản phẩm đã mua
    recommendations = train_data[train_data['user_id'].isin(similar_users)]
    recommendations = recommendations[~recommendations['product_id'].isin(user_bought)]

    # tính tổng rating và chọn top_n sản phẩm gợi ý
    result = (
        recommendations.groupby('product_id')['rating']
        .sum()
        .sort_values(ascending=False)
        .head(top_n)
        .index
        .tolist()
    )

    print("🎯 Recommend:", result)
    return result