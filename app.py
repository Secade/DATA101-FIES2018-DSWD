from flask import Flask, Response, jsonify
import pandas as pd

app = Flask(__name__)
# STATIC PAGES
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
