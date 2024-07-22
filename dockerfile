# Start with the ROS Humble base image for Jammy
FROM ros:humble-ros-base-jammy

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install rosbridge_suite
RUN apt-get update && \
    apt-get install -y ros-humble-rosbridge-suite && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /usr/src/app

# Expose necessary ports
EXPOSE 3000 9090

# Start Node.js and rosbridge_websocket by default
# CMD ["bash", "-c", "roslaunch rosbridge_websocket rosbridge_websocket.launch & node server.js"]
