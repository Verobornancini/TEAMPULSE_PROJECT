###########################
# DOCKERFILE - ANALYTICS 
###########################

# 1) Cargo la imágen que voy a utilizar
FROM 280035946601.dkr.ecr.us-east-1.amazonaws.com/ubuntu:latest

# 2) Instalo Cron
RUN apt-get update && apt-get -y install cron

# 3) Agrego mis scripts de python
# slack
ADD slack/01_data_cleaning.py /
ADD slack/02_data_analysis.py /
ADD slack/secret_manager.py /
# encuestas
ADD encuestas/encuesta_bienestar.py /
ADD encuestas/encuesta_clima.py /
ADD encuestas/secret_manager.py /

# 4) Agrego mi entrypoint
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

# 5) Agrego archivo para el cron
COPY cron-file /etc/cron.d/cron-file
RUN chmod 0744 /etc/cron.d/cron-file
RUN crontab /etc/cron.d/cron-file
RUN touch /var/log/cron.log

# 6) Instalo las dependencias necesarias 
RUN mkdir src
WORKDIR src/
COPY . .
RUN apt-get update && apt-get -y update
RUN apt-get install -y build-essential python3-pip python3
RUN pip3 install spacy
RUN python3 -m spacy download es_core_news_sm
RUN pip3 install -r requirements.txt

# 7) Ejecución del cron y guardado de logs
WORKDIR /src/slack
ENTRYPOINT [ "/entrypoint.sh" ]