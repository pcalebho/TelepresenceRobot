// Create ros object to communicate over your Rosbridge connection
// const ros = new ROSLIB.Ros({ url : 'ws://99.30.49.178:9090' });
const ros = new ROSLIB.Ros({ url : 'ws://localhost:9090' });


// When the Rosbridge server connects, fill the span with id “status" with “successful"
ros.on('connection', () => {
  document.getElementById("status").innerHTML = "successful";
  console.log("Successful Websocket Connection");
});

// When the Rosbridge server experiences an error, fill the “status" span with the returned error
ros.on('error', (error) => {
  document.getElementById("status").innerHTML = `errored out (${error})`;
  console.log("Error Websocket Connection");
});

// When the Rosbridge server shuts down, fill the “status" span with “closed"
ros.on('close', () => {
  document.getElementById("status").innerHTML = "closed";
  console.log("Closed Websocket Connection");
});

// Create a listener for /my_topic
const my_topic_listener = new ROSLIB.Topic({
  ros,
  name : "/my_topic",
  messageType : "std_msgs/String"
});

// When we receive a message on /my_topic, add its data as a list item to the “messages" ul
my_topic_listener.subscribe((message) => {
  const ul = document. getElementById("messages");
  const newMessage = document. createElement("li");
  newMessage. appendChild(document. createTextNode(message.data));
  ul.appendChild(newMessage);
});

const moveBindings = {
  'i': [1, 0, 0, 0],
  'o': [1, 0, 0, -1],
  'j': [0, 0, 0, 1],
  'l': [0, 0, 0, -1],
  'u': [1, 0, 0, 1],
  ',': [-1, 0, 0, 0],
  '.': [-1, 0, 0, 1],
  'm': [-1, 0, 0, -1],
  'O': [1, -1, 0, 0],
  'I': [1, 0, 0, 0],
  'J': [0, 1, 0, 0],
  'L': [0, -1, 0, 0],
  'U': [1, 1, 0, 0],
  '<': [-1, 0, 0, 0],
  '>': [-1, -1, 0, 0],
  'M': [-1, 1, 0, 0],
  't': [0, 0, 1, 0],
  'b': [0, 0, -1, 0]
};

const speedBindings = {
  'q': [1.1, 1.1],
  'z': [0.9, 0.9],
  'w': [1.1, 1],
  'x': [0.9, 1],
  'e': [1, 1.1],
  'c': [1, 0.9]
};

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
}     