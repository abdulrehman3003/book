---
sidebar_position: 3
---

# Real-World Deployment & Troubleshooting

Transitioning from simulation to real hardware presents unique challenges. This chapter covers practical deployment strategies and common issues.

## Hardware Integration Checklist

### Pre-Deployment Validation

```python
class SystemHealthCheck(Node):
    def __init__(self):
        super().__init__('system_health_check')
        self.checks = {
            'motors': False,
            'sensors': False,
            'communication': False,
            'power': False,
            'emergency_stop': False
        }
        
    def run_diagnostics(self):
        """Run complete system diagnostics"""
        self.get_logger().info('🔍 Running system diagnostics...')
        
        self.check_motors()
        self.check_sensors()
        self.check_communication()
        self.check_power()
        self.check_emergency_stop()
        
        return self.generate_report()
        
    def check_motors(self):
        """Verify all motors are responsive"""
        try:
            # Test each motor
            for motor_id in range(1, 21):  # 20 motors
                response = self.send_motor_command(motor_id, 'ping')
                if not response:
                    self.get_logger().error(f'❌ Motor {motor_id} not responding')
                    return
                    
            self.checks['motors'] = True
            self.get_logger().info('✅ All motors operational')
        except Exception as e:
            self.get_logger().error(f'Motor check failed: {e}')
            
    def check_sensors(self):
        """Verify sensor data streams"""
        required_topics = [
            '/camera/image_raw',
            '/imu/data',
            '/lidar/scan',
            '/joint_states'
        ]
        
        for topic in required_topics:
            if not self.topic_is_active(topic):
                self.get_logger().error(f'❌ Topic {topic} not publishing')
                return
                
        self.checks['sensors'] = True
        self.get_logger().info('✅ All sensors publishing')
        
    def check_power(self):
        """Monitor battery and power systems"""
        battery_voltage = self.read_battery_voltage()
        
        if battery_voltage < 22.0:  # For 24V system
            self.get_logger().warn(f'⚠️  Low battery: {battery_voltage}V')
        elif battery_voltage > 29.0:
            self.get_logger().warn(f'⚠️  Overvoltage: {battery_voltage}V')
        else:
            self.checks['power'] = True
            self.get_logger().info(f'✅ Battery OK: {battery_voltage}V')
            
    def generate_report(self):
        """Generate diagnostic report"""
        all_passed = all(self.checks.values())
        
        report = "\n" + "="*50 + "\n"
        report += "SYSTEM DIAGNOSTIC REPORT\n"
        report += "="*50 + "\n"
        
        for system, status in self.checks.items():
            icon = "✅" if status else "❌"
            report += f"{icon} {system.upper()}: {'PASS' if status else 'FAIL'}\n"
            
        report += "="*50 + "\n"
        report += f"Overall Status: {'✅ READY' if all_passed else '❌ NOT READY'}\n"
        report += "="*50
        
        self.get_logger().info(report)
        return all_passed
```

## Calibration Procedures

### Joint Calibration

```python
class JointCalibration:
    def __init__(self):
        self.calibration_data = {}
        
    def calibrate_joint(self, joint_name):
        """
        Calibrate a single joint to find:
        - Zero position
        - Range of motion
        - Encoder offset
        """
        self.get_logger().info(f'Calibrating {joint_name}...')
        
        # Step 1: Find home position (limit switch or hard stop)
        home_position = self.find_home_position(joint_name)
        
        # Step 2: Measure range of motion
        min_pos, max_pos = self.measure_range(joint_name)
        
        # Step 3: Calculate encoder offset
        encoder_offset = self.calculate_offset(joint_name, home_position)
        
        # Store calibration data
        self.calibration_data[joint_name] = {
            'home': home_position,
            'min': min_pos,
            'max': max_pos,
            'offset': encoder_offset
        }
        
        self.get_logger().info(f'✅ {joint_name} calibrated')
        return self.calibration_data[joint_name]
        
    def find_home_position(self, joint_name):
        """Move joint to home position slowly"""
        # Move slowly until limit switch triggered
        while not self.limit_switch_triggered(joint_name):
            self.move_joint(joint_name, velocity=-0.1)
            time.sleep(0.01)
            
        self.stop_joint(joint_name)
        return self.get_joint_position(joint_name)
        
    def save_calibration(self, filename='calibration.yaml'):
        """Save calibration data to file"""
        import yaml
        with open(filename, 'w') as f:
            yaml.dump(self.calibration_data, f)
        self.get_logger().info(f'Calibration saved to {filename}')
```

### Camera Calibration

```python
import cv2
import numpy as np

class CameraCalibration:
    def __init__(self):
        self.camera_matrix = None
        self.dist_coeffs = None
        
    def calibrate_camera(self, images, pattern_size=(9, 6)):
        """
        Calibrate camera using checkerboard pattern
        
        Args:
            images: List of calibration images
            pattern_size: Checkerboard inner corners (width, height)
        """
        # Prepare object points
        objp = np.zeros((pattern_size[0] * pattern_size[1], 3), np.float32)
        objp[:, :2] = np.mgrid[0:pattern_size[0], 
                               0:pattern_size[1]].T.reshape(-1, 2)
        
        obj_points = []  # 3D points in real world
        img_points = []  # 2D points in image plane
        
        for img in images:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Find checkerboard corners
            ret, corners = cv2.findChessboardCorners(gray, pattern_size, None)
            
            if ret:
                obj_points.append(objp)
                img_points.append(corners)
                
        # Calibrate camera
        ret, self.camera_matrix, self.dist_coeffs, rvecs, tvecs = \
            cv2.calibrateCamera(obj_points, img_points, gray.shape[::-1], 
                              None, None)
        
        print("Camera Matrix:")
        print(self.camera_matrix)
        print("\nDistortion Coefficients:")
        print(self.dist_coeffs)
        
        return self.camera_matrix, self.dist_coeffs
        
    def undistort_image(self, image):
        """Remove lens distortion from image"""
        return cv2.undistort(image, self.camera_matrix, self.dist_coeffs)
```

## Common Issues & Solutions

### Issue 1: Joint Jitter/Oscillation

**Symptoms**: Joint vibrates or oscillates around target position

**Causes**:
- PID gains too high
- Mechanical backlash
- Encoder noise

**Solutions**:
```python
class StableJointController:
    def __init__(self):
        # Use lower gains for stability
        self.kp = 50.0  # Reduce if oscillating
        self.ki = 0.1
        self.kd = 5.0   # Increase for damping
        
        # Add deadband to prevent micro-movements
        self.deadband = 0.01  # radians
        
        # Low-pass filter for encoder noise
        self.alpha = 0.8  # Filter coefficient
        self.filtered_position = 0.0
        
    def control(self, target, current):
        # Filter position reading
        self.filtered_position = (self.alpha * self.filtered_position + 
                                 (1 - self.alpha) * current)
        
        error = target - self.filtered_position
        
        # Apply deadband
        if abs(error) < self.deadband:
            return 0.0
            
        # PID control
        output = (self.kp * error + 
                 self.ki * self.integral_error + 
                 self.kd * self.derivative_error)
        
        return output
```

### Issue 2: Sensor Data Latency

**Symptoms**: Robot reacts slowly to environment changes

**Causes**:
- Network delays
- Processing bottlenecks
- Sensor update rate too low

**Solutions**:
```python
class LowLatencyPerception(Node):
    def __init__(self):
        super().__init__('low_latency_perception')
        
        # Use QoS settings for low latency
        from rclpy.qos import QoSProfile, ReliabilityPolicy, HistoryPolicy
        
        qos = QoSProfile(
            reliability=ReliabilityPolicy.BEST_EFFORT,  # Lower latency
            history=HistoryPolicy.KEEP_LAST,
            depth=1  # Only keep latest message
        )
        
        self.subscription = self.create_subscription(
            Image,
            '/camera/image_raw',
            self.image_callback,
            qos
        )
        
        # Process in separate thread to avoid blocking
        self.executor = MultiThreadedExecutor()
        
    def image_callback(self, msg):
        # Timestamp for latency measurement
        receive_time = self.get_clock().now()
        image_time = msg.header.stamp
        
        latency = (receive_time - image_time).nanoseconds / 1e9
        
        if latency > 0.1:  # 100ms threshold
            self.get_logger().warn(f'High latency: {latency*1000:.1f}ms')
```

### Issue 3: Motor Overheating

**Symptoms**: Motors become hot during operation

**Causes**:
- Excessive current draw
- Insufficient cooling
- Continuous high torque

**Solutions**:
```python
class ThermalManagement(Node):
    def __init__(self):
        super().__init__('thermal_management')
        self.motor_temps = {}
        self.temp_threshold = 80.0  # Celsius
        
        self.timer = self.create_timer(1.0, self.monitor_temperatures)
        
    def monitor_temperatures(self):
        for motor_id in range(1, 21):
            temp = self.read_motor_temperature(motor_id)
            self.motor_temps[motor_id] = temp
            
            if temp > self.temp_threshold:
                self.handle_overheat(motor_id, temp)
                
    def handle_overheat(self, motor_id, temp):
        self.get_logger().error(
            f'🔥 Motor {motor_id} overheating: {temp}°C'
        )
        
        # Reduce motor load
        self.reduce_motor_torque(motor_id, factor=0.5)
        
        # Activate cooling if available
        self.activate_cooling(motor_id)
        
        # If critical, stop motor
        if temp > 90.0:
            self.emergency_stop_motor(motor_id)
```

### Issue 4: Communication Dropouts

**Symptoms**: Intermittent loss of connection to robot

**Causes**:
- WiFi interference
- Cable issues
- Power fluctuations

**Solutions**:
```python
class RobustCommunication(Node):
    def __init__(self):
        super().__init__('robust_communication')
        self.last_heartbeat = self.get_clock().now()
        self.timeout_threshold = 1.0  # seconds
        
        # Heartbeat timer
        self.create_timer(0.1, self.check_connection)
        
        # Subscribe to robot heartbeat
        self.create_subscription(
            Bool,
            '/robot/heartbeat',
            self.heartbeat_callback,
            10
        )
        
    def heartbeat_callback(self, msg):
        self.last_heartbeat = self.get_clock().now()
        
    def check_connection(self):
        time_since_heartbeat = (
            self.get_clock().now() - self.last_heartbeat
        ).nanoseconds / 1e9
        
        if time_since_heartbeat > self.timeout_threshold:
            self.handle_connection_loss()
            
    def handle_connection_loss(self):
        self.get_logger().error('⚠️  Connection lost to robot!')
        
        # Enter safe mode
        self.publish_emergency_stop()
        
        # Attempt reconnection
        self.attempt_reconnect()
```

## Safety Protocols

### Emergency Stop System

```python
class EmergencyStopSystem(Node):
    def __init__(self):
        super().__init__('emergency_stop')
        
        # Multiple emergency stop triggers
        self.create_subscription(Bool, '/estop_button', self.estop_callback, 10)
        self.create_subscription(Bool, '/collision_detected', self.estop_callback, 10)
        self.create_subscription(Float32, '/battery_voltage', self.voltage_callback, 10)
        
        # Emergency stop publisher
        self.estop_pub = self.create_publisher(Bool, '/emergency_stop', 10)
        
        self.is_stopped = False
        
    def estop_callback(self, msg):
        if msg.data and not self.is_stopped:
            self.trigger_emergency_stop('Manual trigger or collision')
            
    def voltage_callback(self, msg):
        if msg.data < 20.0:  # Critical low voltage
            self.trigger_emergency_stop(f'Critical low voltage: {msg.data}V')
            
    def trigger_emergency_stop(self, reason):
        self.get_logger().error(f'🚨 EMERGENCY STOP: {reason}')
        
        # Stop all motors
        self.stop_all_motors()
        
        # Publish emergency stop state
        msg = Bool()
        msg.data = True
        self.estop_pub.publish(msg)
        
        self.is_stopped = True
        
        # Log event
        self.log_emergency_event(reason)
        
    def stop_all_motors(self):
        """Cut power to all motors immediately"""
        # Implementation depends on hardware
        pass
```

### Collision Detection

```python
class CollisionDetector(Node):
    def __init__(self):
        super().__init__('collision_detector')
        
        # Subscribe to force/torque sensors
        self.create_subscription(
            WrenchStamped,
            '/force_torque',
            self.force_callback,
            10
        )
        
        self.force_threshold = 50.0  # Newtons
        
    def force_callback(self, msg):
        force_magnitude = math.sqrt(
            msg.wrench.force.x**2 +
            msg.wrench.force.y**2 +
            msg.wrench.force.z**2
        )
        
        if force_magnitude > self.force_threshold:
            self.get_logger().warn(f'⚠️  Collision detected: {force_magnitude}N')
            self.trigger_collision_response()
            
    def trigger_collision_response(self):
        # Stop motion
        self.publish_stop_command()
        
        # Retract slightly
        self.retract_from_collision()
```

## Performance Optimization

### Real-Time Performance

```python
import os
import sys

def configure_realtime():
    """Configure system for real-time performance"""
    
    # Set process priority
    os.nice(-20)  # Highest priority (requires sudo)
    
    # Set CPU affinity (pin to specific cores)
    os.sched_setaffinity(0, {2, 3})  # Use cores 2 and 3
    
    # Set real-time scheduling policy
    param = os.sched_param(os.sched_get_priority_max(os.SCHED_FIFO))
    os.sched_setscheduler(0, os.SCHED_FIFO, param)
    
    print("✅ Real-time configuration applied")
```

### Memory Management

```python
class MemoryEfficientNode(Node):
    def __init__(self):
        super().__init__('memory_efficient')
        
        # Pre-allocate buffers
        self.image_buffer = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # Reuse objects instead of creating new ones
        self.twist_msg = Twist()
        
    def publish_velocity(self, linear, angular):
        # Reuse message object
        self.twist_msg.linear.x = linear
        self.twist_msg.angular.z = angular
        self.cmd_pub.publish(self.twist_msg)
```

## Deployment Checklist

### Pre-Deployment
- [ ] All sensors calibrated
- [ ] All joints calibrated
- [ ] Emergency stop tested
- [ ] Battery fully charged
- [ ] Software updated
- [ ] Backup configuration saved

### During Operation
- [ ] Monitor battery voltage
- [ ] Monitor motor temperatures
- [ ] Check communication latency
- [ ] Log all errors
- [ ] Keep emergency stop accessible

### Post-Operation
- [ ] Download logs
- [ ] Check for mechanical wear
- [ ] Recharge batteries
- [ ] Update maintenance log
- [ ] Review error reports

## Logging & Diagnostics

```python
class DiagnosticLogger(Node):
    def __init__(self):
        super().__init__('diagnostic_logger')
        
        # Create log file with timestamp
        from datetime import datetime
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        self.log_file = f'robot_log_{timestamp}.csv'
        
        # Write header
        with open(self.log_file, 'w') as f:
            f.write('timestamp,battery_voltage,motor_temps,cpu_usage,errors\n')
            
        self.create_timer(1.0, self.log_diagnostics)
        
    def log_diagnostics(self):
        data = {
            'timestamp': self.get_clock().now().to_msg(),
            'battery_voltage': self.read_battery(),
            'motor_temps': self.read_motor_temps(),
            'cpu_usage': self.get_cpu_usage(),
            'errors': self.get_error_count()
        }
        
        self.write_to_log(data)
```

---

Next: [Capstone Project](../capstone.md)
