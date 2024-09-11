#!/bin/bash

node web/server.js & echo $! > server.pid \
 & source robot/install/setup.bash && ros2 launch stepper telebot_launch.py
