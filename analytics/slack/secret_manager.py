import json
import boto3
import base64
from botocore.exceptions import ClientError

# Function for obtaining slack tokens & google credentials from AWS secret manager service
def get_secret(name):
    secret_name = name
    region_name = "us-east-1"
    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name)
    try:
        get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    except Exception as e:
        if (str(e))=='DecryptionFailureException':
            print(str(e))
            raise e
        elif (str(e))=='InternalServiceErrorException':
            print(str(e))
            raise e
        elif (str(e))== 'InvalidParameterException':
            print(str(e))
            raise e
        elif (str(e))=='InvalidRequestException':
            print(str(e))
            raise e
        elif (str(e))=='ResourceNotFoundException':
            print(str(e))
            raise e
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            secret = base64.b64decode(get_secret_value_response['SecretBinary'])

    return json.loads(secret)  # returns the secret as dictionary