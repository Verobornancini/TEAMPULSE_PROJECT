# Cargo la imágen que voy a utilizar
FROM python:3

# Llamo a mi script de python
ADD slack_bot_teampulse.py /

# Instalo las dependencias necesarias 
RUN pip install numpy
RUN pip install pandas
RUN pip install datetime
RUN pip install pathlib
RUN pip install slack
RUN pip install slackeventsapi
RUN pip install slackclient

# Llevo todos los archivos al directorio de trabajo
COPY . .

# Declaro el puerto por donde se comunica mi contenedor
EXPOSE 1215

# Defino que ejecuto: Ejecución del script en la línea de comando cuando la imagen este cargada
CMD [ "python", "slack_bot_teampulse.py" ]