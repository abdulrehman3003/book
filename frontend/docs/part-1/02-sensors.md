---
sidebar_position: 2
---

# Sensors & Perception Systems

Physical AI systems rely on sensors to perceive their environment. This chapter covers the key sensor modalities used in robotics.

## Vision Sensors

### RGB Cameras
- **Purpose**: Color image capture
- **Use cases**: Object detection, visual servoing, human-robot interaction
- **Limitations**: No depth information, lighting dependent

### Depth Cameras
- **Technologies**: Structured light (Intel RealSense), Time-of-Flight (Azure Kinect)
- **Output**: RGB + Depth (RGBD)
- **Applications**: 3D reconstruction, obstacle avoidance, grasping

### Stereo Cameras
- **Principle**: Triangulation from two cameras
- **Advantages**: Passive depth sensing
- **Challenges**: Calibration, computational cost

## LIDAR (Light Detection and Ranging)

- **Principle**: Laser-based distance measurement
- **Output**: 3D point clouds
- **Types**: 
  - 2D LIDAR (planar scanning)
  - 3D LIDAR (Velodyne, Ouster)
- **Applications**: SLAM, navigation, mapping

## Inertial Measurement Units (IMU)

- **Components**: 
  - Accelerometer (linear acceleration)
  - Gyroscope (angular velocity)
  - Magnetometer (orientation)
- **Use cases**: Balance, orientation estimation, sensor fusion

## Force/Torque Sensors

- **Purpose**: Measure contact forces
- **Applications**: 
  - Compliant manipulation
  - Human-robot collaboration
  - Delicate grasping

## Tactile Sensors

- **Types**: Resistive, capacitive, optical
- **Applications**: Fine manipulation, texture recognition
- **Examples**: BioTac, GelSight

## Sensor Fusion

Combining multiple sensors provides:
- **Redundancy**: Fault tolerance
- **Complementarity**: Different modalities cover each other's weaknesses
- **Accuracy**: Improved state estimation

### Example: Visual-Inertial Odometry
Combines camera (visual features) with IMU (motion) for robust localization.

## Why Physical Perception Matters

1. **Uncertainty**: Real-world sensors are noisy
2. **Partial observability**: Limited field of view
3. **Real-time constraints**: Processing must be fast
4. **Safety**: Perception failures can be dangerous

## Practical Considerations

- **Calibration**: Intrinsic and extrinsic parameters
- **Synchronization**: Temporal alignment of sensor streams
- **Bandwidth**: Data throughput limitations
- **Power**: Energy consumption in mobile robots

---

Next: [Part II — Robot Operating System (ROS 2)](../part-2.md)
