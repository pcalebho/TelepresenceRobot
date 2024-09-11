from launch import LaunchDescription
from launch_ros.actions import Node
from launch.actions import IncludeLaunchDescription
from launch_xml.launch_description_sources import XMLLaunchDescriptionSource
from ament_index_python.packages import get_package_share_directory
import os

def generate_launch_description():
    rosbridge_launch = IncludeLaunchDescription(
        XMLLaunchDescriptionSource(
            [os.path.join(get_package_share_directory('rosbridge_server'), 'launch', 'rosbridge_websocket_launch.xml')]
        )
    )

    stepper_motor_node = Node(
        package='stepper',
        executable='stepper_motor_control',
        name='stepper_motor_control',
        output='screen'
    )

    return LaunchDescription([
        rosbridge_launch,
        stepper_motor_node,
    ])
