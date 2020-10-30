#!/bin/sh

kill $(cat ./running_pid);
git pull
./start.sh
