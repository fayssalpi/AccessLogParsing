from flask import Flask, request
from flask_socketio import SocketIO
import re
from collections import Counter
import logging
import requests
from user_agents import parse

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

SPRING_BOOT_WEBSOCKET_URL = "http://localhost:8080/api/saveAnalysis"

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
    browser_family_counter = Counter()
    os_family_counter = Counter()

    for i, line in enumerate(log_data.split('\n')):
        match = log_pattern.match(line)
        if match:
            entry = match.groupdict()
            status_counter[entry['status']] += 1
            user_agent = parse(entry['user_agent'])
            browser_family = user_agent.browser.family
            os_family = user_agent.os.family
            browser_family_counter[browser_family] += 1
            os_family_counter[os_family] += 1

            # Send status, browser family, and OS family counts to Spring Boot every 1000 lines
            if (i + 1) % 5000 == 0:
                logging.info(f"Processed {i + 1} lines")
                logging.info(f"HTTP Statuses: {dict(status_counter)}")
                logging.info(f"Browser Families: {dict(browser_family_counter)}")
                logging.info(f"OS Families: {dict(os_family_counter)}")
                send_update_to_spring_boot(dict(status_counter), dict(browser_family_counter), dict(os_family_counter))

    # Send final status, browser family, and OS family counts to Spring Boot
    logging.info("Final HTTP Status, Browser Family, and OS Family Counts:")
    logging.info(f"HTTP Statuses: {dict(status_counter)}")
    logging.info(f"Browser Families: {dict(browser_family_counter)}")
    logging.info(f"OS Families: {dict(os_family_counter)}")
    send_update_to_spring_boot(dict(status_counter), dict(browser_family_counter), dict(os_family_counter))

def send_update_to_spring_boot(status_counts, browser_family_counts, os_family_counts):
    try:
        results = {
            "statuses": status_counts,
            "browserFamilies": browser_family_counts,
            "osFamilies": os_family_counts
        }
        response = requests.post(SPRING_BOOT_WEBSOCKET_URL, json=results)
        logging.info(f"Sent data to Spring Boot, response status code: {response.status_code}")
    except Exception as e:
        logging.error(f"Failed to send update to Spring Boot: {e}")

if __name__ == '__main__':
    socketio.run(app, port=5000, debug=True)
