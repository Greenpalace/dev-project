from flask import Flask, render_template
import requests
import json

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    res = requests.get('http://wineflask:8000/select') # svc docker 확인 후 경로 변경
    data = res.text
    data = data.split(', ')
    for i in range(len(data)):
        data[i] = data[i][1:-2]
        

    return render_template('index.html', value = data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

