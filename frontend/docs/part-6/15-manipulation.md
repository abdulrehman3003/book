---
sidebar_position: 2
---

# Manipulation for Humanoids

Grasping and manipulation with humanoid hands.

## Grasping Pipelines

### 1. Object Detection

```python
from ultralytics import YOLO

model = YOLO('yolov8n.pt')
results = model(image)
objects = results[0].boxes
```

### 2. Grasp Pose Estimation

```python
def compute_grasp_pose(object_bbox, depth_image):
    # Get 3D position from depth
    center_3d = depth_to_3d(object_bbox.center, depth_image)
    
    # Compute approach vector
    approach = np.array([0, 0, -1])  # Top-down grasp
    
    # Create pose
    grasp_pose = create_pose(center_3d, approach)
    return grasp_pose
```

### 3. Motion Planning

```python
from moveit_commander import MoveGroupCommander

def plan_grasp(grasp_pose):
    arm = MoveGroupCommander("arm")
    
    # Pre-grasp pose
    pre_grasp = offset_pose(grasp_pose, z=0.1)
    arm.set_pose_target(pre_grasp)
    arm.go(wait=True)
    
    # Grasp pose
    arm.set_pose_target(grasp_pose)
    arm.go(wait=True)
    
    # Close gripper
    close_gripper()
```

## Hand-Eye Coordination

### Eye-in-Hand Calibration

```python
import cv2

def calibrate_hand_eye(robot_poses, camera_poses):
    # Solve AX = XB
    R, t = cv2.calibrateHandEye(
        R_gripper2base=robot_poses,
        t_gripper2base=robot_poses,
        R_target2cam=camera_poses,
        t_target2cam=camera_poses
    )
    return R, t
```

### Visual Servoing

```python
class VisualServo:
    def __init__(self):
        self.kp = 0.5
        
    def compute_velocity(self, current_image, desired_image):
        # Feature extraction
        current_features = extract_features(current_image)
        desired_features = extract_features(desired_image)
        
        # Error
        error = desired_features - current_features
        
        # Control law
        velocity = self.kp * error
        return velocity
```

## Object Tracking & Interaction

### Kalman Filter for Tracking

```python
import numpy as np

class ObjectTracker:
    def __init__(self):
        self.state = np.zeros(6)  # [x, y, z, vx, vy, vz]
        self.P = np.eye(6)  # Covariance
        
    def predict(self, dt):
        F = np.eye(6)
        F[0:3, 3:6] = np.eye(3) * dt
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + Q
        
    def update(self, measurement):
        H = np.eye(3, 6)
        y = measurement - H @ self.state
        S = H @ self.P @ H.T + R
        K = self.P @ H.T @ np.linalg.inv(S)
        
        self.state = self.state + K @ y
        self.P = (np.eye(6) - K @ H) @ self.P
```

## Force Control

### Impedance Control

```python
def impedance_control(desired_pose, current_pose, 
                     desired_force, measured_force):
    # Position error
    pos_error = desired_pose - current_pose
    
    # Force error
    force_error = desired_force - measured_force
    
    # Impedance law
    M = 1.0  # Virtual mass
    B = 10.0  # Damping
    K = 100.0  # Stiffness
    
    acceleration = (K * pos_error + force_error - B * velocity) / M
    return acceleration
```

## Dexterous Manipulation

### Multi-Fingered Grasping

```python
class DexterousGripper:
    def __init__(self, num_fingers=3):
        self.num_fingers = num_fingers
        
    def compute_contact_forces(self, object_wrench):
        # Grasp matrix
        G = self.build_grasp_matrix()
        
        # Solve for contact forces
        # G^T f = w (object wrench)
        f = np.linalg.lstsq(G.T, object_wrench)[0]
        return f
```

## Practical Tips

1. **Start with simple grasps**: Top-down, parallel jaw
2. **Use force feedback**: Detect contact, prevent damage
3. **Implement failure recovery**: Re-grasp if object slips
4. **Test in simulation first**: Validate before hardware

---

Next: [Capstone Project](../capstone.md)
