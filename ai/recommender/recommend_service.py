# ai/recommender/recommend_service.py
import os
import pickle # Bổ sung import

# Định nghĩa đường dẫn file model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "recommender.pkl")

last_modified_time = 0
user_similarity_df = None
train_data = None

def reload_model_if_needed():
    global last_modified_time, user_similarity_df, train_data
    if not os.path.exists(model_path):
        print("Chưa có file recommender.pkl. Vui lòng chạy train trước!")
        return

    current_mtime = os.path.getmtime(model_path)
    
    if current_mtime > last_modified_time:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
            user_similarity_df = model["user_similarity"]
            train_data = model["train_data"]
        last_modified_time = current_mtime
        print("AI đã tự động cập nhật bộ nhớ mới!")

def recommend_products(user_id, top_n=10):
    reload_model_if_needed()
    
    # Kiểm tra nếu user_id không tồn tại (Cold Start)
    if user_similarity_df is None or user_id not in user_similarity_df.index:
        # Trả về các sản phẩm phổ biến nhất nếu là user mới
        if train_data is not None:
            return train_data.groupby('product_id')['rating'].sum().sort_values(ascending=False).head(top_n).index.tolist()
        return []

    # Logic lấy các user tương đồng
    similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:11].index
    
    # Gợi ý sản phẩm mà các user tương đồng đã mua nhưng user này chưa mua
    user_bought = train_data[train_data['user_id'] == user_id]['product_id'].tolist()
    recommendations = train_data[train_data['user_id'].isin(similar_users)]
    recommendations = recommendations[~recommendations['product_id'].isin(user_bought)]
    
    result = recommendations.groupby('product_id')['rating'].sum().sort_values(ascending=False).head(top_n).index.tolist()
    return result