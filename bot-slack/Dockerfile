###########################
# DOCKERFILE - BOT-SLACK 
###########################

# 1) Cargo la imágen que voy a utilizar
FROM 280035946601.dkr.ecr.us-east-1.amazonaws.com/python:3

# 2) Instalo Cron
RUN apt-get update && apt-get -y install cron

# 3) Agrego mi script de python
ADD slack_bot_teampulse.py /

# 4) Agrego mi entrypoint
ADD entrypoint.sh /
RUN chmod +x /entrypoint.sh

# 5) Agrego archivo para el cron
COPY cron-file /etc/cron.d/cron-file
RUN chmod 0744 /etc/cron.d/cron-file
RUN crontab /etc/cron.d/cron-file
RUN touch /var/log/cron.log

# 6) Instalo las dependencias necesarias 
RUN pip install numpy
RUN pip install pandas
RUN pip install datetime
RUN pip install pathlib
RUN pip install slack
RUN pip install slackeventsapi
RUN pip install slackclient
RUN pip install boto3
RUN pip install python-dotenv
RUN pip install botocore
RUN pip install pybase64

# 7) Ejecución del cron y guardado de logs
ENTRYPOINT [ "/entrypoint.sh" ]