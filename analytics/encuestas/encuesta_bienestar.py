# ENCUESTA - Estado de Bienestar

# Import necessary libraries
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import warnings
import json
import gspread
from gspread_dataframe import set_with_dataframe
from google.oauth2.service_account import Credentials
from oauth2client.service_account import ServiceAccountCredentials
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.io as pio
import os
from dotenv import load_dotenv
from pathlib import Path 
import base64
import boto3
from botocore.exceptions import ClientError
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive 

# from secret_manager.py
from secret_manager import get_secret

# Reading in environment variables from an environment file
print('----------------------------------------------------')
print('Inicia el proceso: Análisis de encuesta de Bienestar')
print('----------------------------------------------------')
# 1) Reading environment variables
print('PASO 1: Cargamos las variables de entorno')
# from the environment 
CLIENT = os.getenv('CLIENT_NAME')
print('------> CLIENTE: ',CLIENT)
# from .json file created whith Secrets Manager client for google credentials
CREDENTIALS = 'credentials.json'
service_account_info = get_secret('google_%s' % CLIENT)
with open(CREDENTIALS, 'w') as fp:
    json.dump(service_account_info, fp)
# from .json file created whith Secrets Manager client for Google client_secrets / ID Oauth Client
GOOGLE_DRIVE= 'client_secrets.json'
drive_account_info = get_secret('drive_%s' % CLIENT)
with open(GOOGLE_DRIVE, 'w') as fp:
    tu_dict = drive_account_info
    web_dict = {"web": tu_dict} 
    json.dump(web_dict, fp) 
# from .txt file created whith Secrets Manager client for Google client_secrets / ID Oauth Client
AUTHORIZE_CREDENTIALS= 'GoogleDriveCredentials.txt'
drive_credentials = get_secret('drive_credentials_%s' % CLIENT)
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
print('------> Accedemos al folder del cliente: %s' % client_name)
# Auto-iterate through all sub-folders that matches this query
sub_folder_List = drive.ListFile({'q': "'%s' in parents and trashed=false" % folder_ID}).GetList()
sub_folder_ID=''
ENCUESTA_DE_BIENESTAR_FOLDER=''
ENCUESTA_DE_BIENESTAR_FOLDER_MODIFY_DATE=''
for sub_folder in sub_folder_List:
    #print('CLIENT-SUB-FOLDER: %s, ID: %s' % (sub_folder['title'], sub_folder['id']))
    if sub_folder['title'] == 'Encuesta_de_Bienestar':
        sub_folder_ID = sub_folder['id']
        ENCUESTA_DE_BIENESTAR_FOLDER = sub_folder['title']
        ENCUESTA_DE_BIENESTAR_FOLDER_MODIFY_DATE = sub_folder['modifiedByMeDate']     
print('------> Accedemos al sub_folder: %s' % ENCUESTA_DE_BIENESTAR_FOLDER)
# Auto-iterate through all files that matches this query
file_List = drive.ListFile({'q': "'%s' in parents and trashed=false" % sub_folder_ID}).GetList()
URL_ENCUESTA_BIENESTAR=''
URL_INDICES_BIENESTAR=''
GSHEETS_INDICES_BIENESTAR=''
for file in file_List:
    #print('FILE: %s, ID: %s' % (file['title'], file['id']))
    #print('FILE: %s, URL: %s' % (file['title'], file['alternateLink']))
    if file['title'] == 'ENCUESTA_BIENESTAR':
        URL_ENCUESTA_BIENESTAR=file['alternateLink']
    elif file['title'] == 'INDICES_BIENESTAR':
        URL_INDICES_BIENESTAR=file['alternateLink']
        GSHEETS_INDICES_BIENESTAR=file['id']

# 4) Reading google sheets Into a Pandas Dataframe
print('PASO 4: Otenemos las respuestas de la encuesta')
scopes = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name(CREDENTIALS, scopes) 
gc = gspread.authorize(credentials)
wks = gc.open("ENCUESTA_BIENESTAR").sheet1 # sheet´s name
data = wks.get_all_values()
headers = data.pop(0)
df = pd.DataFrame(data, columns=headers)

df.drop(['Token'], axis='columns', inplace=True)
# Reassignment of variable names
df = df.rename(columns={'¿Cómo me siento en relación al trabajo?':'sentir',
                        '¿Qué hago en mis tiempos libres?':'hacer',
                        '¿Qué pienso de mi situación actual?':'pensar',
                        'Submitted At':'date'})

# Change datetime format
df['date'] = pd.to_datetime(df['date'], format="%d/%m/%Y %H:%M:%S")

# Replace values
df['sentir'] = df['sentir'].replace('Energizado/a',1)
df['sentir'] = df['sentir'].replace('Capaz de afrontar los desafíos cotidianos',1)
df['sentir'] = df['sentir'].replace('Conforme con mi situación actual',1)
df['sentir'] = df['sentir'].replace('Motivado/a a seguir creciendo',1)

df['sentir'] = df['sentir'].replace('Inseguro/a en algunas situaciones',0.5)
df['sentir'] = df['sentir'].replace('Incapaz de poner un límite al horario laboral',0.5)
df['sentir'] = df['sentir'].replace('Afectado/a por los altibajos diarios',0.5)
df['sentir'] = df['sentir'].replace('Con poca energía para llevar a cabo mis actividades',0.5)

df['sentir'] = df['sentir'].replace('Apático/a a realizar las actividades diarias',0)
df['sentir'] = df['sentir'].replace('Abrumado/a',0)
df['sentir'] = df['sentir'].replace('Fatigado/a',0)
df['sentir'] = df['sentir'].replace('Estresado/a',0)

df['hacer'] = df['hacer'].replace('Paso tiempo con mis amigos y familia',1)
df['hacer'] = df['hacer'].replace('Participo en actividades y pasatiempos no relacionados al trabajo',1)
df['hacer'] = df['hacer'].replace('Invierto en mi desarrollo personal y en mejorar mis habilidades',1)
df['hacer'] = df['hacer'].replace('Descanso',1)

df['hacer'] = df['hacer'].replace('Busco apoyo en los demás cuando es necesario',0.5)
df['hacer'] = df['hacer'].replace('A veces tengo pasatiempos no relacionados al trabajo',0.5)
df['hacer'] = df['hacer'].replace('Pienso en los problemas del trabajo',0.5)
df['hacer'] = df['hacer'].replace('Priorizo el trabajo antes que otras cosas',0.5)

df['hacer'] = df['hacer'].replace('Nunca tengo un pasatiempo o actividad que no esté relacionada al trabajo',0)
df['hacer'] = df['hacer'].replace('Evito los entornos sociales',0)
df['hacer'] = df['hacer'].replace('Me aíslo de los demás',0)
df['hacer'] = df['hacer'].replace('No quiero hablar del trabajo',0)

df['pensar'] = df['pensar'].replace('Puedo asumir los desafíos del futuro',1)
df['pensar'] = df['pensar'].replace('Me siento cómodo/a tomando decisiones profesionales que pueden afectar mi futuro',1)
df['pensar'] = df['pensar'].replace('Me siento cómodo/a al pedir consejo cuando me enfrento con un desafío difícil',1)

df['pensar'] = df['pensar'].replace('A veces tengo miedo del futuro',0.5)
df['pensar'] = df['pensar'].replace('Tengo cada vez menos tiempo para actividades fuera del trabajo',0.5)
df['pensar'] = df['pensar'].replace('Me cuesta encontrar personas que realmente me entiendan',0.5)

df['pensar'] = df['pensar'].replace('Nadie me puede ayudar',0)
df['pensar'] = df['pensar'].replace('Nadie entiende por lo que estoy pasando',0)
df['pensar'] = df['pensar'].replace('No puedo hacer tareas sencillas',0)

df['week'] = df['date'].dt.strftime('%U')
df['month'] = df['date'].dt.strftime('%M')

df=df[['sentir', 'hacer','pensar','month','week']].astype(float)

indices_by_month = df.groupby('month').mean()
indices_by_month.reset_index(inplace=True)

# 5) Integration to Google Sheets:INDICES_BIENESTAR</span>
print('PASO 5: Integrando resultados en google-sheets')
scopes = [URL_INDICES_BIENESTAR, ENCUESTA_DE_BIENESTAR_FOLDER]
credentials = Credentials.from_service_account_file(CREDENTIALS, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS)
sh = gc.open_by_key(GSHEETS_INDICES_BIENESTAR) 
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = indices_by_month
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET
print('------> 1-File: INDICES_BIENESTAR')
print('----------------------------------------------------')
print('Fin del Análisis')
print('----------------------------------------------------')