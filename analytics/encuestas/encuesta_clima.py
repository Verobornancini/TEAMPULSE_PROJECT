# ENCUESTA - Clima Laboral

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
import urllib.request

# from secret_manager.py
from secret_manager import get_secret

# Reading in environment variables from an environment file
print('--------------------------------------------------------')
print('Inicia el proceso: Análisis de encuesta de Clima Laboral')
print('--------------------------------------------------------')
# 1) Reading environment variables:
print('PASO 1: Cargamos las variables de entorno')
# from the environment 
CLIENT = os.getenv('CLIENT_NAME')
print('------> CLIENTE:', CLIENT)
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
# Create s3 object (This is how we access non public buckets and objets, i.e. files)
s3 = boto3.resource('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
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
ENCUESTA_DE_CLIMA_FOLDER=''
ENCUESTA_DE_CLIMA_FOLDER_MODIFY_DATE=''
for sub_folder in sub_folder_List:
    #print('CLIENT-SUB-FOLDER: %s, ID: %s' % (sub_folder['title'], sub_folder['id']))
    if sub_folder['title'] == 'Encuesta_de_Clima':
        sub_folder_ID = sub_folder['id']
        ENCUESTA_DE_CLIMA_FOLDER = sub_folder['title']
        ENCUESTA_DE_CLIMA_FOLDER_MODIFY_DATE = sub_folder['modifiedByMeDate']     
print('------> Accedemos al sub_folder: %s' % ENCUESTA_DE_CLIMA_FOLDER)
# Auto-iterate through all files that matches this query
file_List = drive.ListFile({'q': "'%s' in parents and trashed=false" % sub_folder_ID}).GetList()
URL_ENCUESTA_CLIMA_COMPLETA=''
URL_FACTORES_DH=''
URL_CLIMA_CANTIDAD_RESPUESTAS=''
GSHEETS_CLIMA_COMPLETA=''
GSHEETS_FACTORES_DH=''
GSHEETS_CLIMA_CANTIDAD_RESPUESTAS=''
ENCUESTAS_INDIVIDUALES_FOLDER=''
for file in file_List:
    #print('FILE: %s, ID: %s' % (file['title'], file['id']))
    #print('FILE: %s, URL: %s' % (file['title'], file['alternateLink']))
    if file['title'] == 'ENCUESTA_CLIMA_COMPLETA':
        URL_ENCUESTA_CLIMA_COMPLETA=file['alternateLink']
        GSHEETS_ENCUESTA_CLIMA_COMPLETA=file['id']
    elif file['title'] == 'FACTORES_DH':
        URL_FACTORES_DH=file['alternateLink']
        GSHEETS_FACTORES_DH=file['id']
    elif file['title'] == 'CLIMA_CANTIDAD_RESPUESTAS':
        URL_CLIMA_CANTIDAD_RESPUESTAS=file['alternateLink']
        GSHEETS_CLIMA_CANTIDAD_RESPUESTAS=file['id']
    elif file['title'] == 'Encuestas_individuales':
        ENCUESTAS_INDIVIDUALES_FOLDER=file['id']
        
# set future list to open survey's files
ENCUESTAS_CLIMA= []
# Auto-iterate through all second_sub_folders that matches this query
second_sub_folder_List = drive.ListFile({'q': "'%s' in parents and trashed=false" % ENCUESTAS_INDIVIDUALES_FOLDER}).GetList()
for second_sub_folder in second_sub_folder_List:
    print('- %s, ID: %s' % (second_sub_folder['title'],second_sub_folder['id']))
    ENCUESTAS_CLIMA.append(second_sub_folder['title'])

# 4) Google Drive Authentication
print ('PASO 4: Conexión con Google Drive para leer el contenido de las encuestas')
scopes = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name(CREDENTIALS, scopes) 
gc = gspread.authorize(credentials)

# 5) Sort data
print ('PASO 5: Obtención de tabla de referencia de Factores_DH')
wks = gc.open('FACTORES_DH').sheet1 # sheet´s name
data = wks.get_all_values()
headers = data.pop(0)
df_factores = pd.DataFrame(data, columns=headers)

# 6) get data from surveys
print ('PASO 6: Obtención de datos de las Encuestas')
# set the new dataframes for add the clean data
df_edit = pd.DataFrame({'encuesta':[],'pregunta':[],'respuesta':[],'factor': [],'subfactor': [],'indicador': [],'mail':[],'datetime':[],'token':[]})
df_interaccion = pd.DataFrame({'encuesta':[],'cantidad_respuestas':[]})
count = 0

for encuesta in ENCUESTAS_CLIMA:
    print('------> Accedemos a la: ',encuesta)
    # survey opening
    wks = gc.open(encuesta).sheet1 # sheet´s name
    data = wks.get_all_values()
    headers = data.pop(0)
    # save the data into a pandas dataframe
    df = pd.DataFrame(data, columns=headers)
    print ('- Total de respuestas:', len(df))
    df_interaccion.loc[encuesta,'encuesta'] = encuesta
    df_interaccion.loc[encuesta,'cantidad_respuestas'] = len(df)
    # get list of important columns (questions)
    questions = list(df.columns.values)
    questions.remove('mail') 
    questions.remove('Submitted At') 
    questions.remove('Token')
    print ('- Total de preguntas:', len(questions))
    # iterate the list of questions
    for question in questions:
        # iterate the list of responses
        for row_index, row in df.iterrows():
            response = row[question]
            qa_match = False
            # itrate the df_factores dataframe for ensamble data
            for ensamble_index, ensamble in df_factores.iterrows():
                pregunta = ensamble['pregunta']
                respuesta = ensamble['respuesta']
                if question == pregunta and response == respuesta:
                    if qa_match == True: # to validate if a match already exists
                        print ('- AVISO ! Los siguientes datos están duplicadas en el sheet Factores_DH')
                        print ('- En la encuesta: ', encuesta)
                        print ('-- La pregunta:', pregunta)
                        print ('-- La respuesta:', respuesta)
                    else:
                        count = count + 1
                        qa_match = True
                        # save the data in the nwe dataframe
                        df_edit.loc[count,'encuesta'] = encuesta
                        df_edit.loc[count,'pregunta'] = pregunta
                        df_edit.loc[count,'respuesta'] = respuesta
                        df_edit.loc[count,'factor'] = ensamble['factor']
                        df_edit.loc[count,'subfactor'] = ensamble['subfactor']
                        df_edit.loc[count,'indicador'] = ensamble['indicador']
                        df_edit.loc[count,'mail'] = df.loc[row_index,'mail']
                        df_edit.loc[count,'datetime'] = df.loc[row_index,'Submitted At']
                        df_edit.loc[count,'token'] = df.loc[row_index,'Token']
            if qa_match == False: # to validate if data is in Factores_DH
                print ('- AVISO ! Los siguientes datos No se encuentran en el sheet Factores_DH')
                print ('- En la encuesta: ', encuesta)
                print ('-- La pregunta:', question)
                print ('-- La respuesta:', response)
print ('------> Exportamos los datos al nuevo dataframe')              
print ('- Cantidad de preguntas respondidas:', len(df_edit))

# 7) Data transformation
print ('PASO 7: Transformación de datos (fechas)')
# add new columns
df_edit['date'] =''
df_edit['time']=''
df_edit['year'] =''
df_edit['month'] =''
df_edit['week'] =''
df_edit['indicador_relativo']=''
# datetime manipulation
df_edit['datetime'] = pd.to_datetime(df_edit['datetime'], format="%d/%m/%Y %H:%M:%S")
df_edit['date'] = [d.date() for d in df_edit['datetime']]
df_edit['time'] = [d.time() for d in df_edit['datetime']]
df_edit['year'] = df_edit.datetime.dt.isocalendar().year.astype(int)
df_edit['month'] = df_edit['datetime'].dt.month.astype(int)
df_edit["week"] = df_edit.datetime.dt.isocalendar().week.astype(int)
df_edit.reset_index(inplace=True,drop=True)
# relative indicators
df_edit['indicador']=df_edit['indicador'].astype(int)
df_edit['indicador_relativo']=(df_edit['indicador']*100/6).round(0).astype(int)

# 8) Get employee information
print ('PASO 8: Obtención de datos de la tabla de empleados')
URL_EMPLOYEE = (REACT_APP_SERVER_URL + 'employee')

with urllib.request.urlopen(URL_EMPLOYEE) as url:
    data = json.loads(url.read().decode())
    elevations = json.dumps(data)
    df_empleados = pd.read_json(elevations)
df_empleados
df_empleados = df_empleados.rename(columns={'email':'mail'})

# 9) Merge tables
print('PASO 9: Merge resultados de encuesta y tabla de empleados')
df = pd.merge(df_edit, df_empleados, how="left", on=["mail"])

# 10) Integration to Google Sheets
print('PASO 10: Integrando resultados en google-sheets')
# 1-File: ENCUESTA_CLIMA_COMPLETA
print('------> 1-File: ENCUESTA_CLIMA_COMPLETA')
scopes = [URL_ENCUESTA_CLIMA_COMPLETA, ENCUESTA_DE_CLIMA_FOLDER] 
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_ENCUESTA_CLIMA_COMPLETA) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = df
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 2-File: CLIMA_CANTIDAD_RESPUESTAS
print('------> 2-File: CLIMA_CANTIDAD_RESPUESTAS')
df_interaccion.reset_index(inplace=True,drop=True)
scopes = [URL_CLIMA_CANTIDAD_RESPUESTAS, ENCUESTA_DE_CLIMA_FOLDER] 
credentials = Credentials.from_service_account_info(service_account_info, scopes=scopes)
gc = gspread.authorize(credentials)
gc = gspread.service_account(filename=CREDENTIALS) 
sh = gc.open_by_key(GSHEETS_CLIMA_CANTIDAD_RESPUESTAS) #your_google_sheet_ID
worksheet = sh.get_worksheet(0) #-> 0 - first sheet
your_dataframe = df_interaccion
set_with_dataframe(worksheet, your_dataframe) # EXPORTS YOUR DATAFRAME TO THE GOOGLE SHEET

# 11) Plotting
bucketName = "%s-bot" % CLIENT

print('PASO 11: Generando visualizaciones')
print('------> 1-Plot')
colors = ['#413E66', '#FF8000', 'orange', 'lightcoral']
encuestas = df.encuesta
plot_1 = px.pie(df,  names=encuestas, color_discrete_sequence=colors)
plot_1.update_traces(textposition='inside', texttemplate = "%{label}<br>%{percent:%f}", hole=0.4)
plot_1.update_layout(showlegend=False,title_text='Cantidad de respuestas por encuestas',title_x=0.5,
    annotations=[dict(text='Encuestas', font_size=20, showarrow=False)])
plot_1.write_image('plot_Enc_1.png')
s3.Bucket(bucketName).upload_file('plot_Enc_1.png','plots_enc_clima/plot_Enc_1.png') 

print('------> 2-Plot')
colors = [ 'lightcoral','purple','#413E66','#FF8000','orange']
pio.templates.default = "plotly_white"
factor = df.factor
plot_2 = px.histogram(df, y=factor,color=factor,color_discrete_sequence=colors)
plot_2.update_layout(title_text='Cantidad de respuestas que aportan a la contrucción de los factores',title_x=0.5,showlegend=False)
plot_2.update_xaxes(title_text='')
plot_2.update_yaxes(title_text='',categoryorder='total descending')
plot_2.write_image('plot_Enc_2.png')
s3.Bucket(bucketName).upload_file('plot_Enc_2.png','plots_enc_clima/plot_Enc_2.png') 

print('------> 3-Plot')
colors = ['orange','lightcoral','#413E66','#FF8000','purple']
pd.crosstab(index=df['encuesta'],columns=df['factor']).apply(lambda r: r/r.sum()*100,axis=1).plot(kind='bar', stacked=True, figsize=(10,6),color=colors)
plt.title('Medición de factores por encuesta')
plt.xticks(rotation=0)
sns.despine(left=True)
plt.savefig('plot_Enc_3.png')
s3.Bucket(bucketName).upload_file('plot_Enc_3.png','plots_enc_clima/plot_Enc_3.png') 

print('------> 4-Plot')
df_factor = df.groupby(["factor", "month"]).mean().round().astype(int).reset_index() 

plot_4 = px.line(df_factor, x="month", y="indicador_relativo", color='factor')
plot_4.update_xaxes(type='category')
plot_4.update_xaxes(title_text='Meses')
plot_4.update_yaxes(title_text='Indicador', range=[0, 100])
plot_4.write_image('plot_Enc_4.png')
s3.Bucket(bucketName).upload_file('plot_Enc_4.png','plots_enc_clima/plot_Enc_4.png') 

print('------> 5-Plot')
df_ITP = df_factor.groupby("month").mean().round().astype(int).reset_index() 
df_ITP = df_ITP.rename(columns={'indicador_relativo':'ITP'})

t=df_ITP.month
y=df_ITP.ITP
pio.templates.default = "plotly_white"
plot_5 = go.Figure(data=go.Scatter(x=t,y=y,mode='lines',line_color='#FF8000',name='ITP'))
plot_5.update_layout(title='Variación mensual del ITP',title_x=0.5)
plot_5.update_xaxes(type='category')
plot_5.update_xaxes(title_text='Meses')
plot_5.update_yaxes(title_text='Indicador', range=[0, 100])
plot_5.write_image('plot_Enc_5.png')
s3.Bucket(bucketName).upload_file('plot_Enc_5.png','plots_enc_clima/plot_Enc_5.png') 