#!/bin/sh

# Load variables from config.json
CONFIG_JSON="/setup/config.json"
TEMPLATE_DIR="/setup/templates"
TEMP_FILE=$(mktemp)

# Use jq to read config.json into shell variables
eval $(jq -r 'to_entries | .[] | @sh "export \(.key)=\(.value)"' "$CONFIG_JSON")

# Iterate over all *.template files
for template in "$TEMPLATE_DIR"/*.template; do
  output="/setup/conf/$(basename "${template%.template}")"
  cp "$template" "$TEMP_FILE"

  for var in $(jq -r 'keys[]' "$CONFIG_JSON"); do
    val=$(jq -r --arg v "$var" '.[$v]' "$CONFIG_JSON")
    safe_val=$(printf '%s\n' "$val" | sed -e 's/[\/&]/\\&/g')
    sed -i'' -e "s|\${$var}|$safe_val|g" "$TEMP_FILE"
  done

  mv "$TEMP_FILE" "$output"
done