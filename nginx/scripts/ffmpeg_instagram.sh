#!/bin/sh
echo -e "\033[0;32m[Info]\033[0m Starting ffmpeg_instagram.sh" >> /var/log/script.log

stream=$1
url=$2
echo -e "\033[0;32m[Info]\033[0m Publishing $stream to $url" >> /var/log/script.log


ffmpeg -i "rtmp://localhost:1935/live/$stream"  -i /var/www/bg.png  -filter_complex "[0:v]scale=w=720:h=-1[video] ; [1:v][video]overlay=x=main_w/2-overlay_w/2:y=main_h/2-overlay_h/2"  -c:v libx264 -c:a aac -f flv "$url" >> /var/log/script.log
echo -e "\033[0;32m[Info]\033[0m Finished ffmpeg_instagram.sh" >> /var/log/script.log