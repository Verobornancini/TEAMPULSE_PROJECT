# SLACK - BOT: TeamPulse V 1.0
# Data analysis process: 02_Data_Analysis

# Import necessary libraries
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from datetime import datetime
import gspread
from gspread_dataframe import set_with_dataframe
from google.oauth2.service_account import Credentials
from wordcloud import WordCloud
import plotly.graph_objects as go
import plotly.express as px
import plotly.io as pio
import csv
import os
import re
from re import *
import collections
import spacy
import nltk
from nltk.corpus import wordnet
from nltk.corpus import stopwords
from dotenv import load_dotenv
from pathlib import Path 
import json
import base64
import boto3
from botocore.exceptions import ClientError
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive   

# from secret_manager.py
from secret_manager import get_secret

print('----------------------------------------------------')
print('Inicia el proceso de análisis de datos (#02)')
print('----------------------------------------------------')

# 1) Reading environment variables:
print('PASO 1: Cargamos las variables de entorno')
# from the environment 
CLIENT = os.getenv('CLIENT_NAME')
print('------> CLIENTE:', CLIENT)
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
# Create s3 object (This is how we access non public buckets and objets, i.e. files)
s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
# from .json file created whith Secrets Manager client for Google credentials / Service Account
CREDENTIALS = 'credentials.json'
service_account_info = get_secret('google_bitlogic')
#service_account_info = get_secret('google_%s' % CLIENT)
with open(CREDENTIALS, 'w') as fp:
    json.dump(service_account_info, fp)
# from .json file created whith Secrets Manager client for Google client_secrets / ID Oauth Client
GOOGLE_DRIVE= 'client_secrets.json'
drive_account_info = get_secret('drive_bitlogic')
#drive_account_info = get_secret('drive_%s' % CLIENT)
with open(GOOGLE_DRIVE, 'w') as fp:
    tu_dict = drive_account_info
    web_dict = {"web": tu_dict} 
    json.dump(web_dict, fp) 
# from .txt file created whith Secrets Manager client for Google client_secrets / ID Oauth Client
AUTHORIZE_CREDENTIALS= 'GoogleDriveCredentials.txt'
drive_credentials = get_secret('drive_credentials_bitlogic')
# drive_credentials = get_secret('drive_credentials_%s' % CLIENT)
with open(AUTHORIZE_CREDENTIALS, 'w') as fp:
    json.dump(drive_credentials, fp)

# 2) Automatic Authentication for google drive
print('PASO 2: Autenticación con Google Drive')
gauth = GoogleAuth()
# Try to load saved client credentials
gauth.LoadCredentialsFile(AUTHORIZE_CREDENTIALS)
if gauth.credentials is None:
    # Authenticate if they're not there
    gauth.LocalWebserverAuth()
elif gauth.access_token_expired:
    # Refresh them if expired
    print ("------> Google Drive Token Expired, Refreshing")
    gauth.Refresh()
else:
    # Initialize the saved creds
    gauth.Authorize()
# Save the current credentials to a file
gauth.SaveCredentialsFile(AUTHORIZE_CREDENTIALS)
drive = GoogleDrive(gauth)

# 3) Navigation in google drive folders
print('PASO 3: Auto-iteracion en las carpetas de Google Drive')
# Auto-iterate through all folders that matches this query
drive_folder_list = drive.ListFile({'q': "'root' in parents and trashed=false"}).GetList()
folder_ID=''
client_name=''      
print('------> Accedemos al listado de clientes')
for folder in drive_folder_list:
    #print('FOLDER: %s, ID: %s' % (folder['title'], folder['id']))    
    if folder['title'] == CLIENT:
        folder_ID = folder['id']
        client_name = folder['title']    
print('------> Accedemos al folder del cliente: bitlogic')
#print('------> Accedemos al folder del cliente: %s' % client_name)

# Auto-iterate through all sub-folders that matches this query
sub_folder_List = drive.ListFile({'q': "'%s' in parents and trashed=false" % folder_ID}).GetList()
sub_folder_ID=''
ANALYTICS_FOLDER=''
ANALYTICS_MODIFY_DATE=''
for sub_folder in sub_folder_List:
    #print('CLIENT-SUB-FOLDER: %s, ID: %s' % (sub_folder['title'], sub_folder['id']))
    if sub_folder['title'] == 'Analytics':
        sub_folder_ID = sub_folder['id']
        ANALYTICS_FOLDER = sub_folder['title']
        ANALYTICS_MODIFY_DATE = sub_folder['modifiedByMeDate']      
print('------> Accedemos al sub_folder: %s' % ANALYTICS_FOLDER)  

# Auto-iterate through all files that matches this query
file_List = drive.ListFile({'q': "'%s' in parents and trashed=false" % sub_folder_ID}).GetList()
URL_NOTE_GLOBAL_POLARITY=''
URL_MESSAGES_BY_CHANNEL=''
URL_MOST_NEG_CHANNEL=''
URL_MOST_POSS_CHANNEL=''
URL_MESSAGES_BY_WEEK=''
URL_MESSAGES_LAST_7_DAYS=''
URL_MESSAGES_BY_DAY=''
URL_TOP_10_NEGATIVE=''
URL_TOP_10_POSITIVE=''
URL_TOP_10_WORDS=''
URL_TOP_5_EMOJIS=''
URL_TOP_5_REACTIONS=''
GSHEETS_NOTE_GLOBAL_POLARITY=''
GSHEETS_MESSAGES_BY_CHANNEL=''
GSHEETS_MOST_NEG_CHANNEL=''
GSHEETS_MOST_POSS_CHANNEL=''
GSHEETS_MESSAGES_BY_WEEK=''
GSHEETS_MESSAGES_LAST_7_DAYS=''
GSHEETS_MESSAGES_BY_DAY=''
GSHEETS_TOP_10_NEGATIVE=''
GSHEETS_TOP_10_POSITIVE=''
GSHEETS_TOP_10_WORDS=''
GSHEETS_TOP_5_EMOJIS=''
GSHEETS_TOP_5_REACTIONS=''
for file in file_List:
    #print('FILE: %s, ID: %s' % (file['title'], file['id']))
    #print('FILE: %s, URL: %s' % (file['title'], file['alternateLink']))
    if file['title'] == 'NOTE_GLOBAL_POLARITY':
        URL_NOTE_GLOBAL_POLARITY=file['alternateLink']
        GSHEETS_NOTE_GLOBAL_POLARITY=file['id']
    elif file['title'] == 'MESSAGES_BY_CHANNEL':
        URL_MESSAGES_BY_CHANNEL=file['alternateLink']
        GSHEETS_MESSAGES_BY_CHANNEL=file['id']
    elif file['title'] == 'MOST_NEG_CHANNEL':
        URL_MOST_NEG_CHANNEL=file['alternateLink']
        GSHEETS_MOST_NEG_CHANNEL=file['id']
    elif file['title'] == 'MOST_POSS_CHANNEL':
        URL_MOST_POSS_CHANNEL=file['alternateLink']
        GSHEETS_MOST_POSS_CHANNEL=file['id']
    elif file['title'] == 'MESSAGES_BY_WEEK':
        URL_MESSAGES_BY_WEEK=file['alternateLink']
        GSHEETS_MESSAGES_BY_WEEK=file['id']
    elif file['title'] == 'MESSAGES_LAST_7_DAYS':
        URL_MESSAGES_LAST_7_DAYS=file['alternateLink']
        GSHEETS_MESSAGES_LAST_7_DAYS=file['id']
    elif file['title'] == 'MESSAGES_BY_DAY':
        URL_MESSAGES_BY_DAY=file['alternateLink']
        GSHEETS_MESSAGES_BY_DAY=file['id']
    elif file['title'] == 'TOP_10_NEGATIVE':
        URL_TOP_10_NEGATIVE=file['alternateLink']
        GSHEETS_TOP_10_NEGATIVE=file['id']
    elif file['title'] == 'TOP_10_POSITIVE':
        URL_TOP_10_POSITIVE=file['alternateLink']
        GSHEETS_TOP_10_POSITIVE=file['id']   
    elif file['title'] == 'TOP_10_WORDS':
        URL_TOP_10_WORDS=file['alternateLink']
        GSHEETS_TOP_10_WORDS=file['id']
    elif file['title'] == 'TOP_5_EMOJIS':
        URL_TOP_5_EMOJIS=file['alternateLink']
        GSHEETS_TOP_5_EMOJIS=file['id']
    elif file['title'] == 'TOP_5_REACTIONS':
        URL_TOP_5_REACTIONS=file['alternateLink']
        GSHEETS_TOP_5_REACTIONS=file['id']

# 4) Download the dataset from the url where it is hosted
print('PASO 4: Obtenición del dataset de mensajes')
bucketName = "%s-bot" % CLIENT
# historial_de_mensajes.csv
fileName_1 = "%s_slack_historial_de_mensajes.csv" % CLIENT
s3.Bucket(bucketName).download_file(fileName_1, fileName_1) 
df_history = pd.read_csv(fileName_1, index_col=0)
# channels.csv
fileName_2 = "%s_channels.csv" % CLIENT
s3.Bucket(bucketName).download_file(fileName_2, fileName_2) 
df_channels = pd.read_csv(fileName_2)
df_channels.drop(df_channels.columns[df_channels.columns.str.contains('Unnamed',case = False)],axis = 1, inplace = True)
# merge the two dataframes to obtain the channel_name variable
df= pd.merge(df_history, df_channels, on='Channel_id')

########################################################################################################################################
#                                            PLOTTING GENERAL VISUALIZATIONS
########################################################################################################################################
# 5) Plotting
print('PASO 5: Generación de visualizaciones')
# Setting the Persistence of the plots in s3
bucketName = "%s-bot" % CLIENT

# bar_chart
print('------> 1-Plot')
channel_name=df.Channel_name
pio.templates.default = "plotly_white"
plot_1 = px.histogram(df, y=channel_name,color=channel_name,color_discrete_sequence=['#413E66'])
                      #color_discrete_sequence=px.colors.sequential.Inferno)
plot_1.update_layout(title_text='Cantidad de mensajes por canal de Slack',title_x=0.5,showlegend=False)
plot_1.update_xaxes(title_text='')
plot_1.update_yaxes(title_text='',categoryorder='total descending')
plot_1.write_image('plot_1.png')
s3.Bucket(bucketName).upload_file('plot_1.png','plots/plot_1.png') 

# pie_chart
print('------> 2-Plot')
colors = ['#413E66','purple', '#FF8000', 'orange', 'lightcoral']
channel_name=df.Channel_name
plot_2 = px.pie(df,  names=channel_name, color_discrete_sequence=colors)
plot_2.update_traces(textposition='inside', texttemplate = "%{label}<br>%{percent:%f}", hole=0.4)
plot_2.update_layout(showlegend=False,title_text='Cantidad de mensajes por canal de Slack',title_x=0.5,
    # Add annotations in the center of the donut pies.
    annotations=[dict(text='Canales', font_size=20, showarrow=False)])
plot_2.write_image('plot_2.png')
s3.Bucket(bucketName).upload_file('plot_2.png','plots/plot_2.png') 

########################################################################################################################################
#                                            PLOTTING SENTIMENT ANALYSIS
########################################################################################################################################
# Plotting Sentiment analysis of messages in English
# Polarity and subjectivity graphs will be made taking into account the translated messages, 
# since these indices are calculated from the messages in English.
print('------> 3-Plot')
translated = df[(df.translations != "A")]
plt.figure (figsize=(8,4))
plot_3 = sns.lineplot(data=translated, x='Channel_name', y='polarity', estimator=np.mean, color='#FF8000', label='Polaridad',linewidth=3)
sns.lineplot(data=translated, x='Channel_name', y='subjectivity', estimator=np.mean, color='#413E66', label='Subjetividad',linewidth=3)
plt.xticks(rotation=90)
plt.xlabel('')
plt.ylabel('')
plt.ylim(0,1)
plt.xticks(rotation=0)
sns.despine(left=True)
plt.title('Indices de sentimiento por canal de Slack')
plt.savefig('plot_3.png')
s3.Bucket(bucketName).upload_file('plot_3.png','plots/plot_3.png') 

# Plotting Sentiment analysis of messages in Spanish
print('------> 4-Plot')
colors = ['lightcoral','#413E66','#FF8000']
plot_4 = pd.crosstab(index=df['Channel_name'],columns=df['classification']).apply(lambda r: r/r.sum()*100,axis=1).plot(kind='bar',stacked=True,figsize=(8,4),color=colors)
plt.xticks(rotation=0)
sns.despine(left=True)
plt.title('Clasificación de mensajes por canal')
plt.savefig('plot_4.png')
s3.Bucket(bucketName).upload_file('plot_4.png','plots/plot_4.png') 

# Plotting Time series
indices_by_date = df.groupby('date').mean()
indices_by_date.reset_index(inplace=True)
indices_by_date[:3]

# polarity
print('------> 5-Plot')
pio.templates.default = "plotly_white"
plot_5= px.scatter(indices_by_date, x="date", y="polarity", color="polarity", range_color=[0,1], title='Variación del índice de Polaridad en el tiempo')
plot_5.update_yaxes(title_text='Indice de Polaridad',range=[-0.1, 1])
plot_5.update_xaxes(title_text='Tiempo')
plot_5.update_layout(title_x=0.5)
plot_5.write_image('plot_5.png')
s3.Bucket(bucketName).upload_file('plot_5.png','plots/plot_5.png') 

# subjectivity
print('------> 6-Plot')
pio.templates.default = "plotly_white"
plot_6= px.scatter(indices_by_date, x="date", y="subjectivity", color="subjectivity", range_color=[0,1], title='Variación del índice de Subjetividad en el tiempo')
plot_6.update_yaxes(title_text='Indice de Subjetividad',range=[-0.1, 1])
plot_6.update_xaxes(title_text='Tiempo')
plot_6.update_layout(title_x=0.5)
plot_6.write_image('plot_6.png')
s3.Bucket(bucketName).upload_file('plot_6.png','plots/plot_6.png') 

# polarity & subjectivity
print('------> 7-Plot')
important_cols = ['polarity', 'subjectivity','date']
df_dates= indices_by_date[important_cols]
t=df_dates.date
y=df_dates.polarity
y2=df_dates.subjectivity
pio.templates.default = "plotly_white"
plot_7 = go.Figure(data=go.Scatter(x=t, y=y, mode='lines', line_color='#FF8000', name='polarity'))
plot_7.add_trace(go.Scatter(x=t, y=y2, mode='lines', line=dict(color="#413E66"), name='subjectivity'))
plot_7.update_xaxes(dtick="M1", tickformat="%b\n%Y", ticklabelmode="period")
plot_7.update_layout(title='Variación mensual de los índices de sentimiento en Slack',title_x=0.5)
plot_7.write_image('plot_7.png')
s3.Bucket(bucketName).upload_file('plot_7.png','plots/plot_7.png') 

########################################################################################################################################
#                                            GETTING/PLOTTING REACTIONS & EMOJIS
########################################################################################################################################
# 6) Getting Reactions from messages
print('PASO 6: Obtención de las Reacciones de los mensajes')
df_reactions = df.dropna(subset=['reactions'])
df_reactions.reset_index(inplace=True,drop=True)

table_reactions= pd.DataFrame({'channel_name':[],'message_date':[],'index_message_date':[],'reaction': [], 'quantity': [],'polarity': [],'subjectivity': [],'classification': []})
for i, message in df_reactions.iterrows():
    channel_name = message['Channel_name']
    message_date = message['date']
    index_message_date = message['date']
    polarity = message['polarity']
    subjectivity = message['subjectivity']
    classification = message['classification']
    # pass reactions to list instead of string
    reactions = message['reactions'].replace("'", "\"")
    reactions_list = json.loads(reactions)
    for reac in reactions_list:
        reaction= reac['name']
        quantity= reac['count']
        table_reactions.loc[i]=[channel_name,message_date,index_message_date,reaction,quantity, polarity, subjectivity,classification]

# 7) Getting Emojis from messages
print('PASO 7: Obtención de los Emojis de los mensajes')
# Filtering the dataset to get only messages containing emojis
df_emojis = df[df['text'].str.contains(":[^:\s]*(?:::[^:\s]*)*:", case=False)]
# Filtering messages with web addresses
df_emojis= df_emojis.drop(df_emojis[df_emojis['text'].str.contains("://", case=False)].index)
# Split consecutive emojis in a message
for i, message in df_emojis.iterrows():
    df_emojis.loc[i,'text'] = df_emojis.loc[i,'text'].replace('::', ': :')
table_emojis= pd.DataFrame({'channel_name':[],'message_date':[],'index_message_date':[],'emoji': [],'quantity': [],'polarity': [],'subjectivity': [],'classification': []})
for i, message in df_emojis.iterrows():
    channel_name = message['Channel_name']
    message_date = message['date']
    index_message_date = message['date']
    polarity = message['polarity']
    subjectivity = message['subjectivity']
    classification = message['classification']
    # Search for messages with emojis in their text
    string= str(message['text'])
    pattern = re.compile(":[^:\s]*(?:::[^:\s]*)*:")
    result = pattern.search(string)
    emoji=result.group(0)
    # Emoji count for each message
    iterator = finditer(pattern, string)
    count = 0
    for match in iterator:
        count+=1
    count
    table_emojis.loc[i]=[channel_name,message_date,index_message_date,emoji,count, polarity, subjectivity,classification]

# Delete from the emoji name the sign of ":"
table_emojis['emoji'] = table_emojis['emoji'].map(lambda x: str(x)[1:])
table_emojis['emoji'] = table_emojis['emoji'].map(lambda x: str(x)[:-1])

# Visualizations of Reactions and Emojis
emoj=table_emojis.groupby('channel_name').count()['quantity']
react=table_reactions.groupby('channel_name').count()['quantity']
# merge the two dataframes to obtain the channel_name variable
tables= pd.merge(react, emoj, on='channel_name')
tables['index'] = tables.index
tables.columns = tables.columns.str.replace('index', 'Channel_name')

print('------> 8-Plot')
emojis=tables.quantity_x
reactions=tables.quantity_y
channel_name=tables.Channel_name
pio.templates.default = "plotly_white"
plot_8 = go.Figure()
plot_8.add_trace(go.Bar(x=channel_name,y=emojis, name='Emojis',marker_color='#413E66'))
plot_8.add_trace(go.Bar(x=channel_name,y=reactions, name='Reacciones',marker_color='#FF8000'))
plot_8.update_layout(barmode='group', xaxis_tickangle=-45, title='Cantidad de Emojis y Reaaciones utilizadas por canal de Salack')
plot_8.write_image('plot_8.png')
s3.Bucket(bucketName).upload_file('plot_8.png','plots/plot_8.png') 

# unification the name of the column to graph
table_reactions.columns = table_reactions.columns.str.replace('reaction', 'emoji')
emoj=table_emojis.groupby('emoji').count()['quantity']
react=table_reactions.groupby('emoji').count()['quantity']
# merge the two dataframes to obtain the channel_name variable
tables= pd.merge(react, emoj,how='outer', on='emoji',indicator=True)
tables['index'] = tables.index
tables.columns = tables.columns.str.replace('index', 'emoj_react')
tables['quantity_x']=tables['quantity_x'].fillna(0)
tables['quantity_y']=tables['quantity_y'].fillna(0)

print('------> 9-Plot')
emoj_react_name=tables.emoj_react
emoj=tables.quantity_y
react=tables.quantity_x
pio.templates.default = "plotly_white"
plot_9 = go.Figure()
plot_9.add_trace(go.Bar(x=emoj_react_name,y=emoj, name='Emojis',marker_color='#413E66'))
plot_9.add_trace(go.Bar(x=emoj_react_name,y=react, name='Reacciones',marker_color='#FF8000'))
plot_9.update_layout(xaxis_tickangle=-45, title='Cantidad de Emojis y Reaaciones utilizadas por canal de Salack')
plot_9.write_image('plot_9.png')
s3.Bucket(bucketName).upload_file('plot_9.png','plots/plot_9.png')

# return to the riginal name of the column
table_reactions.columns = table_reactions.columns.str.replace('emoji', 'reaction')
# name replacement to plot
table_reactions.columns = table_reactions.columns.str.replace('classification', 'Clasificación del mensaje')
table_emojis.columns = table_emojis.columns.str.replace('classification', 'Clasificación del mensaje')

print('------> 10-Plot')
pio.templates.default = "plotly_white"
x=table_reactions.channel_name
y=table_reactions.reaction
plot_10 = px.scatter(table_reactions, x=x, y=y,size="quantity", color="Clasificación del mensaje", log_x=True, size_max=20, color_discrete_sequence=["#FF8000","#413E66", "lightcoral"])
plot_10.update_layout(title='Reacciones aplicadas a mensajes según su clasificación',title_x=0.5)
plot_10.update_yaxes(title_text='')
plot_10.update_xaxes(title_text='Canales de Slack',type='category',categoryorder='total ascending')
plot_10.write_image('plot_10.png')
s3.Bucket(bucketName).upload_file('plot_10.png','plots/plot_10.png')

print('------> 11-Plot')
pio.templates.default = "plotly_white"
x=table_emojis.channel_name
y=table_emojis.emoji
plot_11 = px.scatter(table_emojis, x=x, y=y,size="quantity", color="Clasificación del mensaje", log_x=True, size_max=20, color_discrete_sequence=["#FF8000","#413E66", "lightcoral"])
plot_11.update_layout(title='Emojis en mensajes según su clasificación',title_x=0.5)
plot_11.update_yaxes(title_text='')
plot_11.update_xaxes(title_text='Canales de Slack',type='category',categoryorder='total ascending')
plot_11.write_image('plot_11.png')
s3.Bucket(bucketName).upload_file('plot_11.png','plots/plot_11.png')

# return to the riginal name of the column
table_reactions.columns = table_reactions.columns.str.replace('Clasificación del mensaje', 'classification')
table_emojis.columns = table_emojis.columns.str.replace('Clasificación del mensaje', 'classification')

print('------> 12-Plot')
colors = ['#413E66','purple', '#FF8000', 'orange', 'lightcoral']
channel_name=table_reactions.channel_name
plot_12 = px.pie(table_reactions,  names=channel_name, color_discrete_sequence=colors)
plot_12.update_traces(textposition='inside', texttemplate = "%{label}<br>%{percent:%f}", hole=0.4)
plot_12.update_layout(showlegend=False,title_x=0.5,annotations=[dict(text='Reacciones', font_size=20, showarrow=False)])
plot_12.write_image('plot_12.png')
s3.Bucket(bucketName).upload_file('plot_12.png','plots/plot_12.png')

print('------> 13-Plot')
channel_name=table_emojis.channel_name
plot_13 = px.pie(table_reactions,  names=channel_name, color_discrete_sequence=colors)
plot_13.update_traces(textposition='inside', texttemplate = "%{label}<br>%{percent:%f}", hole=0.4)
plot_13.update_layout(showlegend=False,title_x=0.5,annotations=[dict(text='Emojis', font_size=20, showarrow=False)])
plot_13.write_image('plot_13.png')
s3.Bucket(bucketName).upload_file('plot_13.png','plots/plot_13.png')

########################################################################################################################################
#                                            NLP ANALYSIS
########################################################################################################################################
# 8) Text Analysis - NLP
print('PASO 8: Análisis de textos - NLP')
# Generation of subset from original dataframe
POS = df['classification'] == 'POS'
df_POS = df[POS]
NEG = df['classification'] == 'NEG'
df_NEG = df[NEG]
# Save in a new file the column containing all the messages in spanish
df['text'].to_csv('todos_los_textos.csv', index=False)   
# Save in a new file the column containing POS messages in spanish
df_POS['text'].to_csv('todos_los_textos_POS.csv', index=False) 
# Save in a new file the column containing NEG messages in spanish
df_NEG['text'].to_csv('todos_los_textos_NEG.csv', index=False) 
# Tokenize, clean, normalize, and lemmatization
GLOBAL_list = []
with open('todos_los_textos.csv', 'r',encoding="utf8") as f:
    reader = csv.reader(f)
    GLOBAL_list = '\t'.join([i[0] for i in reader])
POS_list = []
with open('todos_los_textos_POS.csv', 'r',encoding="utf8") as f:
    reader = csv.reader(f)
    POS_list = '\t'.join([i[0] for i in reader])
NEG_list = []
with open('todos_los_textos_NEG.csv', 'r',encoding="utf8") as f:
    reader = csv.reader(f)
    NEG_list = '\t'.join([i[0] for i in reader])
nlp = spacy.load('es_core_news_sm')
# Define a function that be able to tokenize, clean and normalize
def normalize(text):
    doc = nlp(text)
    words = [t.orth_ for t in doc if not t.is_punct | t.is_stop] 
    lexical_tokens = [t.lower() for t in words if len(t) > 3 and t.isalpha()]
    return lexical_tokens
# Normalize each list of tokens
GLOBAL_tokens = normalize(GLOBAL_list)
GLOBAL_tokens_str=str(GLOBAL_tokens)
POS_tokens = normalize(POS_list)
POS_tokens_str=str(POS_tokens)
NEG_tokens = normalize(NEG_list)
NEG_tokens_str=str(NEG_tokens)
# Calculate the frequency of each token
GLOBAL_freq_clean = nltk.FreqDist(GLOBAL_tokens)
POS_freq_clean = nltk.FreqDist(POS_tokens)
NEG_freq_clean = nltk.FreqDist(NEG_tokens)
# Synonymous replacement
synonyms_list = [['texto', 'text','textoo','textos'],
                ['encuesta', 'encuestas','encuentas'],
                ['nombre_1','josé', 'jose'],
                ['nombre_2','iván', 'ivan'],
                ['nombre_3','leandro', 'lean'],
                ['nombre_4','vero', 'veronica'],
                ['nombre_5','gonzalo'],
                ['nombre_6','guille','GUILLE'],
                ['nombre_7','belu','belén','belen'],
                ['nombre_8','Emilio','Emi','emilio'],
                ['D-H','desafiando','horizontes'],
                ['pregunta', 'preguntas'],
                ['jaja', 'jajaja','jajajaj','jajaj'],
                ['invitar','invite','invítame','invitación','invitado'],
                ['decir','díganme','digan','digo'],
                ['apps','apis'],
                ['felicitaciones','hermoso','excelente','bieeeeen','felicitacioneseeeee','feliciatciones','equipazo'],
                ['daily','dailys'],
                ['traducir','traducción','translate', 'traducciones'],
                ['correlación', 'correlacionado','correlacionadas'],
                ['descargar', 'descargando','descargaron'],
                ['catedra','cátedra','cátedras','catedras'],
                ['feliz_cumpleaños','feliz cumpleaños','Feliz Cumpleaños','feliz cumple','feliz','felíz','cumple','cumpleaños']]
# Replace the synonym found by the first token of the corresponding list
GLOBAL_tokens_clean =[]
for word in GLOBAL_tokens:
    for synonyms in synonyms_list:
        for i,syn in enumerate(synonyms):
            word = word.replace(synonyms[i],synonyms[0])
    GLOBAL_tokens_clean.append(word) 

POS_tokens_clean =[]
for word in POS_tokens:
    for synonyms in synonyms_list:
        for i,syn in enumerate(synonyms):
            word = word.replace(synonyms[i],synonyms[0])
    POS_tokens_clean.append(word) 

NEG_tokens_clean =[]
for word in NEG_tokens:
    for synonyms in synonyms_list:
        for i,syn in enumerate(synonyms):
            word = word.replace(synonyms[i],synonyms[0])
    NEG_tokens_clean.append(word) 

# Realculate the frequency of each token
GLOBAL_freq_clean = nltk.FreqDist(GLOBAL_tokens_clean)
GLOBAL_tokens_clean_str=str(GLOBAL_tokens_clean)
POS_freq_clean = nltk.FreqDist(POS_tokens_clean)
POS_tokens_clean_str=str(POS_tokens_clean)
NEG_freq_clean = nltk.FreqDist(NEG_tokens_clean)
NEG_tokens_clean_str=str(NEG_tokens_clean)

# A) GLOBAL ANALYSIS
print('------> A) Análisis global')
# Set the stopwords
stopwords = set(line.strip() for line in open('todos_los_textos.csv', 'r',encoding="utf8"))
# Initializing a dictionary, for each word in the file adds a word  and if it exists increments the counter
wordcount = {}
# Remove duplicates, separate by punctuation, and use delimiters
for word in GLOBAL_tokens_clean_str.lower().split(): #lower() -> converts the text to lowercase letters
    word = word.replace(".","")
    word = word.replace(",","")
    word = word.replace(":","")
    word = word.replace("\"","")
    word = word.replace("!","")
    word = word.replace("â€œ","")
    word = word.replace("â€˜","")
    word = word.replace("*","")
    if word not in stopwords:
        if word not in wordcount:
            wordcount[word] = 1
        else:
            wordcount[word] += 1

print('------> 14-Plot')
n_print = int(10) # Print the most used words
word_counter = collections.Counter(wordcount)
# Create a dataframe with the most used words
GLOBAL = word_counter.most_common(n_print)
GLOBAL_frequency = pd.DataFrame(GLOBAL, columns = ['Word', 'Count'])
GLOBAL_frequency.plot.bar(x='Word',y='Count', color='#413E66')
wordcloud = WordCloud(max_font_size=50,max_words=100,background_color="white",colormap="Purples",).generate(GLOBAL_tokens_clean_str)
plt.figure(figsize=(12,6))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
wordcloud.to_file('plot_14.png')
s3.Bucket(bucketName).upload_file('plot_14.png','plots/plot_14.png')

# B) POSITIVE ANALYSIS
print('------> B) Análisis mensajes positivos')
# Set the stopwords
stopwords = set(line.strip() for line in open('todos_los_textos_POS.csv', 'r',encoding="utf8"))
# Initializing a dictionary, for each word in the file adds a word  and if it exists increments the counter
wordcount = {}
# Remove duplicates, separate by punctuation, and use delimiters
for word in POS_tokens_clean_str.lower().split(): #lower() -> converts the text to lowercase letters
    word = word.replace(".","")
    word = word.replace(",","")
    word = word.replace(":","")
    word = word.replace("\"","")
    word = word.replace("!","")
    word = word.replace("â€œ","")
    word = word.replace("â€˜","")
    word = word.replace("*","")
    if word not in stopwords:
        if word not in wordcount:
            wordcount[word] = 1
        else:
            wordcount[word] += 1

print('------> 15-Plot')
n_print = int(10) # Print the most used words
word_counter = collections.Counter(wordcount)
# Create a dataframe with the most used words
POS = word_counter.most_common(n_print)
POS_frequency = pd.DataFrame(POS, columns = ['Word', 'Count'])
POS_frequency.plot.bar(x='Word',y='Count', color='#413E66')
wordcloud = WordCloud(max_font_size=50, max_words=100, background_color="white",colormap="Purples",).generate(POS_tokens_clean_str)
plt.figure(figsize=(12,6))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
wordcloud.to_file('plot_15.png')
s3.Bucket(bucketName).upload_file('plot_15.png','plots/plot_15.png')

# C) NEGATIVE ANALYSIS
print('------> C) Análisis mensajes negativos')
# Set the stopwords
stopwords = set(line.strip() for line in open('todos_los_textos_NEG.csv', 'r',encoding="utf8"))
# Initializing a dictionary, for each word in the file adds a word  and if it exists increments the counter
wordcount = {}
# Remove duplicates, separate by punctuation, and use delimiters
for word in NEG_tokens_clean_str.lower().split(): #lower() -> converts the text to lowercase letters
    word = word.replace(".","")
    word = word.replace(",","")
    word = word.replace(":","")
    word = word.replace("\"","")
    word = word.replace("!","")
    word = word.replace("â€œ","")
    word = word.replace("â€˜","")
    word = word.replace("*","")
    if word not in stopwords:
        if word not in wordcount:
            wordcount[word] = 1
        else:
            wordcount[word] += 1

print('------> 16-Plot')
n_print = int(10)# Print the most used words
word_counter = collections.Counter(wordcount)
# Create a dataframe with the most used words
NEG = word_counter.most_common(n_print)
NEG_frequency = pd.DataFrame(NEG, columns = ['Word', 'Count'])
NEG_frequency.plot.bar(x='Word',y='Count', color='#413E66')
wordcloud = WordCloud(max_font_size=50, max_words=100, background_color="white",colormap="Purples",).generate(NEG_tokens_clean_str)
plt.figure(figsize=(12,6))
plt.imshow(wordcloud, interpolation="bilinear")
plt.axis("off")
wordcloud.to_file('plot_16.png')
s3.Bucket(bucketName).upload_file('plot_16.png','plots/plot_16.png')

########################################################################################################################################
#                                            GOOGLE SHEETS INTEGRATION
########################################################################################################################################
# 9) Integration to Google Sheets
print('PASO 9: Integrando resultados en google-sheets')
# BEFORE INTEGRATION TO GOOGLE SHEETS:   
# * Find the  client_email inside credentials.json.      
# * Back in your spreadsheet, click the Share button in the top right, and paste the client email into the People field to give it edit rights. Hit Send.     
# * For any doubt, read here: https://www.twilio.com/blog/2017/02/an-easy-way-to-read-and-write-to-a-google-spreadsheet-in-python.html

# set environment variables for googlesheet integration
# we used to take folders variables from environment. now we get them from browsing google drive folders.
#ANALYTICS_FOLDER = os.environ['ANALYTICS_FOLDER']

# 1-File: MESSAGES_BY_DAY
print('------> 1-File: MESSAGES_BY_DAY')
df_by_days = pd.crosstab(df.date, df.classification)
df_by_days['NEG'] = df_by_days['NEG'].astype(np.float64)
df_by_days['NEU'] = df_by_days['NEU'].astype(np.float64)
df_by_days['POS'] = df_by_days['POS'].astype(np.float64)
df_by_days.reset_index(inplace=True)

scopes = [URL_MESSAGES_BY_DAY, ANALYTICS_FOLDER] 
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_MESSAGES_BY_DAY) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = df_by_days
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 2-File: MESSAGES_LAST_7_DAYS
print('------> 2-File: MESSAGES_LAST_7_DAYS')
df_last_7_days = df_by_days.tail(7)

scopes = [URL_MESSAGES_LAST_7_DAYS, ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_MESSAGES_LAST_7_DAYS) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = df_last_7_days
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 3-File: MESSAGES_BY_WEEK
print('------> 3-File: MESSAGES_BY_WEEK')
df_by_days['date'] =  df_by_days['date'].apply(pd.to_datetime)
df_by_days["week"] = df_by_days.date.dt.isocalendar().week.astype(str)
df_by_days["year"] = df_by_days.date.dt.isocalendar().year.astype(str)

df_by_week= df_by_days.groupby(['week','year'])[['NEG','NEU','POS']].sum()
df_by_week.reset_index(inplace=True)
df_by_week['year_week']= df_by_week['year']+'-'+df_by_week['week']
df_by_week.sort_values('year_week', inplace=True)
df_by_week['NEG'] = df_by_week['NEG'].astype(np.float64)
df_by_week['NEU'] = df_by_week['NEU'].astype(np.float64)
df_by_week['POS'] = df_by_week['POS'].astype(np.float64)
df_by_week.reset_index(inplace=True)

scopes = [URL_MESSAGES_BY_WEEK,ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS)
sh = gc.open_by_key(GSHEETS_MESSAGES_BY_WEEK) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet, 1 - second sheet etc. 
your_dataframe = df_by_week
set_with_dataframe(worksheet, your_dataframe) #-> THIS EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 4-5-File: MOST_POSS_CHANNEL & MOST_NEG_CHANNEL
class_by_channel = pd.crosstab(df.Channel_name, df.classification)
class_by_channel=class_by_channel.apply(lambda r: r/r.sum()*100,axis=1).round(1)
class_by_channel
POS=class_by_channel.sort_values("POS").tail(1)
POS=POS[['POS']]
NEG=class_by_channel.sort_values("NEG").tail(1)
NEG=NEG[['NEG']]
class_by_channel['NEG'] = class_by_channel['NEG'].astype(np.float64)
class_by_channel['NEU'] = class_by_channel['NEU'].astype(np.float64)
class_by_channel['POS'] = class_by_channel['POS'].astype(np.float64)
POS.reset_index(inplace=True)
NEG.reset_index(inplace=True)

# positives
print('------> 4-File: MOST_POSS_CHANNE')
scopes = [URL_MOST_POSS_CHANNEL, ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_MOST_POSS_CHANNEL) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = POS
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# negatives
print('------> 5-File: MOST_NEG_CHANNE')
scopes = [URL_MOST_NEG_CHANNEL, ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_MOST_NEG_CHANNEL) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = NEG
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 6-File: MESSAGES_BY_CHANNEL
print('------> 6-File: MESSAGES_BY_CHANNEL')
dummy=pd.get_dummies(df['classification'])
df_dummy = pd.concat([df,dummy],axis=1)
df_by_channels = df_dummy.groupby(['Channel_name']).mean()
important_cols= ['NEG','NEU','POS']
df_by_channels=df_by_channels[important_cols]
df_by_channels['index'] = df_by_channels.index
df_by_channels.columns = df_by_channels.columns.str.replace('index', 'Channel_name')

scopes = [URL_MESSAGES_BY_CHANNEL, ANALYTICS_FOLDER ]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_MESSAGES_BY_CHANNEL) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = df_by_channels
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 7-File: NOTE_GLOBAL_POLARITY
print('------> 7-File: NOTE_GLOBAL_POLARITY')
index_polarity=translated['polarity'].mean().round(2)
index_subjectivity=translated['subjectivity'].mean().round(2)
global_indices = pd.DataFrame({'polarity': [index_polarity],'subjectivity': [index_subjectivity]})

scopes = [URL_NOTE_GLOBAL_POLARITY, ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_NOTE_GLOBAL_POLARITY) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet, 1 
your_dataframe = global_indices
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 8-File: TOP_5_REACTIONS
print('------> 8-File: TOP_5_REACTIONS')
important_cols= ['channel_name','reaction','quantity']
new_react=table_reactions[important_cols]
df_by_rections = new_react.groupby(['reaction']).sum()
top_5= df_by_rections.sort_values(by=['quantity'], ascending=False)
dummy=pd.get_dummies(new_react['reaction'])
df_dummy_reactions = pd.concat([new_react,dummy],axis=1)
# Select the first 5 columns with the most used reactions
for column in df_dummy_reactions:
    list_columns= list(df_dummy_reactions)
first_col = list_columns[3]
second_col = list_columns[4]
third_col = list_columns[5]
quarter_col = list_columns[6]
fifth_col = list_columns[7]
important_cols = [first_col,second_col,third_col,quarter_col,fifth_col,'channel_name']
df_dummy_5 = df_dummy_reactions[important_cols]
df_by_rections = df_dummy_5.groupby(['channel_name']).sum()
df_by_rections['index'] = df_by_rections.index
df_by_rections.columns = df_by_rections.columns.str.replace('index', 'channel_name')

# add ' so google sheet does not interpret as numeric data
for column in df_by_rections:
    actual_name = column
    new_name = ("'"+column)
    df_by_rections = df_by_rections.rename(columns={actual_name:new_name})
df_by_rections = df_by_rections.rename(columns={"'channel_name":'channel_name'})

scopes = [URL_TOP_5_REACTIONS,ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_TOP_5_REACTIONS) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet 
your_dataframe = df_by_rections
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 9-File: TOP_5_EMOJIS
print('------> 9-File: TOP_5_EMOJIS')
important_cols= ['channel_name','emoji','quantity']
new_emo=table_emojis[important_cols]
df_by_emoji = new_emo.groupby(['emoji']).sum()
top_5= df_by_emoji.sort_values(by=['quantity'], ascending=False)
dummy=pd.get_dummies(new_emo['emoji'])
df_dummy_emoji = pd.concat([new_emo,dummy],axis=1)
# Select the first 5 columns with the most used reactions
for column in df_dummy_emoji:
    list_columns= list(df_dummy_emoji)
first_col = list_columns[3]
second_col = list_columns[4]
third_col = list_columns[5]
quarter_col = list_columns[6]
fifth_col = list_columns[7]
important_cols = [first_col,second_col,third_col,quarter_col,fifth_col,'channel_name']
df_dummy_5 = df_dummy_emoji[important_cols]
df_by_emojis = df_dummy_5.groupby(['channel_name']).sum()
df_by_emojis['index'] = df_by_emojis.index
df_by_emojis.columns = df_by_emojis.columns.str.replace('index', 'channel_name')

# add ' so google sheet does not interpret as numeric data
for column in df_by_emojis:
    actual_name = column
    new_name = ("'"+column)
    df_by_emojis = df_by_emojis.rename(columns={actual_name:new_name})
df_by_emojis = df_by_emojis.rename(columns={"'channel_name":'channel_name'})

scopes = [URL_TOP_5_EMOJIS, ANALYTICS_FOLDER ]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_TOP_5_EMOJIS) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet 
your_dataframe = df_by_emojis
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 10-File: TOP_10_WORDS
print('------> 10-File: TOP_10_WORDS')
scopes = [URL_TOP_10_WORDS , ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_TOP_10_WORDS) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = GLOBAL_frequency
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 11-File: TOP_10_POSITIVE
print('------> 11-File: TOP_10_POSITIVE')
scopes = [URL_TOP_10_POSITIVE, ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS)
sh = gc.open_by_key(GSHEETS_TOP_10_POSITIVE) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet 
your_dataframe = POS_frequency
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 12-File: TOP_10_NEGATIVE
print('------> 12-File: TOP_10_NEGATIVE')
scopes = [URL_TOP_10_NEGATIVE,ANALYTICS_FOLDER]
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS)
sh = gc.open_by_key(GSHEETS_TOP_10_NEGATIVE) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = NEG_frequency
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

print('----------------------------------------------------')
print("FIN DEL PROCESO") 
print('----------------------------------------------------')