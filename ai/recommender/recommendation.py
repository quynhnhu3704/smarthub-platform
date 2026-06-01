import os
import pickle
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
# đường dẫn file model
base_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(base_dir, "recommender.pkl")

def train_model_logic(interaction_df):
    try:

        print("\n========================")
        print("START TRAINING")
        print("========================")

        # chuẩn hóa dữ liệu
        interaction_df["user_id"] = (
            interaction_df["user_id"]
            .astype(str)
            .str.strip()
        )

        interaction_df["product_id"] = (
            interaction_df["product_id"]
            .astype(str)
            .str.strip()
        )

        # gộp các interaction trùng nhau
        interaction_df = (
            interaction_df
            .groupby(
                ["user_id", "product_id"],
                as_index=False
            )["rating"]
            .sum()
        )

        print("Interactions:", len(interaction_df))
        print("Users:", interaction_df["user_id"].nunique())
        print("Products:", interaction_df["product_id"].nunique())

        # tạo user-item matrix
        user_item_matrix = interaction_df.pivot_table(
            index="user_id",
            columns="product_id",
            values="rating",
            fill_value=0
        )

        print("Matrix shape:", user_item_matrix.shape)

        # cosine similarity
        user_similarity = cosine_similarity(
            user_item_matrix
        )

        user_similarity_df = pd.DataFrame(
            user_similarity,
            index=user_item_matrix.index.astype(str),
            columns=user_item_matrix.index.astype(str)
        )

        print("Similarity matrix shape:",
              user_similarity_df.shape)

        print("\nSample users:")
        print(
            list(
                user_similarity_df.index[:10]
            )
        )

        # lưu model
        with open(model_path, "wb") as f:
            pickle.dump({
                "user_similarity": user_similarity_df,
                "train_data": interaction_df,
                "user_item_matrix": user_item_matrix
            }, f)

        print("\n✅ Train hoàn tất")
        print("Model saved:", model_path)

    except Exception as e:
        print("❌ Train error:")
        print(str(e))