import os
import smtplib
from email.message import EmailMessage
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://127.0.0.1:6767", "http://localhost:6767", "https://corpcooga.github.io"])

GMAIL_USER = os.getenv("GMAIL_USER")
GMAIL_APP_PASS = os.getenv("GMAIL_APP_PASS")

@app.route("/api/contact", methods=["POST"])
def send_contact_email():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    sender_email = data.get("email", "").strip()
    user_message = data.get("message", "").strip()

    if not sender_email or not user_message:
        return jsonify({"error": "Both email and message are required."}), 422

    msg = EmailMessage()
    msg["Subject"] = f"Kpop Monkey Message from {sender_email}"
    msg["From"] = GMAIL_USER
    msg["To"] = GMAIL_USER
    msg["Reply-To"] = sender_email
    msg.set_content(f"From: {sender_email}\n\nMessage:\n{user_message}")

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(GMAIL_USER, GMAIL_APP_PASS)
            smtp.send_message(msg)
        return jsonify({"message": "Message sent successfully!"}), 200
    except Exception as e:
        print("SMTP Error:", e)
        return jsonify({"error": "Server failed to send email."}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
