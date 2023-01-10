import psycopg2
import os
from flask import Flask
import random

app = Flask(__name__)

def get_connection():
    conn = psycopg2.connect(host = 'host.docker.internal',
                            database = 'wines',
                            user='postgres',
                            password = '1234',
                            port = '6000')
    return conn


@app.route("/red", methods=["GET"])
def red():
    conn = get_connection()
    cur = conn.cursor()
    prep = ''' SELECT * FROM wine WHERE "red/white" = 'red' '''
    cur.execute(prep)
    wines = cur.fetchall()
    print(wines)
    cur.close()
    conn.close()
    data = []
    for wine in wines:
        dic = {
            '이름' : wine[1],
            '생산지' : wine[2],
            '포도 품종' : wine[3],
            '알코올 도수' : wine[4],
            '어울리는 음식' : wine[5],
            }
        data.append(dic)
    print(data)
    return str(data)

@app.route("/select", methods=["GET"])
def select():
    conn = get_connection()
    cur = conn.cursor()
    prep = ''' SELECT * FROM wine'''
    cur.execute(prep)
    wines = cur.fetchall()
    print(wines)
    cur.close()
    conn.close()
    data = wines
    # for wine in wines:
    #     dic = {
    #         '이름' : wine[1],
    #         '생산지' : wine[2],
    #         '포도 품종' : wine[3],
    #         '알코올 도수' : wine[4],
    #         '어울리는 음식' : wine[5],
    #         }
    #     data.append(dic)

    return str(data[random.randint(0,len(data)-1)])

    # juso_db = pymysql.connect(
    #     user='flask01',
    #     password='flask01',
    #     host='mariadb01',
    #     port=3000,
    #     db='flask01_db',
    #     charset='utf8'
    # )
    # cursor = juso_db.cursor()
    # sql = "select id, email, phone_number from private;"
    # cursor.execute(sql)
    # row = cursor.fetchall()
    # print(row)

    # lst = []
    # for data in row:
    #     dic = {
    #         'id' : data[0],
    #         'email' : data[1],
    #         'phone_number' : data[2]
    #     }
    #     lst.append(dic)

    # juso_db.close()

    # return str(lst)


@app.route('/')
def hello_world():
 
    return 'Hello, world!'


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)