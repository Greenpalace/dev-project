# -*- coding: utf-8 -*-
"""
Spyder Editor

This is a temporary script file.
"""

#libarary import 
import pandas as pd



# preprocessing 
data = pd.read_csv("cleansingWine.csv")


data.info()

integer = data.describe()
obj = data.describe(include = "object")

col = data.columns
data = data[col[1:]] # delete unnamed: 0 

data.info()

# 필요없는 칼럼 제거
drop_columns = ["local2","local3","local4", 
                "varieties2","varieties3","varieties4","varieties5","varieties6",
                "varieties7","varieties8", "varieties9", "varieties10", "varieties11", "varieties12"]
data = data.drop(drop_columns, axis =1)

# 칼럼명 변경
data = data.rename(columns = {"local1":"local", "varieties1":"varieties"})


# 수치형 데이터로 변경
reCol = ["sweet", "acidity", "body", "tannin"]
    
for col in reCol:
    data[col] = data[col].fillna('0')
    tmp = list()
    for d in data[col]:
        tmp.append(int(d[-1]))
    data[col] = tmp
    

# missing data 채우기
columns = data.columns.drop(reCol + ['price', 'year', 'ml'])

for col in columns:
    data[col] = data[col].fillna("Missing")
        
    
for col in ['price', 'year', 'ml']:
    data[col] = data[col].fillna(0)


# 수치가 두개인 것 분리
def split_updown(data, col):
    lower = list()
    upper = list()
    
    for d in data[col]:
        tmp = d.split('~')
        if tmp[0] == "Missing":
            tmp[0] = 0
        if len(tmp) > 1:        
            lower.append(tmp[0])
            upper.append(tmp[1])
        else:
            lower.append(tmp[0])
            upper.append(tmp[0])        
    
    data[col+"_upper"] = upper
    data[col + "_lower"] = lower
    
    return data

data = split_updown(data, "abv")
data = split_updown(data, "degree")    
data = data.drop(["abv", "degree"], axis = 1)


# 라벨링 하기
from sklearn.preprocessing import LabelEncoder

# 테이블 생성
nation = pd.DataFrame(data["nation"])
typ = pd.DataFrame(data["type"])
use = pd.DataFrame(data["use"])
local = pd.DataFrame(data["local"])
varieties = pd.DataFrame(data["varieties"])

le = LabelEncoder()

# 라벨 인코딩
nation["id"] = le.fit_transform(nation["nation"])
typ["id"] = le.fit_transform(typ["type"])
use["id"] = le.fit_transform(use["use"])
local["id"] = le.fit_transform(local["local"])
varieties["id"] = le.fit_transform(varieties["varieties"])


data_copy = data.copy() # 혹시모를 상황 대비해 df 복사

# 인코딩
data["nation"] = nation["id"]
data["type"] = typ["id"]
data["use"] = use["id"]
data["local"] = local["id"]
data["varieties"] = varieties["id"]

# 중복항을 제거하여 필요한 정보만 남김
nation = nation.drop_duplicates()
typ = typ.drop_duplicates()
use = use.drop_duplicates()
local = local.drop_duplicates()
varieties = varieties.drop_duplicates()


# data의 id 변경
for i in range(len(data["id"])):
    data["id"][i] = i


# data write
data.to_csv("data.csv", index = False)
nation.to_csv("nation.csv", index = False)
typ.to_csv("type.csv", index = False)
use.to_csv("use.csv", index = False)
local.to_csv("local.csv", index = False)
varieties.to_csv("varieties.csv", index = False)
 