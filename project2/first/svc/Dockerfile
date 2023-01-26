FROM python:3.10

RUN pip install --upgrade pip setuptools wheel
RUN pip install flask
RUN pip install sqlalchemy
RUN pip install psycopg2
RUN pip install flask-cors

WORKDIR /

COPY svc.py /svc.py
COPY queries.py /queries.py

ENV FLASK_APP = '/svc.py'

EXPOSE 5000

CMD ["python3", "-m", "flask", "run", "--host=0.0.0.0"]