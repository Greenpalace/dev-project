from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Table, MetaData
from typing import Union

engine = create_engine("postgresql://postgres:1234@localhost:5433/postgres")
Session = sessionmaker()
Session.configure(bind=engine)
base = declarative_base()
metadata = MetaData(bind=engine)

session = Session()

wine = Table("wine", metadata, autoload_with = engine, schema="teamAD")
localt = Table("local", metadata, autoload_with = engine, schema="teamAD")
nation = Table("nation", metadata, autoload_with = engine, schema="teamAD")
typetable = Table("wine_types", metadata, autoload_with = engine, schema="teamAD")
use = Table("use", metadata, autoload_with = engine, schema="teamAD")
varieties = Table("varieties", metadata, autoload_with = engine, schema="teamAD")

class winet(base):
    __table__ = metadata.tables['teamAD.wine']

def retype():
    results = session.query(typetable).order_by(typetable.c.wine_types.asc()).all()
    result = list()
    for r in results:
        data = dict()
        data[r[0]] = r[1].strip()
        result.append(data)
    return result

def renation():
    results = session.query(nation).order_by(nation.c.nation.asc()).all()
    result = list()
    for r in results:
        data = dict()
        data[r[0]] = r[1].strip()
        result.append(data)
    return result

def reuse():
    results = session.query(use).order_by(use.c.use.asc()).all()
    result = list()
    for r in results:
        data = dict()
        data[r[0]] = r[1].strip()
        result.append(data)
    return result

def relocal():
    results = session.query(localt).order_by(localt.c.local.asc()).all()
    result = list()
    for r in results:
        data = dict()
        data[r[0]] = r[1].strip()
        result.append(data)
    return result

def revar():
    results = session.query(varieties).order_by(varieties.c.varieties.asc()).all()
    result = list()
    for r in results:
        data = dict()
        data[r[0]] = r[1].strip()
        result.append(data)
    return result

def editwine(w_id,name,producer, nation, local, varieties, wine_type, use, sweet, acidity, body, tannin, price, year, ml, abv_upper, abv_lower, degree_upper, degree_lower):
    session.query(wine).filter(wine.c.id==w_id).update({'name':name,'producer':producer,'nation':nation,\
        'local':local, 'varieties':varieties, 'wine_type':wine_type, 'use':use,\
            'sweet':sweet, 'acidity':acidity, 'body':body, 'tannin':tannin,\
                'price':price, 'year':year, 'ml':ml,\
                    'abv_upper':abv_upper, 'abv_lower':abv_lower, 'degree_upper':degree_upper, 'degree_lower':degree_lower})
    session.commit()

def deletewine(w_id):
    session.query(wine).filter(wine.c.id==w_id).delete()
    session.commit()

nationval = list(range(len(renation())))
typesval = list(range(len(retype())))
sweets = [1,2,3,4,5]
aciditys = [1,2,3,4,5]
bodys = [1,2,3,4,5]
tannins = [1,2,3,4,5]

def getinfo(name:Union[str,None], nation:Union[str,list], types:Union[int,list], \
    sweet:Union[int,list], acidity:Union[int,list], body:Union[int,list], \
    tannin:Union[int,list], price_l:int, price_h:int,page:str, ords:str)->Union[list,int]:
    
    # 정렬을 위한 dictionary
    order = {"0" : wine.c.name.asc(), "1" : wine.c.name.desc(), "2" : wine.c.sweet.asc(), "3" : wine.c.sweet.desc(),\
             "4" : wine.c.acidity.asc(), "5" : wine.c.acidity.desc(), "6" : wine.c.body.asc(), "7" : wine.c.body.desc(),\
             "8" : wine.c.tannin.asc(), "9" : wine.c.tannin.desc(), "10" : wine.c.price.asc(), "11" : wine.c.price.desc()}

    nation = nation if not len(nation) == 0 else nationval
    sweet = sweet if not len(sweet) == 0 else sweets
    types = types if not len(types) == 0 else typesval
    body = body if not len(body) == 0 else bodys
    tannin = tannin if not len(tannin) == 0 else tannins
    acidity = acidity if not len(acidity) == 0 else aciditys
    
    page = int(page)
    if name != None:
        name = '%' + name + '%'
        results = session.query(
            wine.c.id, wine.c.name, wine.c.nation, \
                wine.c.wine_type, wine.c.sweet, wine.c.acidity, \
                    wine.c.body, wine.c.tannin, wine.c.price
                    ).filter(wine.c.name.like(name),\
                        wine.c.nation.in_(nation), wine.c.wine_type.in_(types), wine.c.sweet.in_(sweet),\
                        wine.c.acidity.in_(acidity), wine.c.body.in_(body), wine.c.tannin.in_(tannin), \
                        wine.c.price.between(price_l, price_h)
                    ).order_by(order[ords])
        if page == 1:
            totalpage = len(results.all())//100 + 1
            results = results.limit(100).all()
        else:
            totalpage = 0
            results = results.offset((page-1)*100).limit(100).all()
        result = list()
        for r in results:
            data = dict()
            data['id'] = r[0]
            data['name'] = r[1].strip()
            data['nation'] = r[2]
            data['type'] = r[3]
            data['sweet'] = r[4]
            data['acidity'] = r[5]
            data['body'] = r[6]
            data['tannin'] = r[7]
            data['price'] = r[8]
            result.append(data)
        response = {"data":result, "page":int(totalpage)}
        return response
    else:
        results = session.query(
            wine.c.id, wine.c.name, wine.c.nation, \
                wine.c.wine_type, wine.c.sweet, wine.c.acidity, \
                    wine.c.body, wine.c.tannin, wine.c.price
                    ).filter(
                        wine.c.nation.in_(nation), wine.c.wine_type.in_(types), wine.c.sweet.in_(sweet), \
                        wine.c.acidity.in_(acidity), wine.c.body.in_(body), wine.c.tannin.in_(tannin), \
                        wine.c.price.between(price_l, price_h)
                    ).order_by(order[ords])
        if page == 1:
            totalpage = len(results.all())//100 + 1
            results = results.limit(100)
        else: 
            totalpage = 0
            results = results.offset((page-1)*100).limit(100)
        result = list()
        for r in results:
            data = dict()
            data['id'] = r[0]
            data['name'] = r[1].strip()
            data['nation'] = r[2]
            data['type'] = r[3]
            data['sweet'] = r[4]
            data['acidity'] = r[5]
            data['body'] = r[6]
            data['tannin'] = r[7]
            data['price'] = r[8]
            result.append(data)
        response = {"data":result, "page":int(totalpage)}
        return response

def getdetail(wid):
    res = session.query(wine).filter(wine.c.id == wid).one()
    result = dict()
    result['id'] = res[0]
    result['name'] = res[1].strip()
    result['producer'] = res[2].strip()
    result['nation'] = res[3]
    result['type'] = res[6]
    result['sweet'] = res[8]
    result['acidity'] = res[9]
    result['body'] = res[10]
    result['tannin'] = res[11]
    result['price'] = res[12]
    result['local'] = res[4]
    result['varieties'] = res[5]
    result['use'] = res[7]
    result['abv_upper'] = float(res[15])
    result['abv_lower'] = float(res[16])
    result['degree_upper'] = float(res[17])
    result['degree_lower'] = float(res[18])
    result['ml'] = res[14]
    result['year'] = res[13]

    return result

def addwine(name, nation, types, sweet, acidity, body, tannin, price, producer, local, varieties, use, abv_h, abv_l, degree_h, degree_l, year, ml):
    new = winet(name = name, nation = nation, wine_type=types, sweet=sweet, acidity=acidity, body = body, tannin = tannin, price=price,\
                producer=producer, local=local, varieties=varieties, use=use, abv_upper=abv_h,\
               abv_lower=abv_l, degree_upper=degree_h, degree_lower=degree_l, year=year, ml=ml)
    session.add(new)
    session.commit()
    wine.update()
    return None

def lbyn(nk):
    localkey = session.query(wine.c.local).filter(wine.c.nation == nk).all()
    localkey = set(list(map(lambda x:x[0], localkey)))
    result = session.query(localt.c.local).filter(localt.c.id.in_(localkey)).all()
    result = list(map(lambda x:x[0].strip(), result))
    return result

