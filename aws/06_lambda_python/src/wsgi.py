import awsgi
from app import app

def handler(event, context):
    # Compatibilidad con API Gateway HTTP API (v2) y REST API (v1)
    if 'httpMethod' not in event and event.get('requestContext', {}).get('http'):
        # Adaptar evento v2 a v1
        event['httpMethod'] = event['requestContext']['http']['method']
        event['path'] = event['rawPath']
        event['headers'] = event.get('headers', {})
        event['queryStringParameters'] = event.get('queryStringParameters', {})
        event['body'] = event.get('body', '')
        event['isBase64Encoded'] = event.get('isBase64Encoded', False)
    return awsgi.response(app, event, context)
