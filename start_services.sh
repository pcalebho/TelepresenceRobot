#!/bin/bash

node web/server.js & echo $! > server.pid & ros2 launch rosbridge_server rosbridge_websocket_launch.xml port:=9090 \
    & source robot/install/setup.bash & ros2 run stepper stepper_motor_control