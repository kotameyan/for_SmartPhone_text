# --------------------最初の処理--------------------
# インポート
from flask import Flask, render_template, jsonify
import json
import re
from urllib import request

# インスタンス化
app = Flask(__name__)



# --------------------ツール--------------------
# 選択されているサービス
service = {'name':'none','width':0}

# 文章を品詞分解するメソッド（Yahooテキスト解析API使用）
def text_analysis(text):
    APPID = "dj00aiZpPTVRSHJIR0NMdERheSZzPWNvbnN1bWVyc2VjcmV0Jng9MDM-"
    URL = "https://jlp.yahooapis.jp/MAService/V2/parse"

    def post(query):
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Yahoo AppID: {}".format(APPID),
        }
        param_dic = {
        "id": "1234-1",
        "jsonrpc": "2.0",
        "method": "jlp.maservice.parse",
        "params": {
            "q": query
        }
        }
        params = json.dumps(param_dic).encode()
        req = request.Request(URL, params, headers)
        with request.urlopen(req) as res:
            body = res.read()
        return body.decode()

    res_json = post(text)
    res_dict = json.loads(res_json)
    res_data = res_dict["result"]["tokens"]

    res_result = []
    for i in range(len(res_data)):
        res_result.append([res_data[i][0],len(res_data[i][0]),res_data[i][3],res_data[i][4]])

    return res_result

# スマホの幅に合わせた文章に変えるメソッド
def text_change(input_data, text_width):
    text_result = ''
    row_count = 0

    for item in input_data:
        if item[3] == 'アルファベット':
            item[1] /= 2

        if item[2] == '特殊':
            text_result += item[0]
            text_result += '\n'
            row_count = 0
        elif row_count + item[1] >= text_width:
            text_result += '\n'
            row_count = 0
            text_result += item[0]
            row_count += item[1]
        else:
            text_result += item[0]
            row_count += item[1]

    return text_result



# --------------------ルーティング--------------------
# ホーム画面に移動
@app.route("/")
def index():
    return render_template('index.html')



# --------------------API--------------------
# 文章の変換を実行
@app.route("/execution/<text>")
def execution(text):
    result_of_analysis = text_analysis(text)
    result = text_change(result_of_analysis,service["width"])
    return jsonify(flask_variable=result)

# サービス切り替え
@app.route("/service/switch/<name>")
def switch(name):
    service["name"] = name
    if name == 'LINE':
        service["width"] = 17
        return jsonify(flask_variable="LINE")
    elif name == 'Teams':
        service["width"] = 18
        return jsonify(flask_variable="Teams")

# 未実装
# サービス切り替え（カスタム）
# @app.route("/service/switch/custom/<int:width>")
# def switch_custom(width):
#     service["name"] = "custom"
#     service["width"] = width
#     return jsonify(flask_variable="custom")

#サービス問い合わせ
@app.route("/service/search")
def search():
    return jsonify(flask_variable=service["name"])



# --------------------最後の処理--------------------
# flask起動
if __name__ == '__main__':
    # macではAirPlayが既にポート5000番を使っている
    app.run(debug=True, port=8888)
