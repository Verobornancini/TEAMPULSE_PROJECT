## Before starting: Cleaning loggers
import logging
from datetime import datetime
if logging.getLogger('').hasHandlers():
    logging.getLogger('').handlers.clear()
# Setting basics for .log file
today = datetime.now().strftime('%d-%m-%Y')
filename = f'Slack_bot_temapulse_{today}.log' 
# Logging initial configuration
logging.basicConfig(
    format='%(asctime)s %(levelname)s %(message)s', datefmt='%d/%m/%Y %I:%M:%S %p',
    filename = filename, # name of the log. 
    filemode = "a")  #'a' means appends
logger = logging.getLogger()
logger.setLevel(20)

#############################################################################################

try:
    logging.info('-------------------------------------------------------------')
    logging.info('SLACK BOT TEAMPULSE')
    print('SLACK BOT TEAMPULSE')
    logging.info('-------------------------------------------------------------')
    logging.info('STEP 1: Import required libraries')
    print('STEP 1: Import required libraries')
    from slackeventsapi import SlackEventAdapter
    from slack import WebClient
    from datetime import datetime, timedelta 
    import time
    import pandas as pd
    import numpy as np
    import json
    import sys 
    import os
    from pathlib import Path
    from dotenv import load_dotenv
    import boto3
    import base64
    from botocore.exceptions import ClientError
    import json
except Exception as e: 
    logging.error(f'---> The following error has occurred= {e}')

try:
    logging.info('STEP 2: Import secrets from AWS Secret_Manager')
    print('STEP 2: Import own developed library')
    #CLIENT = os.getenv('CLIENT_NAME')
    secret=''    
    CLIENT = 'bitlogic'
    logging.info(f'---> CLIENTE= {CLIENT}')
    print(f'---> CLIENTE= {CLIENT}')
    secret_name = f'slack_{CLIENT}'
    region_name = "us-east-1"
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager',region_name=region_name)
    get_secret_value_response = client.get_secret_value(SecretId=secret_name)
    if 'SecretString' in get_secret_value_response:
        secret = get_secret_value_response['SecretString']
    else:
        secret = base64.b64decode(get_secret_value_response['SecretBinary'])   
except Exception as e: 
    logging.error(f'---> The following error has occurred= {e}')

try:
    logging.info('STEP 3: Definition of connection parameters to access storage data')
    print('STEP 3: Definition of connection parameters to access storage data')
    logging.info('---> From .json file created whith Secrets Manager client for slack tokens')
    secret = json.loads(secret) # returns the secret as dictionary 
    AWS_ACCESS_KEY_ID = secret['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = secret['AWS_SECRET_ACCESS_KEY']
    SLACK_SIGNING_SECRET = secret['SLACK_SIGNING_SECRET']
    SLACK_BOT_TOKEN = secret['SLACK_BOT_TOKEN']
    VERIFICATION_TOKEN = secret['VERIFICATION_TOKEN']
except Exception as e: 
    logging.error(f'---> The following error has occurred= {e}')
    
try:    
    logging.info('STEP 4: Set conection to Slack and AWS s3 bucket')
    print('STEP 4: Set conection to Slack and AWS s3 bucket')
    logging.info('Create a slack client instance')
    slack_client = WebClient(SLACK_BOT_TOKEN)
    logging.info('Create s3 object to access non public buckets and objets')
    s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
except Exception as e: 
    logging.error(f'---> The following error has occurred= {e}')

try: 
    logging.info('STEP 5: Create the Channel.csv file')
    print('STEP 5: Create the Channel.csv file')
    bucketName = f'{CLIENT}-bot'
    fileNameCh = f'{CLIENT}_channels.csv'
    s3.Bucket(bucketName).download_file(fileNameCh, fileNameCh) 
    fileObj = Path(fileNameCh)
    fileExists = fileObj.is_file() # Returns a boolean
    fileNotEmpty = os.stat(fileObj).st_size > 0 # Returns a boolean
    if fileExists and fileNotEmpty is True:
        df_channels = pd.read_csv(fileNameCh, index_col=['Channel_id'])
    else:
        df_channels = pd.DataFrame(columns = ('Channel_name','latest','Channel_id'))
        df_channels.drop(df_channels.columns[df_channels.columns.str.contains('Unnamed',case = False)],axis = 1, inplace = True)
        df_channels.to_csv(fileNameCh, sep = ',')
        df_channels = pd.read_csv(fileNameCh,index_col=['Channel_id'])
except Exception as e: 
    logging.error(f'---> The following error has occurred= {e}')

try:
    logging.info('STEP 6: Channel list iteration and message download')
    print('STEP 6: Channel list iteration and message download')
    secret = json.loads(secret) # returns the secret as dictionary 
    SLACK_BOT_TOKEN = secret['SLACK_BOT_TOKEN']
    slack_client = WebClient(SLACK_BOT_TOKEN)
    channels_history = slack_client.conversations_list(token = SLACK_BOT_TOKEN)  
    channels = channels_history.get("channels")
    for channel in channels:
        channel_id = channel.get("id")
        channel_name = channel.get("name")
        # Check if the bot is a channel member. If it is not, continue with the next channel
        if channel.get("is_member")==False:
            logging.info(f'---> {channel_name} : the bot is not a member of this channel')
            print(f'---> {channel_name} : the bot is not a member of this channel')
            continue
        logging.info(f'Channel accessed:{channel_name}')
        print (f'Channel accessed:{channel_name}')
        message_list =[]
        has_more = True # Means if there are more messages to download
        cursor = None # Paginate through collections of data by setting the cursor parameter to a next_cursor attribute returned by a previous request's response_metadata
        limit = 100 # The maximum number of items to return
        current_time = datetime.now()
        latest = datetime.timestamp(current_time) # End of time range of messages to include in results
        oldest = 0 # Start of time range of messages to include in results
        
        logging.info('STEP 7: Add information to channel.csv file')
        print('STEP 7:  Add information to channel.csv file')
        if channel_id in df_channels.index:
            # Get the full row of the channel by searching for its id
            channel_in = df_channels.loc[channel_id] 
            # Assign the value of oldest, with the latest from the %s_channels.csv file
            oldest = channel_in['latest']
            # Save the new latest
            df_channels.loc[channel_id,'latest'] = latest
            # Drop the Unnecesary data
            df_channels.drop(df_channels.columns[df_channels.columns.str.contains('Unnamed',case = False)],axis = 1, inplace = True)
            # Save as .csv
            df_channels.to_csv(fileNameCh, sep=',')
        else:
            info_channels= {'Channel_id':[channel_id],'Channel_name':channel_name,'latest':latest}
            new_channel = pd.DataFrame(data = info_channels, columns = ['Channel_id','Channel_name','latest'])
            df_channels = pd.concat([df_channels, new_channel])
            df_channels.drop(df_channels.columns[df_channels.columns.str.contains('Unnamed',case = False)],axis = 1, inplace = True)
            df_channels.to_csv(fileNameCh, sep=',')
    
        logging.info('STEP 8: Message download')
        print('STEP 8: Message download')
        while has_more == True:
            secret = json.loads(secret) # returns the secret as dictionary 
            SLACK_BOT_TOKEN = secret['SLACK_BOT_TOKEN']
            slack_client = WebClient(SLACK_BOT_TOKEN)
            conversations_history = slack_client.conversations_history(
                channel = channel_id, 
                token = SLACK_BOT_TOKEN,
                cursor = cursor, 
                limit = limit,
                inclusive = True,
                latest = latest,
                oldest = oldest)
            metadata = conversations_history.get("response_metadata")
            has_more = conversations_history.get("has_more")
            # Get message history
            for element in conversations_history.get("messages"):
                message_list.append(element)
            # Cursor setting  
            if metadata is not None:
                cursor = metadata.get("next_cursor")              
        # Transform the message list to dataframe
        df_new_history = pd.DataFrame(message_list)
        # Set columns with additional information
        df_new_history['Channel_id']= str(channel_id)
        df_new_history['Channel_name']= str(channel_name)
        # columns that will be obtained in the data analysis process
        df_new_history['translations'] ="A"
        df_new_history['polarity'] = 0
        df_new_history['subjectivity'] = 0
        df_new_history['negativity'] = 0
        df_new_history['neutrality'] = 0
        df_new_history['positivity'] = 0
        df_new_history['classification'] ="NONE"
        df_new_history['datetime'] =""
        df_new_history['index_date'] =""
        df_new_history['date'] =""
        df_new_history['month']=""
        df_new_history['year']=""
        df_new_history['time'] =""
        
        logging.info('STEP 9: Acquisition of historical data hosted in AWS s3 Bucket')
        print('STEP 9: Acquisition of historical data hosted in AWS s3 Bucket')              
        fileNameMsg = f'{CLIENT}_slack_historial_de_mensajes.csv'
        s3.Bucket(bucketName).download_file(fileNameMsg, fileNameMsg)
        logging.info('---> File verification before downloading')
        fileObj = Path(fileNameMsg)
        fileExists = fileObj.is_file() # Returns a boolean
        fileNotEmpty = os.stat(fileObj).st_size > 0 # Returns a boolean
        if fileExists and fileNotEmpty is True:
            df_old_history = pd.read_csv(fileNameMsg, index_col=0)
            logging.info(f'---> DF_OLD_HISTORY= {df_old_history.shape}')
            logging.info(f'---> DF_NEW_HISTORY= {df_new_history.shape}')
            logging.info('---> Adding the new messages list obtained to the existing file')
            df_all_history = pd.concat([df_new_history, df_old_history])
            logging.info(f'---> DF_ALL_HISTORY= {df_all_history.shape}')
            df_all_history.drop(['Channel_name'], axis='columns', inplace=True)
            df_all_history.to_csv(fileNameMsg, sep=',')
        else:
            df_all_history.drop(['Channel_name'], axis='columns', inplace=True)
            df_all_history.to_csv(fileNameMsg, sep=',')

        logging.info('STEP 10: Message history persistence in s3 bucket')
        logging.info('-------------------------------------------------------')
        logging.info("Ended process")
        print("Ended process")
        logging.info('-------------------------------------------------------')
        logging.shutdown()
        s3.Bucket(bucketName).upload_file(fileNameCh, fileNameCh)
        s3.Bucket(bucketName).upload_file(fileNameMsg, fileNameMsg)
        s3.Bucket(bucketName).upload_file(filename, filename)
        
except Exception as e: 
    print(f'---> The following error has occurred= {e}')