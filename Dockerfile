# Cargo la imágen que voy a utilizar
FROM python:3

# Llamo a mi script de python
#ADD slack_bot_teampulse.py /

# Instalo las dependencias necesarias 
RUN pip install numpy
RUN pip install pandas
RUN pip install seaborn
RUN pip install matplotlib
RUN pip install textblob
RUN pip install googletrans
RUN pip install datetime
RUN pip install dtime

# Llevo todos los archivos al directorio de trabajo
COPY . .

# Declaro el puerto por donde se comunica mi contenedor
EXPOSE 1217

# Defino que ejecuto: Ejecución del script en la línea de comando cuando la imagen este cargada
#CMD [ "python", "slack_bot_teampulse.py" ]