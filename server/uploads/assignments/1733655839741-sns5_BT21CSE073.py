from flask import Flask, render_template_string, request
import mysql.connector

app = Flask(__name__)  # Instantiate the Flask application

# Updated styles
styles = """
<style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: 'Roboto', sans-serif;
        background: linear-gradient(135deg, #0a74da, #5d9bfb);
        color: #f4f4f4;
        padding: 0;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    h2, h3 {
        color: #ffffff;
        font-weight: 600;
        text-align: center;
        margin-bottom: 20px;
    }
    .container {
        width: 90%;
        max-width: 600px;
        margin: 20px;
        padding: 30px;
        background-color: #1c1e3a;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        border-radius: 12px;
        text-align: center;
    }
    input[type="text"], input[type="password"], input[type="submit"], button {
        width: 100%;
        padding: 15px;
        margin: 10px 0 20px;
        border: 1px solid #ddd;
        border-radius: 6px;
        font-size: 16px;
        transition: all 0.3s ease;
    }
    input[type="text"]:focus, input[type="password"]:focus {
        border-color: #ff6f61;
        outline: none;
    }
    input[type="submit"], button {
        background-color: #ff6f61;
        color: white;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: background-color 0.3s ease;
    }
    input[type="submit"]:hover, button:hover {
        background-color: #e05247;
    }
    .message, .success {
        margin-top: 20px;
        font-size: 16px;
        font-weight: bold;
    }
    .message {
        color: #f1c40f;
    }
    .success {
        color: #FFFFFF;
    }
    p {
        font-size: 15px;
        color: #f4f4f4;
    }
    .comments-section {
        margin-top: 30px;
    }
    .comments-section p {
        background-color: #2c3e50;
        border-left: 5px solid #ff6f61;
        padding: 10px;
        margin-bottom: 8px;
        border-radius: 6px;
    }
    label {
        font-size: 16px;
        color: #f4f4f4;
    }
</style>
"""

# Updated xss_form with new styles
xss_form = f"""
<!DOCTYPE html>
<html>
<head><title>XSS Attacks and SQL Injection</title>{styles}</head>
<body>
    <div class="container">
        <h2>Reflected Attack</h2>
        <form action="/xss" method="GET">
            <label for="name">Enter your message:</label>
            <input type="text" id="name" name="name" placeholder="Enter your message" required>
            <button type="submit" class="btn-submit">Submit</button>
        </form>
    </div>
</body>
</html>
"""

# Updated login form with new styles
login_form = f"""
<!DOCTYPE html>
<html>
<head><title>Login Page</title>{styles}</head>
<body>
    <div class="container">
        <h2>Login</h2>
        <form action="/login" method="POST">
            <label for="username">Username:</label>
            <input type="text" name="username" placeholder="Enter your username" required><br>
            <label for="password">Password:</label>
            <input type="password" name="password" placeholder="Enter your password" required><br>
            <input type="submit" class="btn-submit" value="Login">
        </form>
    </div>
</body>
</html>
"""

@app.route('/')
def xss_form_route():
    return render_template_string(xss_form)

@app.route('/xss')
def xss_submit():
    name = request.args.get('name', '')
    return f"<div class='container'><h1>Welcome, {name}</h1></div>"

@app.route('/login', methods=['GET', 'POST'])
def login():
    message = ""
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Database connection
        conn = mysql.connector.connect(
            host="localhost",
            user="root",  
            password="Admin@123",  
            database="mahika"  
        )
        cursor = conn.cursor()

        query = f"SELECT * FROM sql_inj WHERE username = '{username}' AND password = '{password}'"
        print(f"Executing query: {query}")
        cursor.execute(query)
        result = cursor.fetchall()
        conn.close()

        if result:
            message = "<p class='success' align='center'>You've logged in succesfully!</p>"
        else:
            message = "<p class='message' align='center'>Invalid credentials. Please check your credentials again.</p>"

    return render_template_string(login_form + message)

@app.route('/comments', methods=['GET', 'POST'])
def comments():
    message = ""  # Initialize the message variable to avoid UnboundLocalError
    conn = mysql.connector.connect(
        host="localhost",
        user="root",  # Replace with your MySQL username
        password="Admin@123",  # Replace with your MySQL password
        database="mahika"  # Replace with your actual database name
    )
    cursor = conn.cursor()

    if request.method == 'POST':
        comment = request.form['comment']
      
        
        # Insert the comment into the database
        try:
            cursor.execute(f"INSERT INTO comments (comment_text) VALUES ('{comment}')")
            conn.commit()
            message = "<p class='success'>Successfully added your message!</p>"
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            message = f"<p class='message'>Error adding comment: {err}</p>"

    # Fetch and display comments
    try:
        cursor.execute("SELECT comment_text FROM comments")
        comments = cursor.fetchall()
    except mysql.connector.Error as err:
        print(f"Error fetching comments: {err}")
        comments = []

    conn.close()

    comment_list = "".join([f"<p>{comment[0]}</p>" for comment in comments])
    return render_template_string(f"""
    {styles}
    <div class="container">
        <h2>Stored Attack</h2>
        <form method="POST">
            <label for="comment">Add a message:</label>
            <input type="text" name="comment" placeholder="Enter your message" required>
            <button type="submit">Submit</button>
        </form>
        <div>{message}</div>
        <div>{comment_list}</div>
    </div>
    """)

if __name__ == '__main__':
    app.run(port=8000, debug=True)

