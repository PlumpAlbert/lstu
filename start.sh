#!/bin/sh

for FILE in $(find static -name '*.scss'); do
  sassc -t compact "$FILE" "${FILE%.scss}.css";
done

node index.js > /dev/null 2>&1 &

echo $! > running_pid
