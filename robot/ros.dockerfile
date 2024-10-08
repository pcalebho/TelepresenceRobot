# Start with the ROS Humble base image for Jammy
FROM ros:humble-ros-base-jammy

# Install rosbridge_suite
RUN apt-get update && \
    apt-get install -y ros-humble-rosbridge-suite && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Expose necessary port for rosbridge
EXPOSE 9090

# COPY . /usr/src/app/

# RUN useradd -ms /bin/sh -u 1001 app

# Source the ROS environment and start rosbridge_websocket
CMD ["bash", "-c", "source /opt/ros/humble/setup.bash && ros2 launch rosbridge_server rosbridge_websocket_launch.xml"]
