#!/bin/sh
if [ "$1" = "stream" ]; then
    stream_name="main"
elif [ "$1" = "backup" ]; then
    stream_name="backup"
else
    stream_name="\"$1\""
fi


if [ "$stream_name" = "main" ]; then
    log_color="\033[0;32m"
    log_level="\033[0;32m[Info]\033[0m"
else
    log_color="\033[0;33m"
    log_level="\033[0;33m[Warning]\033[0m"
fi

yt=$2
fb=$3
ig=$4

echo -e "$log_level Stream \033[1m$log_color$stream_name\033[0m started recived." >> /var/log/script.log
echo -e "$log_level Publishing to:" >> /var/log/script.log
echo -e "$log_level     - YouTube with key: \033[1m$log_color$yt\033[0m" >> /var/log/script.log
echo -e "$log_level     - Facebook with key: \033[1m$log_color$fb\033[0m" >> /var/log/script.log
echo -e "$log_level     - Instagram with key: \033[1m$log_color$ig\033[0m" >> /var/log/script.log