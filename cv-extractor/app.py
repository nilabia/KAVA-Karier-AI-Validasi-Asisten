import os
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from extractor import extract_cv

app = Flask(__name__)
CORS(app)


@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "success", "message": "CV Extractor is running!"})


@app.route("/extract", methods=["POST"])
def extract():
    if "file" not in request.files:
        return jsonify({"status": "failed", "message": "No file uploaded"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"status": "failed", "message": "No file selected"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"status": "failed", "message": "Only PDF files are allowed"}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file.save(tmp.name)
        tmp_path = tmp.name

    try:
        result = extract_cv(tmp_path)
        return jsonify({
            "status": "success",
            "message": "CV extracted successfully",
            "data": result,
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500
    finally:
        os.unlink(tmp_path)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)