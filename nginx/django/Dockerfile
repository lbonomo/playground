FROM python:3.12.2-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
WORKDIR /code
RUN <<EOF
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
EOF
