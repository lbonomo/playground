FROM python:3.12.2-slim

RUN mkdir /code
WORKDIR /code
COPY ./code/ /code/
RUN <<EOF
pip install --upgrade pip
pip install -r requirements.txt
python manage.py migrate
EOF

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "app.wsgi"]