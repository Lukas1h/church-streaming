#!/bin/sh

# Set the file descriptor limit
echo  -e "\033[0;32m[Info]\033[0m Setting file descriptor limit to 1024"
ulimit -n 1024

echo  -e "\033[0;32m[Info]\033[0m Checking config files for correct keys:"
cat /etc/nginx/nginx.conf | grep "a.rtmp.youtube.com"
cat /etc/nginx/nginx.conf | grep "push"


# Setup logging
echo  -e "\033[0;32m[Info]\033[0m Setting up logging..."
rm -f /var/log/script.log
touch /var/log/script.log
chmod 777 /var/log/script.log
tail -f /var/log/script.log &
echo -e "\033[0;32m[Info]\033[0m Logging started..." >> /var/log/script.log

# Build nginx.conf
# echo "Building nginx.conf" >> /var/log/script.log
# sh /setup/build-conf.sh >> /var/log/script.log
echo  -e "\033[0;32m[Info]\033[0m Starting nginx..." >> /var/log/script.log
nginx -g "daemon off;"