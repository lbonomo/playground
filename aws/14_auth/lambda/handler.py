import json


def lambda_handler(event, context):
    """
    Lambda handler that responds to POST requests with "Hello World".
    Receives requests through API Gateway with IAM authorization.
    """
    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Hello World"}),
        "headers": {
            "Content-Type": "application/json"
        }
    }
