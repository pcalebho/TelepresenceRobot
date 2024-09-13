import rclpy
from rclpy.node import Node
import RPi.GPIO as GPIO
from rclpy.executors import ExternalShutdownException
import sys
import signal
from time import sleep
from std_msgs.msg import Bool


# GPIO Pins configuration
DIR_PIN = 2   # Direction pin
STEP_PIN = 3  # Step pin
ENABLE_PIN = 4
DEFAULT_SPEED = 1000     # Steps per second
DEFAULT_SPR = 1600      #steps per revolution
DEFAULT_INCREMENT = 100     #100 step increment
DEFAULT_MAX_STEPS = 3200



class StepperMotorControl(Node):
    def __init__(self):
        super().__init__('stepper_motor_control')

        # Declare parameters
        self.declare_parameter('speed', DEFAULT_SPEED)
        self.declare_parameter('steps_per_revolution', DEFAULT_SPR)
        self.declare_parameter('max_steps', DEFAULT_MAX_STEPS)
        self.declare_parameter('steps_per_command', DEFAULT_INCREMENT)

        # Read parameters
        self.SPEED = self.get_parameter('speed').value
        self.SPR = self.get_parameter('steps_per_revolution').value
        self.MAX_STEPS = self.get_parameter('max_steps').value
        self.INCREMENT = self.get_parameter('steps_per_command').value

        self.delay = 1/self.SPEED


        self.current_position = 0
        self.subscription = self.create_subscription(Bool, 'gimbal_command', self.motor_callback, 10)
        self.setup_gpio()

        self.get_logger().info('StepperMotorControl node has been started')

    def setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(ENABLE_PIN, GPIO.OUT)
        GPIO.setup(DIR_PIN, GPIO.OUT)
        GPIO.setup(STEP_PIN, GPIO.OUT)

        #Enables steppers
        GPIO.output(ENABLE_PIN, GPIO.LOW)

    def motor_callback(self, msg):
        self.get_logger().info(f'Received message: {msg.data}')
        self.move_motor(msg.data)

    def move_motor(self, direction):
        GPIO.output(DIR_PIN, not direction)
        for i in range(self.INCREMENT):  # 200 steps for one revolution
            if (self.current_position >= DEFAULT_MAX_STEPS and direction):
                self.get_logger().info('Hit max steps')
                return
            elif (self.current_position <= 0 and not direction):
                self.get_logger().info(f'Hit min steps')
                return
            
            GPIO.output(STEP_PIN, GPIO.HIGH)
            sleep(self.delay)
            GPIO.output(STEP_PIN, GPIO.LOW)
            sleep(self.delay)
            if (direction):
                self.current_position += 1
            else:
                self.current_position -= 1
        self.get_logger().info(f'Current position{self.current_position}')

    def destroy(self):
        self.get_logger().info('Closing Stepper Control Node')
        GPIO.output(ENABLE_PIN, GPIO.HIGH)
        GPIO.cleanup()
        super().destroy_node()

def main(args=None):
    rclpy.init(args=args)
    node = StepperMotorControl()
    rclpy.spin(node)
    node.destroy()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
