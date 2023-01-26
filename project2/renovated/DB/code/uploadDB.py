# -*- coding: utf-8 -*-
"""
Created on Tue Jan 10 10:04:11 2023

@author: lsy
"""
# pgsql에 올리기
import pandas as pd

wine = pd.read_csv("C:/Users/lsy/gitlab/DB_소연/data/data.csv") 


import psycopg2

conn = psycopg2.connect(host = "localhost",
                        dbname = "teamAD",
                        user="postgres",
                        password="ch0r0m9tsu134",
                        port="5432")


cur = conn.cursor()

postgres_insert_query = """ INSERT INTO "teamAD".wine (id, name, producer, nation, wine_type, sweet, acidity, body, tannin, 
                                                    price, local, varieties, use, abv_upper, abv_lower, degree_upper, 
                                                    degree_lower, ml, year) 
                                            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"""

record_to_insert = list()                              
for i in range(wine.shape[0]):
    record_to_insert.append(tuple((int(wine["id"][i]), wine["name"][i], wine["producer"][i], int(wine["nation"][i]), 
        int(wine["type"][i]), int(wine["sweet"][i]), int(wine["acidity"][i]), int(wine["body"][i]),int(wine["tannin"][i]), 
        int(wine["price"][i]), int(wine["local"][i]), int(wine["varieties"][i]), int(wine["use"][i]), float(wine["abv_upper"][i]), 
        float(wine["abv_lower"][i]), float(wine["degree_upper"][i]), float(wine["degree_lower"][i]), int(wine["ml"][i]), int(wine["year"][i]))))
    
cur.executemany(postgres_insert_query, record_to_insert)
conn.commit()
cur.close()
conn.close()

