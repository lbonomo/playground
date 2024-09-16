FROM python:3.12.2-slim

RUN mkdir /code
WORKDIR /code
# It's necessary to copy requirements.txt to run `pip install -r requirements.txt`
# on build process.
COPY ./code/requirements.txt /code/requirements.txt
RUN <<EOF
apt-get update
apt-get upgrade -y
apt-get install -y gcc
pip install --upgrade pip
pip install -r requirements.txt
EOF

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
