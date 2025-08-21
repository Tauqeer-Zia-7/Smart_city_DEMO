import paho.mqtt.client as mqtt
import json
import sqlite3
from datetime import datetime
import threading
from flask import Flask, render_template, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('sensor_data.db')
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sensor_readings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            device_id TEXT,
            temperature REAL,
            humidity REAL,
            timestamp DATETIME,
            location TEXT
        )
    """)
    conn.commit()
    conn.close()

# MQTT callback functions
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker successfully")
        client.subscribe("iot/sensor/data")
    else:
        print(f"Failed to connect, return code {rc}")

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())

        conn = sqlite3.connect('sensor_data.db')
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO sensor_readings (device_id, temperature, humidity, timestamp, location)
            VALUES (?, ?, ?, ?, ?)
        """, (data['device_id'], data['temperature'], data['humidity'], 
              datetime.now(), data['location']))
        conn.commit()
        conn.close()

        print(f"Received: Temp={data['temperature']}°C, Humidity={data['humidity']}%")

    except Exception as e:
        print(f"Error: {e}")

@app.route('/api/latest')
def get_latest_data():
    conn = sqlite3.connect('sensor_data.db')
    cursor = conn.cursor()
    cursor.execute("""
        SELECT temperature, humidity, timestamp, location 
        FROM sensor_readings 
        ORDER BY timestamp DESC 
        LIMIT 1
    """)
    result = cursor.fetchone()
    conn.close()

    if result:
        return jsonify({
            'temperature': result[0],
            'humidity': result[1],
            'timestamp': result[2],
            'location': result[3]
        })
    else:
        return jsonify({'error': 'No data available'})

@app.route('/api/history')
def get_history():
    conn = sqlite3.connect('sensor_data.db')
    cursor = conn.cursor()
    cursor.execute("""
        SELECT temperature, humidity, timestamp 
        FROM sensor_readings 
        ORDER BY timestamp DESC 
        LIMIT 50
    """)
    results = cursor.fetchall()
    conn.close()

    history = []
    for row in results:
        history.append({
            'temperature': row[0],
            'humidity': row[1],
            'timestamp': row[2]
        })

    return jsonify(history)

def start_mqtt():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect("broker.hivemq.com", 1883, 60)
    client.loop_forever()

if __name__ == '__main__':
    init_db()
    mqtt_thread = threading.Thread(target=start_mqtt)
    mqtt_thread.daemon = True
    mqtt_thread.start()
    app.run(debug=True, host='0.0.0.0', port=5000)
