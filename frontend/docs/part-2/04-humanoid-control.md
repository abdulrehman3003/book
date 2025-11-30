---
sidebar_position: 2
---

# ROS 2 for Humanoid Control

Controlling humanoid robots requires understanding robot description formats, control interfaces, and integration with AI systems.

## URDF for Humanoid Robots

### What is URDF?

URDF (Unified Robot Description Format) is an XML format for describing robot kinematics and dynamics.

```xml
<?xml version="1.0"?>
<robot name="humanoid">
  <link name="base_link">
    <visual>
      <geometry>
        <box size="0.2 0.2 0.4"/>
      </geometry>
    </visual>
  </link>
  
  <link name="left_leg"/>
  
  <joint name="hip_joint" type="revolute">
    <parent link="base_link"/>
    <child link="left_leg"/>
    <axis xyz="0 1 0"/>
    <limit lower="-1.57" upper="1.57" effort="100" velocity="1.0"/>
  </joint>
</robot>
```

### Key Components

- **Links**: Rigid bodies (torso, limbs, head)
- **Joints**: Connections between links
  - Revolute (rotational)
  - Prismatic (linear)
  - Fixed
- **Sensors**: Cameras, IMUs, force sensors
- **Actuators**: Motors and their properties

### Humanoid-Specific Considerations

- **Degrees of Freedom**: 20-40+ joints
- **Center of Mass**: Critical for balance
- **Collision Geometry**: For self-collision avoidance
- **Inertial Properties**: Mass, inertia tensors

## Launch Files & Parameterization

Launch files orchestrate multiple nodes:

```python
from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='robot_state_publisher',
            executable='robot_state_publisher',
            parameters=[{'robot_description': urdf_content}]
        ),
        Node(
            package='joint_state_publisher',
            executable='joint_state_publisher',
        ),
    ])
```

### Parameter Configuration

```yaml
# humanoid_params.yaml
humanoid_controller:
  ros__parameters:
    joint_names: ['hip_pitch', 'knee', 'ankle']
    pid_gains:
      hip_pitch: {p: 100.0, i: 0.1, d: 10.0}
      knee: {p: 80.0, i: 0.1, d: 8.0}
```

## Linking LLM Agents to ROS 2 Controllers

### Architecture

```
LLM (GPT) → Task Planner → Motion Planner → ROS 2 Controller → Robot
```

### Example: Voice Command to Robot Action

```python
import rclpy
from rclpy.node import Node
from geometry_msgs.msg import Twist
import openai

class LLMRobotController(Node):
    def __init__(self):
        super().__init__('llm_controller')
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        
    def process_command(self, voice_input):
        # 1. Speech to text (Whisper)
        text = self.transcribe(voice_input)
        
        # 2. LLM planning (GPT)
        action = self.plan_action(text)
        
        # 3. Execute via ROS 2
        self.execute_action(action)
    
    def plan_action(self, text):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a robot controller. Convert commands to actions."},
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content
    
    def execute_action(self, action):
        # Parse action and publish to ROS 2 topics
        if "forward" in action:
            msg = Twist()
            msg.linear.x = 0.5
            self.cmd_pub.publish(msg)
```

## Control Interfaces

### Joint Control

```python
from trajectory_msgs.msg import JointTrajectory, JointTrajectoryPoint

class JointController(Node):
    def __init__(self):
        super().__init__('joint_controller')
        self.pub = self.create_publisher(
            JointTrajectory, 
            '/joint_trajectory', 
            10
        )
    
    def move_joints(self, positions, duration):
        traj = JointTrajectory()
        traj.joint_names = ['joint1', 'joint2']
        
        point = JointTrajectoryPoint()
        point.positions = positions
        point.time_from_start.sec = duration
        
        traj.points.append(point)
        self.pub.publish(traj)
```

### Cartesian Control

```python
from geometry_msgs.msg import PoseStamped

class CartesianController(Node):
    def move_end_effector(self, x, y, z):
        pose = PoseStamped()
        pose.pose.position.x = x
        pose.pose.position.y = y
        pose.pose.position.z = z
        self.pose_pub.publish(pose)
```

## Integration with AI Planning

### Behavior Trees

```python
import py_trees

class PickAndPlace(py_trees.behaviour.Behaviour):
    def update(self):
        # 1. Detect object (vision)
        # 2. Plan grasp (AI)
        # 3. Execute motion (ROS 2)
        # 4. Verify success
        return py_trees.common.Status.SUCCESS
```

### State Machines

```python
from smach import State, StateMachine

class Approach(State):
    def execute(self, userdata):
        # Move towards object
        return 'reached'

sm = StateMachine(outcomes=['success', 'failure'])
with sm:
    StateMachine.add('APPROACH', Approach(), 
                     transitions={'reached': 'GRASP'})
```

## Real-Time Considerations

- **Control Loop Frequency**: 100-1000 Hz for joint control
- **Latency**: &lt;10ms for safety-critical systems
- **DDS QoS Settings**: Configure reliability, durability
- **Priority Scheduling**: Real-time kernel (PREEMPT_RT)

## Debugging Tools

- **RViz**: Visualize robot state, sensors, transforms
- **Gazebo**: Simulate robot before hardware deployment
- **rqt_plot**: Plot joint states, velocities
- **tf2_tools**: Debug coordinate transforms

---

Next: [Part III — Simulation & Digital Twins](../part-3.md)
