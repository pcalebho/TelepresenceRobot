// Create ros object to communicate over your Rosbridge connection
const ros = new ROSLIB.Ros({ url : 'ws://23.114.63.102:9090' });
// const ros = new ROSLIB.Ros({ url : 'ws://localhost:9090' });


// When the Rosbridge server connects, fill the span with id “status" with “successful"
ros.on('connection', () => {
  document.getElementById("status").innerHTML = "RosBridge Status: successful";
  console.log("Successful RosBridge Websocket Connection");
});

// When the Rosbridge server experiences an error, fill the “status" span with the returned error
ros.on('error', (error) => {
  document.getElementById("status").innerHTML = `RosBridge Status: errored out (${error})`;
  console.log("Error RosBridge Websocket Connection");
});

// When the Rosbridge server shuts down, fill the “status" span with “closed"
ros.on('close', () => {
  document.getElementById("status").innerHTML = "RosBridge Status: closed";
  console.log("Closed RosBridge Websocket Connection");
});


const moveBindings = {
  'w': [1, 0, 0, 0],
  'e': [1, 0, 0, -1],
  'a': [0, 0, 0, 1],
  'd': [0, 0, 0, -1],
  'q': [1, 0, 0, 1],
  's': [-1, 0, 0, 0]
};

const speedBindings = {
  'u': [1.1, 1.1],
  'j': [0.9, 0.9],
  'i': [1.1, 1],
  'k': [0.9, 1],
  'o': [1, 1.1],
  'l': [1, 0.9]
};

const gimbalBindings = {
  "ArrowUp" : true,
  "ArrowDown": false 
}

const speed_limit = 1000.0;
const turn_limit = 50.0;
let speed = 1.0;
let turn = 1.0;

//setup listeners
window.addEventListener('keydown', readKey)

const cmd_vel_publisher = new ROSLIB.Topic({
  ros,
  name: "/cmd_vel",
  messageType: "geometry_msgs/Twist"
});

const gimbal_cmd_publisher = new ROSLIB.Topic({
  ros,
  name: "/gimbal_command",
  messageType: "std_msgs/Bool"
})

function readKey(e){
  const key = e.key
  let xlin = 0.0, ylin = 0.0, zlin = 0.0, th = 0.0;
  let speed_multiplier = 1.0, turn_multiplier = 1.0;
  if (key in moveBindings){
    [xlin, ylin, zlin, th] = moveBindings[key];

    let twist_msg = {
    linear: {
      x: xlin*speed,
      y: ylin*speed,
      z: zlin*speed
    },
    angular: {
      x: 0,
      y: 0,
      z: th*turn
    }
    };
    teleop_input = new ROSLIB.Message(twist_msg);

    cmd_vel_publisher.publish(teleop_input);
  }
  else if (key in speedBindings){
    [speed_multiplier, turn_multiplier] = speedBindings[key];

    speed = Math.min(speed_multiplier*speed, speed_limit);
    turn = Math.min(turn_multiplier*speed, turn_limit);
  }        
  else if (key in gimbalBindings){
    console.log(gimbalBindings[key])
    gimbal_input = new ROSLIB.Message({data: gimbalBindings[key]});
    gimbal_cmd_publisher.publish(gimbal_input)
  }
}     