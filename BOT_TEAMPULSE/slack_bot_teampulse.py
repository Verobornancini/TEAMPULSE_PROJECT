# Api Slack  
# Con: Python usando Slack Events-API
# No utilizaremos RTM ya que es una api deprecada, en su lugar usaremos Events-API

# SLACKBOT para la descarga de mensajes de canales públicos de slack
# El bot debe ser invitado a los canales públicos: /invite @BOT_NAME

# Importamos librerías necesarias
from slackeventsapi import SlackEventAdapter
from slack import WebClient
from datetime import datetime
from pathlib import Path
import pandas as pd
import numpy as np
import json

# Definimos como variables de entorno nuestras claves o Tokens
# En el archivo secrets.json los token deben venir siempre informados en el mismo orden
# SLACK_SIGNING_SECRET, SLACK_BOT_TOKEN, VERIFICATION_TOKEN
f1 = open("secrets.json") 
document = json.load(f1) 
pairs = document.items()

temporal_list = []

for key, value in pairs:
    temporal_list.append(value)

SLACK_SIGNING_SECRET= temporal_list[0]
SLACK_BOT_TOKEN = temporal_list[1]
VERIFICATION_TOKEN = temporal_list[2]

# Creamos una instancia de slack client
slack_client = WebClient(SLACK_BOT_TOKEN)
            
# Verificamos si tenemos un archivo "channels.csv" sino lo creamos
fileName = r"channels.csv"
fileObj = Path(fileName)
fileExists = fileObj.is_file() # devuelve un booleano

if fileExists is True:
    # Abrimos el archivo 
    df_channels = pd.read_csv("channels.csv", index_col=['id'])
else:
    # Declaramos un dataframe vacío
    df_channels = pd.DataFrame(columns = ('id','name','num_members','latest'))
    # Lo guardamos como un archivo .csv
    df_channels.drop(df_channels.columns[df_channels.columns.str.contains('Unnamed',case = False)],axis = 1, inplace = True)
    df_channels.to_csv('channels.csv', sep = ',')
    # Abrimos el archivo 
    df_channels = pd.read_csv("channels.csv",index_col=['id'])
    
# Obtenemos la lista de canales
channels_history = slack_client.conversations_list(token = SLACK_BOT_TOKEN)  
channels = channels_history.get("channels")
            
# Recorremos la lista de canales y Seteamos los parámetros para cada canal público
for channel in channels:
    # Chequeamos si el bot es un miembro del canal, si no lo es continuamos con el canal siguiente
    if channel.get("is_member")==False:
        continue

    channel_id = channel.get("id")
    channel_name = channel.get("name")
    channel_num_members = channel.get("num_members")
    message_list =[]
    has_more = True
    cursor = None
    limit = 100
    current_time = datetime.now()
    latest = datetime.timestamp(current_time)
    oldest = 0

    # Revisamos si el canal que estoy recorriendo existe en el archivo channels.csv 
    if channel_id in df_channels.index:
        # Obtengo la fila completa del canal buscandoló por su id
        channel_in = df_channels.loc[channel_id] 
        
        # Asigno el valor del oldest, con el último latest de la tabla
        oldest = channel_in['latest'] 

        # Actualizo el nuevo valor del latest
        channel_in['latest'] = latest

        # Almaceno la información actualizada en el dataframe
        df_channels.loc[df_channels.index,'latest'] = channel_in['latest']
        df_channels.loc[df_channels.index,'num_members'] = channel_in['num_members']

    # Si no existe el canal en la lista, agrega la información del nuevo canal en una nueva fila
    else:
        info_channels= {
            'id':[channel_id], 
            'name':channel_name, 
            'num_members':channel_num_members, 
            'latest':latest
            }
        new_channel= pd.DataFrame(data = info_channels, columns = ['id','name','num_members','latest'])
        df_channels = pd.concat([df_channels, new_channel])
    
    # DESCARGA DE MENSAJES
    while has_more == True:
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
        
        # Obtención del historial de mensajes
        for element in conversations_history.get("messages"):
            message_list.append(element)

        # Seteo del cursor    
        if metadata is not None:
            cursor = metadata.get("next_cursor")              

    # Transformo la lista obtenida a dataframe
    df = pd.DataFrame(message_list)
    
    # Agrego al dataframe las columnas con info del canal
    df['Channel_id']= str(channel_id)
    df['Channel_name']= str(channel_name)

    # Convertimos el dataframe a CVS y lo descargo
    # Primero verificamos si tenemos un archivo "channels.csv" sino lo creamos
    fileName = r"slack_historial_de_mensajes.csv"
    fileObj = Path(fileName)
    fileExists = fileObj.is_file() # devuelve un booleano

    if fileExists is True:
        # Abrimos el archivo
        df_historial = pd.read_csv("slack_historial_de_mensajes.csv", index_col=0)
        # Concatenamos el archivo existente a los nuevos mensajes obtenidos
        df = pd.concat([df, df_historial])
        # Lo guardamos como un archivo .csv
        df.to_csv('slack_historial_de_mensajes.csv', sep=',')
    else:
        # Lo guardamos como un archivo .csv
        df.to_csv('slack_historial_de_mensajes.csv', sep=',')

# Guardamos el archivo channels.csv para las siguientes iteraciones
# Eliminamos las columnas residuales Unnamed que se crean por defecto
df_channels.drop(df_channels.columns[df_channels.columns.str.contains('Unnamed',case = False)],axis = 1, inplace = True)
df_channels.to_csv('channels.csv', sep=',')#,index=False)