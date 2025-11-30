---
sidebar_position: 9
---

# Appendix — Resources & References

A curated collection of tools, libraries, datasets, and learning resources for Physical AI and humanoid robotics.

## Essential Software & Tools

### ROS 2 Distributions

| Distribution | Ubuntu Version | Release Date | Support Until |
|--------------|----------------|--------------|---------------|
| **Humble Hawksbill** | 22.04 LTS | May 2022 | May 2027 |
| **Iron Irwini** | 22.04 | May 2023 | Nov 2024 |
| **Jazzy Jalisco** | 24.04 LTS | May 2024 | May 2029 |

**Recommendation**: Use Humble for production, Jazzy for latest features.

### Simulation Platforms

#### Gazebo
- **Website**: [gazebosim.org](https://gazebosim.org)
- **Best for**: Physics simulation, sensor modeling
- **License**: Apache 2.0

#### NVIDIA Isaac Sim
- **Website**: [developer.nvidia.com/isaac-sim](https://developer.nvidia.com/isaac-sim)
- **Best for**: Photorealistic rendering, synthetic data
- **Requirements**: RTX GPU

#### Unity Robotics
- **Website**: [github.com/Unity-Technologies/Unity-Robotics-Hub](https://github.com/Unity-Technologies/Unity-Robotics-Hub)
- **Best for**: Visualization, VR/AR
- **License**: Free for personal use

### Development Tools

```bash
# Essential ROS 2 tools
sudo apt install ros-humble-rqt*
sudo apt install ros-humble-rviz2
sudo apt install ros-humble-plotjuggler-ros

# Build tools
sudo apt install python3-colcon-common-extensions
sudo apt install python3-rosdep

# Debugging
sudo apt install ros-humble-ros2-control
sudo apt install ros-humble-ros2-controllers
```

## Python Libraries

### Core Libraries

```bash
# Computer Vision
pip install opencv-python
pip install ultralytics  # YOLOv8
pip install mediapipe    # Pose estimation

# Machine Learning
pip install torch torchvision
pip install tensorflow
pip install stable-baselines3  # RL

# Robotics
pip install roboticstoolbox-python
pip install modern_robotics
pip install pyquaternion

# Audio Processing
pip install openai-whisper
pip install pyaudio
pip install sounddevice
```

### Specialized Libraries

```python
# Inverse Kinematics
from ikpy.chain import Chain
from ikpy.link import OriginLink, URDFLink

# Motion Planning
import ompl
from moveit_msgs.msg import MotionPlanRequest

# Sensor Fusion
from filterpy.kalman import KalmanFilter
from filterpy.common import Q_discrete_white_noise
```

## Hardware Platforms

### Humanoid Robots

| Robot | Manufacturer | DOF | Price Range | Best For |
|-------|--------------|-----|-------------|----------|
| **Unitree G1** | Unitree | 23 | $16,000 | Research, affordable |
| **NAO** | SoftBank | 25 | $8,000 | Education |
| **Pepper** | SoftBank | 20 | $20,000 | Service, interaction |
| **Atlas** | Boston Dynamics | 28 | Not for sale | Advanced research |
| **Digit** | Agility Robotics | 20 | $250,000 | Logistics |

### Development Kits

#### NVIDIA Jetson
- **Jetson Orin Nano**: Entry-level, $499
- **Jetson Orin NX**: Mid-range, $899
- **Jetson AGX Orin**: High-end, $1,999

#### Sensors
- **Intel RealSense D435i**: RGBD camera, $329
- **Velodyne VLP-16**: 3D LIDAR, $4,000
- **Ouster OS1**: 3D LIDAR, $3,500
- **Bosch BMI088**: IMU, $15

## Datasets

### Robot Learning

#### Open X-Embodiment
- **Description**: 1M+ robot trajectories across 22 robot types
- **Link**: [robotics-transformer-x.github.io](https://robotics-transformer-x.github.io)
- **Use case**: Training VLA models

#### RoboNet
- **Description**: 15M video frames from 7 robot platforms
- **Link**: [robonet.wiki](https://www.robonet.wiki)
- **Use case**: Visual prediction, imitation learning

### Computer Vision

#### COCO (Common Objects in Context)
- **Images**: 330K
- **Categories**: 80 object classes
- **Link**: [cocodataset.org](https://cocodataset.org)

#### ImageNet
- **Images**: 14M
- **Categories**: 20K classes
- **Link**: [image-net.org](https://image-net.org)

## Online Courses

### Free Courses

1. **Modern Robotics** (Northwestern University)
   - Platform: Coursera
   - Topics: Kinematics, dynamics, control
   - Link: [coursera.org/specializations/modernrobotics](https://www.coursera.org/specializations/modernrobotics)

2. **Underactuated Robotics** (MIT)
   - Instructor: Russ Tedrake
   - Topics: Nonlinear dynamics, optimal control
   - Link: [underactuated.mit.edu](https://underactuated.mit.edu)

3. **ROS 2 Tutorials** (Official)
   - Platform: docs.ros.org
   - Topics: Complete ROS 2 guide
   - Link: [docs.ros.org/en/humble/Tutorials.html](https://docs.ros.org/en/humble/Tutorials.html)

### Paid Courses

1. **The Construct** - ROS 2 Mastery
   - Price: $49/month
   - Link: [theconstructsim.com](https://www.theconstructsim.com)

2. **Udemy** - ROS 2 for Beginners
   - Price: ~$15 (on sale)
   - Instructor: Edouard Renard

## Research Papers

### Foundational Papers

1. **RT-2: Vision-Language-Action Models** (Google, 2023)
   - Transfer web knowledge to robotic control
   - [arxiv.org/abs/2307.15818](https://arxiv.org/abs/2307.15818)

2. **PaLM-E: Embodied Multimodal Language Model** (Google, 2023)
   - 562B parameter embodied LLM
   - [arxiv.org/abs/2303.03378](https://arxiv.org/abs/2303.03378)

3. **Learning Dexterous In-Hand Manipulation** (OpenAI, 2018)
   - RL for robotic hand control
   - [arxiv.org/abs/1808.00177](https://arxiv.org/abs/1808.00177)

4. **Deep Reinforcement Learning for Robotic Manipulation** (Levine et al., 2016)
   - End-to-end learning from pixels
   - [arxiv.org/abs/1610.00633](https://arxiv.org/abs/1610.00633)

### Recent Advances (2024)

- **Mobile ALOHA**: Bimanual mobile manipulation
- **HumanoidBench**: Benchmark for humanoid control
- **VIMA**: Multimodal prompting for robots

## Communities & Forums

### Online Communities

1. **ROS Discourse**
   - Link: [discourse.ros.org](https://discourse.ros.org)
   - Best for: ROS 2 questions, announcements

2. **r/robotics** (Reddit)
   - Link: [reddit.com/r/robotics](https://reddit.com/r/robotics)
   - Best for: General robotics discussion

3. **ROS Answers**
   - Link: [answers.ros.org](https://answers.ros.org)
   - Best for: Technical Q&A

4. **Robotics Stack Exchange**
   - Link: [robotics.stackexchange.com](https://robotics.stackexchange.com)
   - Best for: Detailed technical questions

### Conferences

- **ICRA** (International Conference on Robotics and Automation)
- **IROS** (International Conference on Intelligent Robots and Systems)
- **RSS** (Robotics: Science and Systems)
- **CoRL** (Conference on Robot Learning)
- **Humanoids** (IEEE-RAS International Conference on Humanoid Robots)

## GitHub Repositories

### Essential Repos

```bash
# ROS 2 Examples
git clone https://github.com/ros2/examples.git

# Navigation2
git clone https://github.com/ros-planning/navigation2.git

# MoveIt 2
git clone https://github.com/ros-planning/moveit2.git

# Isaac ROS
git clone https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_common.git

# Awesome Robotics
git clone https://github.com/kiloreux/awesome-robotics.git
```

### Humanoid-Specific

- **Unitree ROS2**: [github.com/unitreerobotics/unitree_ros2](https://github.com/unitreerobotics/unitree_ros2)
- **Humanoid Gym**: [github.com/roboterax/humanoid-gym](https://github.com/roboterax/humanoid-gym)
- **Bipedal Locomotion Framework**: [github.com/ami-iit/bipedal-locomotion-framework](https://github.com/ami-iit/bipedal-locomotion-framework)

## Books

### Recommended Reading

1. **"Modern Robotics"** by Kevin Lynch and Frank Park
   - Topics: Kinematics, dynamics, control
   - Free PDF: [modernrobotics.org](http://modernrobotics.org)

2. **"Probabilistic Robotics"** by Thrun, Burgard, Fox
   - Topics: SLAM, localization, mapping
   - Publisher: MIT Press

3. **"Robotics, Vision and Control"** by Peter Corke
   - Topics: Computer vision, control
   - MATLAB/Python code included

4. **"Deep Learning for Robot Perception and Cognition"** by Lentin Joseph
   - Topics: CNN, RNN for robotics
   - Publisher: Packt

## YouTube Channels

1. **Articulated Robotics**
   - Focus: ROS 2 tutorials
   - Link: [youtube.com/@ArticulatedRobotics](https://youtube.com/@ArticulatedRobotics)

2. **The Construct**
   - Focus: ROS courses, projects
   - Link: [youtube.com/@TheConstruct](https://youtube.com/@TheConstruct)

3. **Boston Dynamics**
   - Focus: Humanoid/quadruped demos
   - Link: [youtube.com/@BostonDynamics](https://youtube.com/@BostonDynamics)

4. **Two Minute Papers**
   - Focus: AI/robotics research summaries
   - Link: [youtube.com/@TwoMinutePapers](https://youtube.com/@TwoMinutePapers)

## Useful Commands Reference

### ROS 2 Quick Reference

```bash
# Node management
ros2 run <package> <executable>
ros2 node list
ros2 node info /node_name

# Topic operations
ros2 topic list
ros2 topic echo /topic_name
ros2 topic hz /topic_name
ros2 topic pub /topic_name <msg_type> "data"

# Service operations
ros2 service list
ros2 service call /service_name <srv_type> "request"

# Parameter operations
ros2 param list
ros2 param get /node_name param_name
ros2 param set /node_name param_name value

# Launch files
ros2 launch <package> <launch_file>

# Build workspace
colcon build
colcon build --packages-select <package>
source install/setup.bash

# Debugging
ros2 doctor
ros2 wtf
```

### Git Commands for Robotics

```bash
# Clone with submodules
git clone --recursive <repo_url>

# Update submodules
git submodule update --init --recursive

# Create feature branch
git checkout -b feature/new-sensor

# Commit with message
git commit -m "feat: add lidar integration"

# Push to remote
git push origin feature/new-sensor
```

## Troubleshooting Resources

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Package 'X' not found` | Missing dependency | `sudo apt install ros-humble-X` |
| `Could not find a package configuration file` | Missing CMake config | Install dev package |
| `DDS communication failed` | Network/firewall | Check `ROS_DOMAIN_ID` |
| `Transform timeout` | Missing TF broadcast | Check `tf2_echo` |

### Diagnostic Tools

```bash
# Check ROS 2 installation
ros2 doctor --report

# Visualize TF tree
ros2 run tf2_tools view_frames

# Monitor system resources
htop
nvidia-smi  # For GPU

# Network debugging
ros2 daemon stop
ros2 daemon start
```

## License Information

Most robotics software uses permissive licenses:

- **Apache 2.0**: ROS 2, Gazebo
- **BSD**: Many robotics libraries
- **MIT**: Lightweight permissive license
- **GPL**: Some older tools (check compatibility)

Always verify license compatibility before commercial use.

## Contributing to Open Source

### How to Contribute

1. **Find a project**: Check "good first issue" labels
2. **Fork the repository**: Create your own copy
3. **Make changes**: Follow project style guide
4. **Test thoroughly**: Run existing tests
5. **Submit PR**: Clear description of changes

### Popular Projects Accepting Contributions

- ROS 2 core packages
- Navigation2
- MoveIt 2
- Gazebo
- Isaac ROS

---

**Keep Learning!** The field of Physical AI is rapidly evolving. Stay updated through conferences, papers, and community forums.
