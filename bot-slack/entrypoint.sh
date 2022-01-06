#!/bin/sh

echo "CLIENT_NAME=${CLIENT_NAME}" >> /etc/environment
echo "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" >> /etc/environment
echo "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" >> /etc/environment

cron && tail -f /var/log/cron.log