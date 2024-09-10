#!/bin/bash

node web/server.js & echo $! > server.pid & ros2 launch rosbridge_server rosbridge_websocket_launch.xml port:=9090