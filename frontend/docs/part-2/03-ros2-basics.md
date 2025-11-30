---
sidebar_position: 1
---

# Robotic Nervous System (ROS 2 Basics)

ROS 2 (Robot Operating System 2) is a middleware framework for building robot applications. It provides tools, libraries, and conventions for creating complex robot behaviors.

## Why ROS 2?

- **Industry standard**: Used by Boston Dynamics, NASA, autonomous vehicles
- **Modularity**: Component-based architecture
- **Language support**: Python, C++, and more
- **Real-time capable**: DDS middleware for deterministic communication
- **Cross-platform**: Linux, Windows, macOS

## ROS 2 Architecture

### Core Concepts

1. **Nodes**: Independent processes that perform computation
2. **Topics**: Named buses for asynchronous message passing
3. **Services**: Synchronous request-reply communication
4. **Actions**: Long-running tasks with feedback
5. **Parameters**: Configuration values for nodes

### Communication Patterns

```
Publisher → Topic → Subscriber  (many-to-many)
Client → Service → Server        (one-to-one)
Action Client → Action Server    (with feedback)
```

## Nodes

A node is a process that performs a specific task:

```python
import rclpy
from rclpy.node import Node

class MinimalNode(Node):
    def __init__(self):
        super().__init__('minimal_node')
        self.get_logger().info('Node started!')

def main():
    rclpy.init()
    node = MinimalNode()
    rclpy.spin(node)
    rclpy.shutdown()
```

## Topics

Topics enable publish-subscribe communication:

```python
from std_msgs.msg import String

class Publisher(Node):
    def __init__(self):
        super().__init__('publisher')
        self.pub = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(1.0, self.publish_message)
    
    def publish_message(self):
        msg = String()
        msg.data = 'Hello ROS 2!'
        self.pub.publish(msg)
```

## Services

Services provide request-reply communication:

```python
from example_interfaces.srv import AddTwoInts

class ServiceServer(Node):
    def __init__(self):
        super().__init__('service_server')
        self.srv = self.create_service(
            AddTwoInts, 
            'add_two_ints', 
            self.add_callback
        )
    
    def add_callback(self, request, response):
        response.sum = request.a + request.b
        return response
```

## Actions

Actions are for long-running tasks with feedback:

```python
from action_msgs.msg import GoalStatus
from example_interfaces.action import Fibonacci

# Action provides:
# - Goal: Initial request
# - Feedback: Progress updates
# - Result: Final outcome
```

## Building ROS 2 Packages in Python

### Package Structure

```
my_robot_package/
├── package.xml          # Package metadata
├── setup.py             # Python setup
├── my_robot_package/
│   ├── __init__.py
│   └── my_node.py       # Node implementation
└── resource/
    └── my_robot_package
```

### Creating a Package

```bash
ros2 pkg create --build-type ament_python my_robot_package
```

### Building and Running

```bash
colcon build
source install/setup.bash
ros2 run my_robot_package my_node
```

## ROS 2 Tools

- `ros2 node list`: List active nodes
- `ros2 topic list`: List active topics
- `ros2 topic echo /topic`: Monitor topic messages
- `ros2 service call /service`: Call a service
- `rqt_graph`: Visualize node graph

## Best Practices

1. **Single responsibility**: One node, one task
2. **Namespace organization**: Group related nodes
3. **Parameter configuration**: Externalize settings
4. **Logging**: Use ROS 2 logger, not print()
5. **Lifecycle management**: Use managed nodes for critical systems

---

Next: [ROS 2 for Humanoid Control](./04-humanoid-control.md)
