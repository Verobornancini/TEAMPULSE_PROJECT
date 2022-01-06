#!/bin/bash

# install latest version of docker the lazy way
curl -sSL https://get.docker.com | sh

# make it so you don't need to sudo to run docker commands
usermod -aG docker ubuntu

# install docker-compose
curl -L https://github.com/docker/compose/releases/download/1.21.2/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# install unzip
apt-get install -y unzip

# install aws cli 2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install

# configure aws cli
aws configure set aws_access_key_id AKIAUCM3ROBUXACT6X7X
aws configure set aws_secret_access_key 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
aws configure set default.region us-east-1

# copy the dockerfile into /srv/docker 
# if you change this, change the systemd service file to match
# WorkingDirectory=[whatever you have below]
mkdir /srv/docker
aws s3 cp s3://teampulse-infra/docker-compose.yml /srv/docker/

# copy in systemd unit file and register it so our compose file runs 
# on system restart
aws s3 cp s3://teampulse-infra/docker-compose-app.service /etc/systemd/system/
systemctl enable docker-compose-app

# Login into AWS ECR so docker-compose can download docker images for the app
aws ecr get-authorization-token --region us-east-1 --output text --query 'authorizationData[].authorizationToken' | base64 -d | cut -d: -f2 | docker login --password-stdin --username AWS 280035946601.dkr.ecr.us-east-1.amazonaws.com

# start up the application via docker-compose
docker-compose -f /srv/docker/docker-compose.yml up -d