---
sidebar_position: 3
---

# Actuators & Motion Systems

While sensors allow robots to perceive the world, actuators enable them to interact with it. This chapter covers the various types of actuators used in humanoid robotics.

## Types of Actuators

### Electric Motors

#### DC Motors
- **Brushed DC Motors**: Simple, cost-effective
  - Advantages: Easy control, high torque
  - Disadvantages: Brush wear, maintenance required
  - Use cases: Hobby robots, small joints

#### Brushless DC Motors (BLDC)
- **Higher efficiency**: No brush friction
- **Longer lifespan**: No brush wear
- **Better power-to-weight ratio**
- **Use cases**: Drone propulsion, high-performance joints

```python
# Example: Controlling a BLDC motor via ROS 2
from rclpy.node import Node
from std_msgs.msg import Float64

class MotorController(Node):
    def __init__(self):
        super().__init__('motor_controller')
        self.pub = self.create_publisher(Float64, '/motor/velocity', 10)
        
    def set_velocity(self, rpm):
        msg = Float64()
        msg.data = rpm
        self.pub.publish(msg)
        self.get_logger().info(f'Setting motor velocity to {rpm} RPM')
```

#### Servo Motors
- **Position control**: Built-in feedback
- **Types**:
  - Standard servos (180° rotation)
  - Continuous rotation servos
  - Digital servos (higher precision)

### Stepper Motors

- **Precise positioning**: Step-by-step movement
- **No feedback required**: Open-loop control
- **Applications**: 3D printers, CNC machines
- **Limitations**: Lower speed, can lose steps under load

```python
# Stepper motor control example
class StepperController:
    def __init__(self, steps_per_revolution=200):
        self.steps_per_rev = steps_per_revolution
        self.current_position = 0
        
    def move_to_angle(self, angle_degrees):
        steps = int((angle_degrees / 360) * self.steps_per_rev)
        self.step(steps)
        
    def step(self, num_steps):
        # Send step pulses to motor driver
        for i in range(abs(num_steps)):
            self.pulse_step_pin()
            time.sleep(0.001)  # Step delay
```

## Hydraulic Actuators

### Advantages
- **Very high force**: Ideal for heavy-duty applications
- **Smooth motion**: Continuous force application
- **Power density**: High power-to-weight ratio

### Disadvantages
- **Complexity**: Requires pumps, valves, fluid management
- **Maintenance**: Potential leaks, fluid replacement
- **Noise**: Pump operation

### Applications
- Boston Dynamics Atlas (hydraulic legs)
- Industrial manipulators
- Heavy construction robots

## Pneumatic Actuators

### Characteristics
- **Compliant**: Naturally soft, safe for human interaction
- **Fast response**: Quick actuation
- **Simple**: Fewer moving parts

### Types
- **Linear actuators**: Pistons, cylinders
- **Rotary actuators**: Pneumatic motors
- **Soft pneumatic actuators**: Inflatable structures

```python
# Pneumatic gripper control
class PneumaticGripper(Node):
    def __init__(self):
        super().__init__('pneumatic_gripper')
        self.valve_pub = self.create_publisher(Bool, '/gripper/valve', 10)
        
    def open_gripper(self):
        msg = Bool()
        msg.data = True
        self.valve_pub.publish(msg)
        
    def close_gripper(self):
        msg = Bool()
        msg.data = False
        self.valve_pub.publish(msg)
```

## Series Elastic Actuators (SEA)

### Concept
- **Spring in series**: Between motor and load
- **Force sensing**: Measure spring deflection
- **Compliance**: Natural shock absorption

### Benefits
- **Safety**: Soft interaction with environment
- **Force control**: Precise force application
- **Energy efficiency**: Spring stores/releases energy

### Implementation
```python
class SeriesElasticActuator:
    def __init__(self, spring_constant):
        self.k = spring_constant  # N/m
        self.motor_position = 0
        self.load_position = 0
        
    def get_force(self):
        deflection = self.motor_position - self.load_position
        force = self.k * deflection
        return force
        
    def control_force(self, desired_force):
        current_force = self.get_force()
        error = desired_force - current_force
        
        # PI controller
        motor_velocity = kp * error + ki * integral_error
        return motor_velocity
```

## Motor Drivers & Controllers

### H-Bridge
- **Bidirectional control**: Forward and reverse
- **PWM speed control**: Pulse width modulation

### ESC (Electronic Speed Controller)
- **For BLDC motors**: Commutation control
- **Protocols**: PWM, OneShot, DShot

### Example: PWM Motor Control
```python
import RPi.GPIO as GPIO

class PWMMotorDriver:
    def __init__(self, pin, frequency=1000):
        self.pin = pin
        GPIO.setup(pin, GPIO.OUT)
        self.pwm = GPIO.PWM(pin, frequency)
        self.pwm.start(0)
        
    def set_speed(self, speed_percent):
        # speed_percent: 0-100
        self.pwm.ChangeDutyCycle(speed_percent)
        
    def stop(self):
        self.pwm.ChangeDutyCycle(0)
```

## Transmission Systems

### Gear Reduction
- **Increase torque**: Trade speed for force
- **Gear ratios**: 10:1, 50:1, 100:1 common
- **Types**: Spur, planetary, harmonic drive

### Belt & Pulley
- **Flexible transmission**: Over distances
- **Timing belts**: Prevent slippage
- **Applications**: 3D printers, large joints

### Cable Drive (Tendon)
- **Remote actuation**: Motor away from joint
- **Weight reduction**: Lighter limbs
- **Example**: Robot hands with forearm motors

## Power Requirements

### Calculating Power Needs
```python
def calculate_motor_power(torque_nm, rpm):
    """
    Calculate required motor power
    
    Args:
        torque_nm: Required torque in Newton-meters
        rpm: Rotational speed in RPM
    
    Returns:
        power_watts: Required power in Watts
    """
    # Power (W) = Torque (Nm) × Angular velocity (rad/s)
    angular_velocity = (rpm * 2 * math.pi) / 60
    power_watts = torque_nm * angular_velocity
    return power_watts

# Example: Hip joint
torque = 50  # Nm
speed = 60   # RPM
power = calculate_motor_power(torque, speed)
print(f"Required power: {power:.2f} W")
```

### Battery Considerations
- **Voltage**: Match motor requirements (12V, 24V, 48V)
- **Capacity**: Ah rating for runtime
- **C-rating**: Discharge rate capability
- **Chemistry**: LiPo, Li-ion, LiFePO4

## Actuator Selection Criteria

### Key Factors
1. **Torque requirements**: Load × distance
2. **Speed requirements**: RPM needed
3. **Precision**: Position accuracy
4. **Power consumption**: Battery life
5. **Weight**: Power-to-weight ratio
6. **Cost**: Budget constraints
7. **Control complexity**: Driver requirements

### Selection Matrix

| Application | Recommended Actuator | Reason |
|-------------|---------------------|---------|
| **Finger joints** | Small servo motors | Precise position control |
| **Arm joints** | BLDC + gearbox | High torque, efficiency |
| **Leg joints** | High-torque servos or hydraulic | Heavy loads, dynamic motion |
| **Gripper** | Pneumatic or servo | Compliant grasping |
| **Wheels** | BLDC motors | Continuous rotation, speed |

## Safety Considerations

### Overcurrent Protection
```python
class SafeMotorController(Node):
    def __init__(self, max_current=10.0):
        super().__init__('safe_motor')
        self.max_current = max_current
        self.current_sensor_sub = self.create_subscription(
            Float64, '/motor/current', self.current_callback, 10
        )
        
    def current_callback(self, msg):
        if msg.data > self.max_current:
            self.emergency_stop()
            self.get_logger().error(f'Overcurrent detected: {msg.data}A')
            
    def emergency_stop(self):
        # Cut power to motor
        self.publish_velocity(0.0)
```

### Temperature Monitoring
- **Thermal limits**: Motors have max operating temperature
- **Cooling**: Heatsinks, fans for high-power applications
- **Thermal shutdown**: Automatic protection

## Practical Tips

1. **Start with servos**: Easiest for beginners
2. **Use motor drivers**: Don't drive motors directly from microcontrollers
3. **Add current sensing**: Monitor motor health
4. **Implement soft limits**: Prevent mechanical damage
5. **Test incrementally**: Start with low power, increase gradually

---

Next: [Part II — Robot Operating System (ROS 2)](../part-2.md)
