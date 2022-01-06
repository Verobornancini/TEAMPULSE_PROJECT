# SLACK - BOT: TeamPulse V 1.0
# Data analysis process: 01_Cleaning

# Import necessary libraries
import pandas as pd
import numpy as np
from textblob import TextBlob
from pysentimiento import SentimentAnalyzer
from datetime import datetime
from hashlib import md5
import time
import json
import boto3
import os
from sklearn import preprocessing
from dotenv import load_dotenv
from pathlib import Path 

print('-------------------------------------------------------------')
print('Inicia el proceso de Limpieza y transformación de datos (#01)')
print('-------------------------------------------------------------')

# 1) Reading environment variables:
print('PASO 1: Cargamos las variables de entorno')
# from the environment
CLIENT = os.getenv('CLIENT_NAME')
print('------> CLIENTE:', CLIENT)
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
# Create s3 object (This is how we access non public buckets and objets, i.e. files)
s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)

# 2) Download the dataset from the url where it is hosted
print('PASO 2: Obtenición del dataset de mensajes')
bucketName = "bitlogic-bot"
fileName = "bitlogic_slack_historial_de_mensajes.csv"
#bucketName = "%s-bot" % CLIENT
#fileName = "%s_slack_historial_de_mensajes.csv" % CLIENT
s3.Bucket(bucketName).download_file(fileName, fileName) 

df = pd.read_csv(fileName, index_col=0)
print('------> Cantidad de mensajes en el historial: ',df.shape)

# 3) Filtering messages
print('PASO 3: Filtrado de mensajes')
# Filtering null (NaN) messages
df=df.dropna(subset=['text'])
# Filtering duplicate messages
df = df.drop_duplicates()
# After the filtering process, reset the index to avoid future problems
df.reset_index(inplace=True,drop=True)
# Filtering unnecesary messages
df= df.drop(df[df['text'].str.contains('se ha unido al canal')].index)
print('------> Cantidad de mensajes despúes del filtrado: ',df.shape)

# 4) Date type transformation 
print ("PASO 4: Transformación de datos: timestamp to datetime")
# The date variable comes in timestamp format (Unix timestamp): Number of seconds since ** 01/01/1970 **
# Creation of a new variable: datetime 
date = []
for i, row in df.iterrows():
    timestamp = row['ts']
    dt_object = datetime.fromtimestamp(timestamp)
    date.append(dt_object)
df['datetime'] = pd.Series(date)
# Creation of a new variable to be used as an index
df['index_date'] = [d.date() for d in df['datetime']]
# Split the date and time information into different variables
df['date'] = [d.date() for d in df['datetime']]
df['time'] = [d.time() for d in df['datetime']]
df['month'] = df['datetime'].dt.month
df['year'] = df.datetime.dt.isocalendar().year
df["week"] = df.datetime.dt.isocalendar().week

# 5) Message translation
print ("PASO 5: Traducción de mensajes")
error_message=""
number=0
try:
    for i, row in df.iterrows():
        number=i
        error_message = row['text']
        message = TextBlob(row['text'])
        if row['translations'] =="A":
            try:
                new = message.translate(from_lang='es', to='en')
                df.loc[i,'translations'] = str(new)
                time.sleep(3)
            except Exception as e:
                if (str(e))=="Translation API returned the input string unchanged.":
                    df.loc[i,'translations'] = row['text']
                else:
                    print(str(e)) 
except Exception as e: 
    print("An error occurred")
    print(error_message)
    print(str(number))
    print(str(e))

# Replaced null translations by "A"
df['translations']=df['translations'].fillna("A")
translated = df[(df.translations != "A")]
print('------> Cantidad de mensajes traducidos: ',translated.shape)
non_translated = df[(df.translations == "A")]
print('------> Cantidad de mensajes no traducidos: ',non_translated.shape)
# Filtering duplicate messages
df = df.drop_duplicates()

# save changes
df.to_csv(fileName, sep=',')
s3.Bucket(bucketName).upload_file(fileName, fileName)

# 6) Sentiment analysis of messages in English
print('PASO 6: Analisis de sentimiento: Textblob')
# polarity
for i, row in df.iterrows():
    message = row['translations']
    if row['polarity'] == 0 or 0.000000:
        try:
            result=TextBlob(message).sentiment.polarity
            df.loc[i,'polarity']=result
        except Exception as e:
            print(e)
# subjectivity
for i, row in df.iterrows():
    message = row['translations']
    if row['subjectivity'] == 0 or 0.000000:
        try:
            result=TextBlob(message).sentiment.subjectivity
            df.loc[i,'subjectivity']=result
        except Exception as e:
            print("An error occurred")
# Normalization of polarity and subjectivity indices for future analysis
min_max_scaler = preprocessing.MinMaxScaler()
column_names_to_normalize = ['polarity', 'subjectivity']
x = df[column_names_to_normalize].values
x_scaled = min_max_scaler.fit_transform(x)
df_temp = pd.DataFrame(x_scaled, columns=column_names_to_normalize, index = df.index)
df[column_names_to_normalize] = df_temp

# 7) Sentiment analysis of messages in Spanish
print('PASO 7: Analisis de sentimiento: Pysentimiento')
analyzer = SentimentAnalyzer()
for i, row in df.iterrows():
    message = row['text']
    if row['classification'] =="NONE":
        try:
            result=analyzer.predict_probas(message)
            result_2=analyzer.predict(message)
            df.loc[i,'negativity']=result['NEG']
            df.loc[i,'neutrality']=result['NEU']
            df.loc[i,'positivity']=result['POS']
            df.loc[i,'classification']=str(result_2)
        except Exception as e:
            print("------> An error occurred")

# 8) Save changes
print("PASO 8: Persistimos en S3")
# Saving the clean and translated dataframe as a .csv file
df.to_csv(fileName, sep=',')
# Setting the Persistence of the message history in s3
s3.Bucket(bucketName).upload_file(fileName, fileName)

print('-------------------------------------------------------------')
print("FIN DEL PROCESO") 
print('-------------------------------------------------------------')