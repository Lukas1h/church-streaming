#!/bin/sh

# Set the file descriptor limit
ulimit -n 1024

echo "Starting Nginx with file descriptor limit set to 1024"

cat /etc/nginx/nginx.conf | grep "a.rtmp.youtube.com"

#Setup logging
rm -f /var/log/script.log
touch /var/log/script.log
chmod 777 /var/log/script.log
tail -f /var/log/script.log &
echo "Logging started..." >> /var/log/script.log


#build nginx.conf
echo "Building nginx.conf" >> /var/log/script.log
echo "123123" >> /var/log/script.log
# sh /setup/build-conf.sh >> /var/log/script.log



nginx -g "daemon off;"