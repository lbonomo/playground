from app import app
import awsgi

def handler(event, context):
    """
    AWS Lambda handler function to process incoming requests.
    """
    return awsgi.response(app, event, context)    