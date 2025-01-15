from flask import Flask, request, jsonify
import os
import pandas as pd
import re
from werkzeug.utils import secure_filename
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
UPLOAD_FOLDER = './uploads'
RESULTS_FOLDER = './results'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Function to preprocess text
def preprocess_text(text):
    text = text.lower()  # Convert to lowercase
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    text = re.sub(r'\s+', ' ', text).strip()  # Remove extra whitespace
    return text

# Function to read and preprocess all text files in a folder
def read_folder(directory):
    documents = {}
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        if filename.endswith(".txt"):
            try:
                with open(filepath, "r", encoding="utf-8") as file:
                    documents[filename] = preprocess_text(file.read())
            except UnicodeDecodeError:
                with open(filepath, "r", encoding="ISO-8859-1") as file:
                    documents[filename] = preprocess_text(file.read())
    return documents

# Function to check plagiarism within the same folder
# Only retains the highest similarity for each file
def plagiarism_check_within_folder(folder_path):
    docs = read_folder(folder_path)

    # Compute TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(docs.values())

    # Calculate cosine similarity
    results = []
    filenames = list(docs.keys())
    similarity_matrix = cosine_similarity(tfidf_matrix)

    for i, test_file in enumerate(filenames):
        max_similarity = -1
        best_match = None
        for j, train_file in enumerate(filenames):
            if i != j:  # Avoid comparing the file with itself
                similarity = similarity_matrix[i, j]
                if similarity > max_similarity:
                    max_similarity = similarity
                    best_match = {
                        "Test_Document": test_file,
                        "Compared_With": train_file,
                        "Similarity": similarity,
                        "Unique_Percentage": 100 * (1 - similarity)
                    }
        if best_match:
            results.append(best_match)

    return results

@app.route('/upload-folder', methods=['POST'])
def upload_folder():
    try:
        # Parse JSON request body
        data = request.get_json()
        if not data or 'folder_path' not in data:
            return jsonify({"error": "Folder path is required"}), 400

        folder_path = data['folder_path']
        if not os.path.exists(folder_path):
            return jsonify({"error": f"Folder path does not exist: {folder_path}"}), 404

        # Perform plagiarism check within the folder
        results = plagiarism_check_within_folder(folder_path)
        results_path = os.path.join(RESULTS_FOLDER, "plagiarism_results.csv")
        pd.DataFrame(results).to_csv(results_path, index=False)

        return jsonify({"message": "Plagiarism check completed", "results_file": results_path})
    except Exception as e:
        print(f"Error during upload-folder processing: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route('/results', methods=['GET'])
def get_results():
    results_path = './results/plagiarism_results.csv'
    print(f"Checking for results file at: {results_path}")

    if not os.path.exists(results_path):
        print("Results file not found!")
        return jsonify({"error": "Results file not found!"}), 404

    try:
        results_df = pd.read_csv(results_path)
        print("Results file read successfully.")
        return results_df.to_json(orient='records')  # Return records as JSON
    except Exception as e:
        print(f"Error reading results file: {str(e)}")
        return jsonify({"error": f"Failed to read results: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)
