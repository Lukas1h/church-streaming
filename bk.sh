#!/bin/bash

STATS_URL="http://localhost:81/stat"
FALLBACK_CMD=(ffmpeg -hide_banner -loglevel error -f image2 -loop 1 -i fallback.jpg -re -f lavfi -i anullsrc -vf format=yuv420p -c:v libx264 -b:v 2000k -maxrate 2000k -bufsize 4000k -g 50 -c:a aac -f flv "rtmp://localhost/live/backup")

fallback_pid=""

GREEN='\033[1;32m'
RED='\033[1;31m'
YELLOW='\033[1;33m'
FLASH='\033[5m'
NC='\033[0m'
CLEAR_LINE='\033[2J\033[H'

function is_stream_publishing() {
    curl -s "$STATS_URL" | jq -e '.["http-flv"].servers[].applications[].live.streams[]? | select(.name == "stream" and .publishing == true)' > /dev/null
}

function get_stats_summary() {
    local stats
    stats=$(curl -s "$STATS_URL")
    local stream_count
    stream_count=$(echo "$stats" | jq '[.["http-flv"].servers[].applications[].live.streams[]?] | length')
    local bw_in
    bw_in=$(echo "$stats" | jq '.["http-flv"].bw_in')
    local bw_out
    bw_out=$(echo "$stats" | jq '.["http-flv"].bw_out')
    echo -ne "\nStreams: $stream_count\tIn: ${bw_in}bps\tOut: ${bw_out}bps"
}

function start_fallback() {
    if [ -z "$fallback_pid" ]; then
        # echo "Starting fallback stream..."
        "${FALLBACK_CMD[@]}" &
        fallback_pid=$!
    fi
}

function stop_fallback() {
    if [ -n "$fallback_pid" ]; then
        # echo "Stream started publishing..."
        # echo "Stopping fallback stream (PID $fallback_pid)..."
        kill "$fallback_pid"
        wait "$fallback_pid" 2>/dev/null
        fallback_pid=""
    fi
}

while true; do
    if is_stream_publishing; then
        stop_fallback
        echo -ne "${CLEAR_LINE}Main Stream: ${GREEN}ON AIR${NC}\t\tFallback Stream: ${RED}OFF AIR${NC}"
        get_stats_summary
    else
        if [ -z "$fallback_pid" ]; then
            echo -ne "${CLEAR_LINE}Main Stream: ${RED}${FLASH}OFF AIR${NC}\t\tFallback Stream: ${YELLOW}Starting...${NC}"
            get_stats_summary
            start_fallback
        else
            if ! kill -0 "$fallback_pid" 2>/dev/null; then
                echo -ne "${CLEAR_LINE}Main Stream: ${RED}${FLASH}OFF AIR${NC}\t\tFallback Stream: ${YELLOW}Restarting...${NC}"
                get_stats_summary
                fallback_pid=""
                start_fallback
            else
                echo -ne "${CLEAR_LINE}Main Stream: ${RED}${FLASH}OFF AIR${NC}\t\tFallback Stream: ${GREEN}ON AIR${NC}"
                get_stats_summary
            fi
        fi
    fi
    sleep 1
done