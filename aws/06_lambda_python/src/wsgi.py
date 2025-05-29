from app import app

def app_handler(event, context):
    return app(event, context)