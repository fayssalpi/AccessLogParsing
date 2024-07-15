from flask import Flask, request
from flask_socketio import SocketIO
import re
from collections import Counter
import logging
import requests

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

SPRING_BOOT_WEBSOCKET_URL = "http://localhost:8080/api/saveAnalysis"  # Update with your Spring Boot endpoint

@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part", 400
    
    file = request.files['file']
    
    if file.filename == '':
        return "No selected file", 400
    
    log_data = file.read().decode('utf-8')
    process_log(log_data)
    return "File received and processing", 200

def process_log(log_data):
    log_pattern = re.compile(
        r'(?P<ip>\d+\.\d+\.\d+\.\d+) - - \[(?P<date>.+?)\] '
        r'"(?P<method>\w+) (?P<request>.+?) HTTP/\d\.\d" '
        r'(?P<status>\d{3}) (?P<size>\d+) "(?P<referrer>[^"]*)" "(?P<user_agent>[^"]*)"'
    )
    
    status_counter = Counter()

    for i, line in enumerate(log_data.split('\n')):
        match = log_pattern.match(line)
        if match:
            entry = match.groupdict()
            status_counter[entry['status']] += 1

            # Send status counts to Spring Boot every 1000 lines
            if (i + 1) % 1000 == 0:
                logging.info(f"Processed {i + 1} lines")
                logging.info(f"HTTP Statuses: {dict(status_counter)}")
                send_update_to_spring_boot(dict(status_counter))

    # Send final status counts to Spring Boot
    logging.info("Final HTTP Status Counts:")
    logging.info(f"HTTP Statuses: {dict(status_counter)}")
    send_update_to_spring_boot(dict(status_counter))

def send_update_to_spring_boot(status_counts):
    try:
        results = {
            "statuses": status_counts
        }
        requests.post(SPRING_BOOT_WEBSOCKET_URL, json=results)
    except Exception as e:
        logging.error(f"Failed to send update to Spring Boot: {e}")

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)
