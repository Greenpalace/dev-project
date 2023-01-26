from flask import Flask, request, json
from flask_cors import CORS
from queries import *
import flask

app = Flask(__name__)
CORS(app)


@app.route('/localbynation', methods=['GET'])
def getlbyn():
    nk = request.args['nation']
    if request.method == "GET":
        response = app.response_class(
            response = json.dumps(
                {"data":lbyn(nk)}
            ),
            status = 200,
            mimetype = 'application/json'
        )
    return response

@app.route('/type', methods=['GET'])
def gettype():
    result = retype()
    response = app.response_class(
        response = json.dumps(
            result
        ),
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route('/nation', methods=['GET'])
def getnation():
    result = renation()
    response = app.response_class(
        response = json.dumps(
            result
        ),
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route('/local', methods=['GET'])
def getlocal():
    result = relocal()
    response = app.response_class(
        response = json.dumps(
            result
        ),
        status = 200,
        mimetype='application/json'
    )
    return response

@app.route('/varieties', methods=['GET'])
def getvar():
    result = revar()
    response = app.response_class(
        response = json.dumps(
            result
        ),
        status = 200,
        mimetype='application/json'
    )
    return response

@app.route('/use', methods=['GET'])
def getuse():
    result = reuse()
    response = app.response_class(
        response = json.dumps(
            result
        ),
        status = 200,
        mimetype='application/json'
    )
    return response


@app.route('/wine', methods=["GET", "POST"])
def search():
    if request.method == "GET":
        name = request.args['name'] if len(request.args['name']) != 0 else None
        nation = request.args.getlist('nation[]')
        type = request.args.getlist('type[]')
        sweet = request.args.getlist('sweet[]')
        acidity = request.args.getlist('acidity[]')
        body = request.args.getlist('body[]')
        tannin = request.args.getlist('tannin[]')
        price_low = request.args['price_l']
        price_high = request.args['price_h']
        page = request.args['page']
        ords = request.args['sort']
        result = getinfo(name, nation, type, sweet, acidity, body, tannin, price_low, price_high, page, ords)
        response = app.response_class(
            response = json.dumps(
                result
            ),
            status = 200,
            mimetype='application/json'
        )
        print(result)
        return response
    if request.method == "POST":
        data = request.get_json()
        name = str(data['name'])
        nation = int(data['nation'])
        types = int(data['type'])
        sweet = int(data['sweet'])
        acidity = int(data['acidity'])
        body = int(data['body'])
        tannin = int(data['tannin'])
        price = int(data['price'])
        producer = str(data['producer'])
        abv_h = float(data['abv_h'])
        abv_l = float(data['abv_l'])
        degree_h = float(data['degree_h'])
        degree_l = float(data['degree_l'])
        year = int(data['year'])
        ml = int(data['ml'])
        local = int(data['local'])
        varieties = int(data['varieties'])
        use = int(data['use'])
        addwine(name, nation, types, sweet, acidity, body, tannin, price, producer, local, varieties, use, abv_h, abv_l, degree_h, degree_l, year, ml)
        response = app.response_class(
            status = 200
        )
        return response

@app.route('/wine/<int:wid>', methods=["GET", "PATCH", "DELETE"])
def modifier(wid):
    if request.method == "GET":
        result = getdetail(wid)
        response = app.response_class(
            status = 200,
            response = json.dumps(
                result
            ),
            mimetype = 'application/json'
        )
        return response
    if request.method == "PATCH":
        data = request.get_json()
        name = str(data['name'])
        producer = str(data['producer'])
        nation = int(data['nation'])
        wine_type = int(data['type'])
        sweet = int(data['sweet'])
        acidity = int(data['acidity'])
        body = int(data['body'])
        tannin = int(data['tannin'])
        price = int(data['price'])
        local = int(data['local'])
        varieties = int(data['varieties'])
        use = int(data['use'])
        abv_upper = float(data['abv_h'])
        abv_lower = float(data['abv_l'])
        degree_upper = float(data['degree_h'])
        degree_lower = float(data['degree_l'])
        ml = int(data['ml'])
        year = int(data['year'])
        editwine(wid,name=name,producer=producer,nation=nation,wine_type=wine_type,sweet=sweet,\
            acidity=acidity,body=body,tannin=tannin,price=price,local=local,varieties=varieties,\
                use=use,abv_upper=abv_upper, abv_lower=abv_lower, degree_upper=degree_upper,\
                     degree_lower=degree_lower, ml=ml, year=year)
        response = app.response_class(
            status = 200
        )
        return response
    if request.method == "DELETE":
        deletewine(wid)
        response = app.response_class(
            status = 200
        )
        return response

if __name__ == "__main__":
    app.run(debug=True, port= 5001)