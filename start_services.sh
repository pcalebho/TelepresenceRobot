#!/bin/bash

node web/server.js & ros2 launch rosbridge_server rosbridge_websocket_launch.xml