#!/usr/bin/env python3
import subprocess
import time
import requests
import threading
from flask import Flask, request, jsonify

app = Flask(__name__)

class StreamMonitor:
    STATS_URL = "http://nginx:80/stat"
    FALLBACK_CMD = [
        "ffmpeg", "-f", "image2", "-loop", "1", "-i", "fallback.png", "-re", "-f", "lavfi", "-i", "anullsrc", "-vf", "format=yuv420p", "-c:v", "libx264", "-b:v", "10M", "-bufsize", "4000k", "-g", "50", "-c:a", "aac", "-f", "flv", "rtmp://nginx/live/backup"
    ]

    def __init__(self):
        self.status = {
            "main_stream": "UNKNOWN",
            "fallback_stream": "OFF",
            "streams": 0,
            "bw_in": 0,
            "bw_out": 0,
            "monitoring": False
        }
        self.fallback_proc = None
        self.lock = threading.Lock()
        self.monitoring_thread = None
        self.stop_monitoring_event = threading.Event()

    def is_stream_publishing(self):
        try:
            resp = requests.get(self.STATS_URL, timeout=1)
            data = resp.json()
            streams = data["http-flv"]["servers"][0]["applications"][0]["live"].get("streams", [])
            return any(s.get("name") == "stream" and s.get("publishing") for s in streams)
        except Exception:
            return False

    def get_stats(self):
        try:
            resp = requests.get(self.STATS_URL, timeout=1)
            data = resp.json()
            servers = data["http-flv"]["servers"]
            streams = servers[0]["applications"][0]["live"].get("streams", [])
            return {
                "streams": len(streams),
                "bw_in": data["http-flv"]["bw_in"],
                "bw_out": data["http-flv"]["bw_out"]
            }
        except Exception:
            return {"streams": 0, "bw_in": 0, "bw_out": 0}

    def start_fallback(self):
        if self.fallback_proc is None or self.fallback_proc.poll() is not None:
            try:
                print("\033[93m[Warning]\033[0m Main stream is not running.")  # Yellow
                print("\033[92m[Info]\033[0m Starting fallback stream...")  # Green
                self.fallback_proc = subprocess.Popen(
                    self.FALLBACK_CMD, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, text=True
                )
                self.status["fallback_stream"] = "ON"
            except Exception as e:
                print(f"\033[91m[Error]\033[0m Error starting fallback stream: {e}")  # Red

    def stop_fallback(self):
        if self.fallback_proc and self.fallback_proc.poll() is None:
            print("\033[92m[Info]\033[0m Main stream started! Stopping fallback stream...")  # Green
            self.fallback_proc.terminate()
            try:
                self.fallback_proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                print("\033[91m[Error]\033[0m Fallback process did not terminate, killing it...")  # Red
                self.fallback_proc.kill()
            except Exception as e:
                print(f"\033[91m[Error]\033[0m Error stopping fallback stream: {e}")  # Red
        self.fallback_proc = None
        self.status["fallback_stream"] = "OFF"

    def monitor(self):
        while not self.stop_monitoring_event.is_set():
            publishing = self.is_stream_publishing()
            stats = self.get_stats()

            with self.lock:
                self.status.update(stats)
                if publishing:
                    if not self.status["monitoring"]:
                        print("\033[92m[Info]\033[0m Main stream detected! Automatically starting monitoring...")  # Green
                        self.start_monitoring()
                    self.stop_fallback()
                else:
                    self.start_fallback()

            time.sleep(2)

    def watch_main_stream(self):
        while True:
            if not self.status["monitoring"]:
                publishing = self.is_stream_publishing()
                if publishing:
                    print("\033[92m[Info]\033[0m Main stream detected! Starting monitoring...")  # Green
                    self.start_monitoring()
            time.sleep(2)

    def start_monitoring(self):
        with self.lock:
            if not self.status["monitoring"]:
                print("\033[92m[Info]\033[0m Starting monitoring...")  # Green
                self.stop_monitoring_event.clear()
                self.monitoring_thread = threading.Thread(target=self.monitor, daemon=True)
                self.monitoring_thread.start()
                self.status["monitoring"] = True

    def stop_monitoring(self):
        with self.lock:
            if self.status["monitoring"]:
                print("\033[92m[Info]\033[0m Stopping monitoring...")  # Green
                self.stop_monitoring_event.set()
                if self.monitoring_thread:
                    self.monitoring_thread.join()
                self.status["monitoring"] = False

                # Ensure fallback stream is stopped when monitoring stops
                if self.status["fallback_stream"] == "ON":
                    print("\033[92m[Info]\033[0m Stopping fallback stream as part of monitoring stop...")  # Green
                    self.stop_fallback()

                print("\033[92m[Info]\033[0m Returning to watching for main stream...")  # Green

    def get_status(self):
        with self.lock:
            return self.status.copy()

monitor = StreamMonitor()

@app.route("/api/monitoring/start", methods=["POST"])
def start_monitoring():
    monitor.start_monitoring()
    return jsonify({"message": "Monitoring started", "status": monitor.get_status()})

@app.route("/api/monitoring/stop", methods=["POST"])
def stop_monitoring():
    monitor.stop_monitoring()
    return jsonify({"message": "Monitoring stopped", "status": monitor.get_status()})

@app.route("/api/status", methods=["GET"])
def get_status():
    return jsonify(monitor.get_status())

if __name__ == "__main__":
    watch_thread = threading.Thread(target=monitor.watch_main_stream, daemon=True)
    watch_thread.start()
    app.run(host="0.0.0.0", port=80)