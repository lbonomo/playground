# Nginx + uWSGI

## Python
Curren LTS version is 3.12

https://devguide.python.org/versions/

### Manually to test

```
docker run -it -p 8000:8000 -v ./code/:/code/ python:3.12.2-slim bash
```

```
cd /code
apt-get update
apt-get upgrade -y
apt-get install -y gcc
pip install --upgrade pip
pip install -r requirements.txt
/usr/local/bin/uwsgi --ini /code/uwsgi.ini
```