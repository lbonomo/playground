FROM python:3.12.2-slim

RUN mkdir /code
WORKDIR /code
# COPY ./code/ /code/
COPY ./code/requirements.txt /code/requirements.txt
RUN <<EOF
apt-get update
apt-get upgrade -y
apt-get install -y gcc
pip install --upgrade pip
pip install -r requirements.txt
# python manage.py migrate
EOF

EXPOSE 8000
CMD ["/usr/local/bin/uwsgi", "--ini", "/code/uwsgi.ini"]