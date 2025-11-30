---
sidebar_position: 3
---

# ROS 2 Practical Exercises

Hands-on exercises to solidify your ROS 2 skills.

## Exercise 1: Build a Simple Publisher-Subscriber

### Objective
Create a temperature monitoring system with a publisher and subscriber.

### Task
1. Create a publisher node that simulates temperature readings
2. Create a subscriber node that logs temperature data
3. Add alert functionality when temperature exceeds threshold

### Solution

**Publisher Node** (`temperature_publisher.py`):
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32
import random

class TemperaturePublisher(Node):
    def __init__(self):
        super().__init__('temperature_publisher')
        self.publisher_ = self.create_publisher(Float32, 'temperature', 10)
        self.timer = self.create_timer(1.0, self.publish_temperature)
        self.get_logger().info('Temperature Publisher started')
        
    def publish_temperature(self):
        msg = Float32()
        # Simulate temperature reading (20-30°C with random variation)
        msg.data = 25.0 + random.uniform(-5.0, 5.0)
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing temperature: {msg.data:.2f}°C')

def main(args=None):
    rclpy.init(args=args)
    node = TemperaturePublisher()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Subscriber Node** (`temperature_monitor.py`):
```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import Float32

class TemperatureMonitor(Node):
    def __init__(self):
        super().__init__('temperature_monitor')
        self.subscription = self.create_subscription(
            Float32,
            'temperature',
            self.temperature_callback,
            10
        )
        self.threshold = 28.0
        self.get_logger().info('Temperature Monitor started')
        
    def temperature_callback(self, msg):
        temp = msg.data
        if temp > self.threshold:
            self.get_logger().warn(f'⚠️  High temperature alert: {temp:.2f}°C')
        else:
            self.get_logger().info(f'Temperature OK: {temp:.2f}°C')

def main(args=None):
    rclpy.init(args=args)
    node = TemperatureMonitor()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Running the Exercise
```bash
# Terminal 1: Run publisher
ros2 run my_package temperature_publisher

# Terminal 2: Run subscriber
ros2 run my_package temperature_monitor

# Terminal 3: Monitor topic
ros2 topic echo /temperature
```

## Exercise 2: Create a Custom Service

### Objective
Build a service that calculates robot battery life based on power consumption.

### Task
1. Define a custom service interface
2. Create a service server
3. Create a service client

### Solution

**Service Definition** (`BatteryLife.srv`):
```
# Request
float32 battery_capacity_ah
float32 power_consumption_w
---
# Response
float32 estimated_hours
string status_message
```

**Service Server** (`battery_service.py`):
```python
import rclpy
from rclpy.node import Node
from my_interfaces.srv import BatteryLife

class BatteryLifeService(Node):
    def __init__(self):
        super().__init__('battery_life_service')
        self.srv = self.create_service(
            BatteryLife,
            'calculate_battery_life',
            self.calculate_callback
        )
        self.get_logger().info('Battery Life Service ready')
        
    def calculate_callback(self, request, response):
        # Calculate battery life
        # Power (W) = Voltage (V) × Current (A)
        # Assuming 24V system
        voltage = 24.0
        current_a = request.power_consumption_w / voltage
        
        # Battery life (hours) = Capacity (Ah) / Current (A)
        if current_a > 0:
            response.estimated_hours = request.battery_capacity_ah / current_a
            
            if response.estimated_hours < 1.0:
                response.status_message = "⚠️  Critical: Less than 1 hour remaining"
            elif response.estimated_hours < 2.0:
                response.status_message = "⚡ Low: Recharge soon"
            else:
                response.status_message = "✅ Good: Sufficient battery"
        else:
            response.estimated_hours = 0.0
            response.status_message = "❌ Error: Invalid power consumption"
            
        self.get_logger().info(
            f'Calculated battery life: {response.estimated_hours:.2f}h'
        )
        return response

def main(args=None):
    rclpy.init(args=args)
    node = BatteryLifeService()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Service Client** (`battery_client.py`):
```python
import rclpy
from rclpy.node import Node
from my_interfaces.srv import BatteryLife

class BatteryLifeClient(Node):
    def __init__(self):
        super().__init__('battery_life_client')
        self.client = self.create_client(BatteryLife, 'calculate_battery_life')
        
        while not self.client.wait_for_service(timeout_sec=1.0):
            self.get_logger().info('Waiting for service...')
            
    def send_request(self, capacity_ah, power_w):
        request = BatteryLife.Request()
        request.battery_capacity_ah = capacity_ah
        request.power_consumption_w = power_w
        
        future = self.client.call_async(request)
        rclpy.spin_until_future_complete(self, future)
        
        if future.result() is not None:
            response = future.result()
            self.get_logger().info(
                f'Battery Life: {response.estimated_hours:.2f} hours'
            )
            self.get_logger().info(f'Status: {response.status_message}')
            return response
        else:
            self.get_logger().error('Service call failed')
            return None

def main(args=None):
    rclpy.init(args=args)
    client = BatteryLifeClient()
    
    # Example: 5Ah battery, 50W consumption
    client.send_request(5.0, 50.0)
    
    client.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Exercise 3: Parameter Management

### Objective
Create a configurable robot controller using ROS 2 parameters.

### Task
1. Define parameters for robot speed and acceleration
2. Allow runtime parameter updates
3. Validate parameter values

### Solution

```python
import rclpy
from rclpy.node import Node
from rcl_interfaces.msg import ParameterDescriptor
from geometry_msgs.msg import Twist

class ConfigurableRobotController(Node):
    def __init__(self):
        super().__init__('configurable_controller')
        
        # Declare parameters with descriptions and constraints
        self.declare_parameter(
            'max_linear_speed',
            1.0,
            ParameterDescriptor(description='Maximum linear speed (m/s)')
        )
        self.declare_parameter(
            'max_angular_speed',
            1.0,
            ParameterDescriptor(description='Maximum angular speed (rad/s)')
        )
        self.declare_parameter(
            'acceleration',
            0.5,
            ParameterDescriptor(description='Acceleration (m/s²)')
        )
        
        # Add parameter callback
        self.add_on_set_parameters_callback(self.parameter_callback)
        
        # Publisher
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        
        self.get_logger().info('Configurable Robot Controller started')
        self.log_parameters()
        
    def parameter_callback(self, params):
        """Validate parameters when they change"""
        for param in params:
            if param.name == 'max_linear_speed':
                if param.value < 0 or param.value > 5.0:
                    self.get_logger().error(
                        f'Invalid max_linear_speed: {param.value}. Must be 0-5.0'
                    )
                    return False
            elif param.name == 'max_angular_speed':
                if param.value < 0 or param.value > 3.0:
                    self.get_logger().error(
                        f'Invalid max_angular_speed: {param.value}. Must be 0-3.0'
                    )
                    return False
                    
        self.get_logger().info('Parameters updated successfully')
        self.log_parameters()
        return True
        
    def log_parameters(self):
        """Log current parameter values"""
        max_linear = self.get_parameter('max_linear_speed').value
        max_angular = self.get_parameter('max_angular_speed').value
        accel = self.get_parameter('acceleration').value
        
        self.get_logger().info(f'Max Linear Speed: {max_linear} m/s')
        self.get_logger().info(f'Max Angular Speed: {max_angular} rad/s')
        self.get_logger().info(f'Acceleration: {accel} m/s²')
        
    def move_forward(self):
        """Move robot forward at configured speed"""
        msg = Twist()
        max_speed = self.get_parameter('max_linear_speed').value
        msg.linear.x = max_speed
        self.cmd_pub.publish(msg)

def main(args=None):
    rclpy.init(args=args)
    node = ConfigurableRobotController()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Parameter File** (`robot_params.yaml`):
```yaml
configurable_controller:
  ros__parameters:
    max_linear_speed: 1.5
    max_angular_speed: 1.2
    acceleration: 0.8
```

**Launch with Parameters**:
```bash
ros2 run my_package configurable_controller --ros-args --params-file robot_params.yaml
```

**Update Parameters at Runtime**:
```bash
# List parameters
ros2 param list

# Get parameter value
ros2 param get /configurable_controller max_linear_speed

# Set parameter value
ros2 param set /configurable_controller max_linear_speed 2.0
```

## Exercise 4: Action Server for Long-Running Tasks

### Objective
Implement an action server for robot navigation with progress feedback.

### Task
1. Define a custom action
2. Create an action server
3. Create an action client with feedback handling

### Solution

**Action Definition** (`Navigate.action`):
```
# Goal
float32 target_x
float32 target_y
---
# Result
bool success
float32 final_x
float32 final_y
float32 distance_traveled
---
# Feedback
float32 current_x
float32 current_y
float32 distance_remaining
```

**Action Server** (`navigation_action_server.py`):
```python
import rclpy
from rclpy.action import ActionServer
from rclpy.node import Node
from my_interfaces.action import Navigate
import time
import math

class NavigationActionServer(Node):
    def __init__(self):
        super().__init__('navigation_action_server')
        self._action_server = ActionServer(
            self,
            Navigate,
            'navigate_to_point',
            self.execute_callback
        )
        self.get_logger().info('Navigation Action Server started')
        
    def execute_callback(self, goal_handle):
        self.get_logger().info('Executing navigation goal...')
        
        # Get goal
        target_x = goal_handle.request.target_x
        target_y = goal_handle.request.target_y
        
        # Simulate current position
        current_x, current_y = 0.0, 0.0
        
        # Calculate total distance
        total_distance = math.sqrt(
            (target_x - current_x)**2 + (target_y - current_y)**2
        )
        
        # Feedback message
        feedback_msg = Navigate.Feedback()
        
        # Simulate navigation (move 0.1m per step)
        steps = int(total_distance / 0.1)
        for i in range(steps):
            # Check if goal was canceled
            if goal_handle.is_cancel_requested:
                goal_handle.canceled()
                self.get_logger().info('Goal canceled')
                return Navigate.Result()
                
            # Update position
            progress = (i + 1) / steps
            current_x = progress * target_x
            current_y = progress * target_y
            
            # Calculate remaining distance
            distance_remaining = math.sqrt(
                (target_x - current_x)**2 + (target_y - current_y)**2
            )
            
            # Publish feedback
            feedback_msg.current_x = current_x
            feedback_msg.current_y = current_y
            feedback_msg.distance_remaining = distance_remaining
            goal_handle.publish_feedback(feedback_msg)
            
            self.get_logger().info(
                f'Progress: {progress*100:.1f}%, Remaining: {distance_remaining:.2f}m'
            )
            
            time.sleep(0.1)  # Simulate movement time
            
        # Goal succeeded
        goal_handle.succeed()
        
        # Return result
        result = Navigate.Result()
        result.success = True
        result.final_x = target_x
        result.final_y = target_y
        result.distance_traveled = total_distance
        
        self.get_logger().info('Navigation complete!')
        return result

def main(args=None):
    rclpy.init(args=args)
    node = NavigationActionServer()
    rclpy.spin(node)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

**Action Client** (`navigation_action_client.py`):
```python
import rclpy
from rclpy.action import ActionClient
from rclpy.node import Node
from my_interfaces.action import Navigate

class NavigationActionClient(Node):
    def __init__(self):
        super().__init__('navigation_action_client')
        self._action_client = ActionClient(self, Navigate, 'navigate_to_point')
        
    def send_goal(self, x, y):
        goal_msg = Navigate.Goal()
        goal_msg.target_x = x
        goal_msg.target_y = y
        
        self.get_logger().info(f'Sending goal: ({x}, {y})')
        
        self._action_client.wait_for_server()
        
        self._send_goal_future = self._action_client.send_goal_async(
            goal_msg,
            feedback_callback=self.feedback_callback
        )
        
        self._send_goal_future.add_done_callback(self.goal_response_callback)
        
    def goal_response_callback(self, future):
        goal_handle = future.result()
        if not goal_handle.accepted:
            self.get_logger().info('Goal rejected')
            return
            
        self.get_logger().info('Goal accepted')
        
        self._get_result_future = goal_handle.get_result_async()
        self._get_result_future.add_done_callback(self.get_result_callback)
        
    def feedback_callback(self, feedback_msg):
        feedback = feedback_msg.feedback
        self.get_logger().info(
            f'Position: ({feedback.current_x:.2f}, {feedback.current_y:.2f}), '
            f'Remaining: {feedback.distance_remaining:.2f}m'
        )
        
    def get_result_callback(self, future):
        result = future.result().result
        if result.success:
            self.get_logger().info(
                f'✅ Navigation successful! '
                f'Final position: ({result.final_x}, {result.final_y}), '
                f'Distance traveled: {result.distance_traveled:.2f}m'
            )
        else:
            self.get_logger().error('❌ Navigation failed')

def main(args=None):
    rclpy.init(args=args)
    client = NavigationActionClient()
    
    # Send goal to navigate to (5.0, 3.0)
    client.send_goal(5.0, 3.0)
    
    rclpy.spin(client)
    rclpy.shutdown()

if __name__ == '__main__':
    main()
```

## Challenge Projects

### Project 1: Multi-Robot Coordination
Create a system where multiple robots coordinate to complete a task:
- Use namespaces for multiple robots
- Implement a coordinator node
- Share information via topics

### Project 2: Sensor Fusion
Combine data from multiple sensors:
- IMU + GPS for localization
- Camera + LIDAR for obstacle detection
- Publish fused data on a single topic

### Project 3: Emergency Stop System
Build a safety system:
- Monitor multiple safety sensors
- Implement emergency stop via service
- Log all safety events

## Debugging Tips

### Common Issues

**Issue**: Node not receiving messages
```bash
# Check if topic exists
ros2 topic list

# Check topic type
ros2 topic info /topic_name

# Check if anyone is publishing
ros2 topic hz /topic_name
```

**Issue**: Service not found
```bash
# List all services
ros2 service list

# Check service type
ros2 service type /service_name
```

**Issue**: Parameter not updating
```bash
# Verify parameter exists
ros2 param list

# Check parameter type
ros2 param describe /node_name parameter_name
```

---

Next: [Part III — Simulation & Digital Twins](../part-3.md)
