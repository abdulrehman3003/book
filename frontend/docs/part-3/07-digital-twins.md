---
sidebar_position: 3
---

# Digital Twins & Physical Law Modeling

Digital twins are virtual replicas of physical systems that enable testing, validation, and optimization before real-world deployment.

## What is a Digital Twin?

A digital twin is a virtual model that:
- **Mirrors** the physical system's behavior
- **Updates** in real-time with sensor data
- **Predicts** future states
- **Optimizes** performance

## Physical Law Modeling

### Gravity

```python
# In simulation
gravity = -9.81  # m/s^2
```

### Collisions

Collision detection requires:
- **Geometry**: Bounding boxes, meshes
- **Material properties**: Friction, restitution
- **Contact forces**: Normal and tangential

### Materials

```xml
<surface>
  <friction>
    <ode>
      <mu>0.8</mu>  <!-- Friction coefficient -->
      <mu2>0.8</mu2>
    </ode>
  </friction>
  <bounce>
    <restitution_coefficient>0.5</restitution_coefficient>
  </bounce>
</surface>
```

## Teleoperation vs. Autonomous Control

### Teleoperation

Human operator controls robot remotely:

```python
class TeleopNode(Node):
    def __init__(self):
        super().__init__('teleop')
        self.cmd_pub = self.create_publisher(Twist, '/cmd_vel', 10)
        
    def keyboard_callback(self, key):
        msg = Twist()
        if key == 'w':
            msg.linear.x = 0.5
        self.cmd_pub.publish(msg)
```

### Autonomous Control

Robot makes decisions independently:

```python
class AutonomousNav(Node):
    def __init__(self):
        super().__init__('autonomous')
        self.navigator = BasicNavigator()
        
    def navigate_to_goal(self, goal):
        self.navigator.goToPose(goal)
```

## Sim-to-Real Transfer

Challenges in transferring from simulation to reality:

1. **Reality Gap**: Simulation is not perfect
2. **Domain Randomization**: Vary simulation parameters
3. **System Identification**: Calibrate simulation to match hardware
4. **Robust Policies**: Train for uncertainty

### Domain Randomization

```python
# Randomize lighting, textures, physics
for episode in range(1000):
    randomize_lighting()
    randomize_friction()
    train_policy()
```

## Best Practices

- Start simple, add complexity gradually
- Validate simulation against real data
- Use hardware-in-the-loop testing
- Monitor sim-to-real performance gap

---

Next: [Part IV — NVIDIA Isaac Platform](../part-4.md)
