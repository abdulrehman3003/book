---
sidebar_position: 2
---

# Isaac ROS

Isaac ROS provides hardware-accelerated ROS 2 packages for perception and navigation.

## Overview

Isaac ROS leverages NVIDIA GPUs to accelerate:
- Visual SLAM
- Object detection
- Depth processing
- Image segmentation

## Visual SLAM (VSLAM)

```bash
ros2 launch isaac_ros_visual_slam isaac_ros_visual_slam.launch.py
```

### Features

- Real-time localization and mapping
- GPU-accelerated feature extraction
- Loop closure detection

## Navigation (Nav2)

Isaac ROS integrates with Nav2 for autonomous navigation.

### Setup

```bash
sudo apt install ros-humble-isaac-ros-nvblox
ros2 launch nvblox_examples_bringup isaac_sim_example.launch.py
```

## Hardware-Accelerated Perception

### Object Detection

```bash
ros2 launch isaac_ros_detectnet isaac_ros_detectnet.launch.py
```

Uses TensorRT for fast inference on Jetson/RTX GPUs.

### Depth Processing

```python
from isaac_ros_depth_image_proc import DepthImageProc

# Convert stereo to depth at 30+ FPS
```

## Deployment on Jetson

Isaac ROS is optimized for NVIDIA Jetson:
- Jetson Orin Nano
- Jetson Orin NX
- Jetson AGX Orin

### Performance

| Task | CPU | GPU (Jetson) |
|------|-----|--------------|
| VSLAM | 10 FPS | 30 FPS |
| Object Detection | 5 FPS | 30 FPS |

---

Next: [Reinforcement Learning for Robotics](./10-rl-robotics.md)
