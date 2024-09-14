import rclpy
from rclpy.node import Node
import RPi.GPIO as GPIO
from rclpy.executors import ExternalShutdownException
import sys
import signal
from time import sleep
from std_msgs.msg import Bool


# GPIO Pins configuration
ENABLE_PIN = 4



class EnableStepper(Node):
    def __init__(self):
        super().__init__('enable_stepper_subscriber')
        self.setup_gpio()

        self.get_logger().info('EnableStepper node has been started')

    def setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(ENABLE_PIN, GPIO.OUT)

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
    node = EnableStepper()
    rclpy.spin(node)
    node.destroy()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
