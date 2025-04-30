#!/bin/sh
if [ "$1" = "stream" ]; then
    stream_name="main"
elif [ "$1" = "backup" ]; then
    stream_name="backup"
else
    stream_name="\"$1\""
fi


if [ "$stream_name" != "main" ]; then
    log_color="\033[0;32m"
    log_level="\033[0;32m[Info]\033[0m"
else
    log_color="\033[0;33m"
    log_level="\033[0;33m[Warning]\033[0m"
fi

echo -e "$log_level Stream \033[1m$log_color$stream_name\033[0m stopped publishing.\033[0m" >> /var/log/script.log