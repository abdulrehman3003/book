---
sidebar_position: 1
---

# Gazebo Simulation

Gazebo is a powerful 3D robot simulator that integrates with ROS 2. It provides realistic physics simulation and sensor modeling.

## Setting Up Gazebo

### Installation

```bash
sudo apt install ros-humble-gazebo-ros-pkgs
```

### Launching Gazebo with ROS 2

```bash
ros2 launch gazebo_ros gazebo.launch.py
```

## URDF/SDF Robot Descriptions

### SDF (Simulation Description Format)

SDF is Gazebo's native format, more expressive than URDF:

```xml
<?xml version="1.0"?>
<sdf version="1.6">
  <model name="humanoid">
    <link name="base_link">
      <inertial>
        <mass>50.0</mass>
        <inertia>
          <ixx>1.0</ixx>
          <iyy>1.0</iyy>
          <izz>1.0</izz>
        </inertia>
      </inertial>
      <collision name="collision">
        <geometry>
          <box>
            <size>0.3 0.3 0.6</size>
          </box>
        </geometry>
      </collision>
      <visual name="visual">
        <geometry>
          <box>
            <size>0.3 0.3 0.6</size>
          </box>
        </geometry>
      </visual>
    </link>
  </model>
</sdf>
```

## Sensor Simulation

### LIDAR Simulation

```xml
<sensor name="lidar" type="ray">
  <pose>0 0 0.1 0 0 0</pose>
  <ray>
    <scan>
      <horizontal>
        <samples>360</samples>
        <resolution>1</resolution>
        <min_angle>-3.14159</min_angle>
        <max_angle>3.14159</max_angle>
      </horizontal>
    </scan>
    <range>
      <min>0.1</min>
      <max>10.0</max>
    </range>
  </ray>
</sensor>
```

### Depth Camera Simulation

```xml
<sensor name="depth_camera" type="depth">
  <camera>
    <horizontal_fov>1.047</horizontal_fov>
    <image>
      <width>640</width>
      <height>480</height>
    </image>
    <clip>
      <near>0.1</near>
      <far>10.0</far>
    </clip>
  </camera>
</sensor>
```

## Physics Engines

Gazebo supports multiple physics engines:

- **ODE**: Default, fast, good for most applications
- **Bullet**: Better collision detection
- **DART**: Advanced dynamics
- **Simbody**: Biomechanics

### Configuring Physics

```xml
<physics type="ode">
  <max_step_size>0.001</max_step_size>
  <real_time_factor>1.0</real_time_factor>
  <real_time_update_rate>1000</real_time_update_rate>
</physics>
```

## ROS 2 Integration

### Spawning Models

```python
from gazebo_msgs.srv import SpawnEntity
import rclpy

class ModelSpawner(Node):
    def __init__(self):
        super().__init__('model_spawner')
        self.client = self.create_client(SpawnEntity, '/spawn_entity')
        
    def spawn_robot(self, sdf_content):
        request = SpawnEntity.Request()
        request.name = 'humanoid'
        request.xml = sdf_content
        self.client.call_async(request)
```

## Best Practices

1. **Use appropriate physics step size**: Balance accuracy vs. performance
2. **Optimize collision geometry**: Use simple shapes where possible
3. **Limit sensor update rates**: Match real hardware capabilities
4. **Use GPU rendering**: For faster visualization

---

Next: [Unity for Robot Visualization](./06-unity.md)
