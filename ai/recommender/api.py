from flask import Flask, jsonify
from recommend_service import recommend_products

app = Flask(__name__)

@app.route("/recommend/<user_id>")
def recommend(user_id):
    try:
        result = recommend_products(user_id)
        return jsonify({
            "status": "success",
            "user_id": user_id,
            "recommendations": result
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    print("🌐 API Gợi ý sản phẩm đang chạy tại port 5001...")
    app.run(port=5001, debug=True)