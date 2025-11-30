---
sidebar_position: 1
---

# Humanoid Robot Kinematics & Dynamics

Understanding the mathematics of humanoid motion.

## Forward & Inverse Kinematics

### Forward Kinematics

Given joint angles, compute end-effector position:

```python
def forward_kinematics(joint_angles):
    # DH parameters or transformation matrices
    T = np.eye(4)
    for i, theta in enumerate(joint_angles):
        T = T @ dh_transform(theta, d[i], a[i], alpha[i])
    return T[:3, 3]  # Position
```

### Inverse Kinematics

Given desired position, compute joint angles:

```python
from scipy.optimize import minimize

def inverse_kinematics(target_pos, initial_guess):
    def cost(joint_angles):
        current_pos = forward_kinematics(joint_angles)
        return np.linalg.norm(current_pos - target_pos)
    
    result = minimize(cost, initial_guess)
    return result.x
```

## Balance & Locomotion Control

### Zero Moment Point (ZMP)

For stable walking, ZMP must be inside support polygon:

```python
def compute_zmp(com_position, com_acceleration, height):
    g = 9.81
    zmp_x = com_position[0] - (height / g) * com_acceleration[0]
    zmp_y = com_position[1] - (height / g) * com_acceleration[1]
    return np.array([zmp_x, zmp_y])
```

### Center of Mass (CoM) Control

```python
def control_com(desired_com, current_com):
    error = desired_com - current_com
    force = kp * error + kd * com_velocity
    return force
```

## Bipedal Walking Algorithms

### Gait Phases

1. **Double Support**: Both feet on ground
2. **Single Support**: One foot on ground
3. **Swing**: Moving foot forward

### Walking Controller

```python
class BipedalWalker:
    def __init__(self):
        self.phase = "double_support"
        self.step_length = 0.3
        
    def step(self):
        if self.phase == "double_support":
            self.shift_weight()
            self.phase = "single_support"
        elif self.phase == "single_support":
            self.swing_leg()
            self.phase = "double_support"
```

## Dynamics

### Equations of Motion

```python
# M(q)q̈ + C(q,q̇)q̇ + G(q) = τ
def compute_dynamics(q, q_dot, tau):
    M = mass_matrix(q)
    C = coriolis_matrix(q, q_dot)
    G = gravity_vector(q)
    
    q_ddot = np.linalg.inv(M) @ (tau - C @ q_dot - G)
    return q_ddot
```

## Practical Implementation

### Using MoveIt for IK

```python
from moveit_commander import MoveGroupCommander

group = MoveGroupCommander("arm")
pose_target = geometry_msgs.msg.Pose()
pose_target.position.x = 0.5
pose_target.position.y = 0.2
pose_target.position.z = 0.8

group.set_pose_target(pose_target)
plan = group.go(wait=True)
```

---

Next: [Manipulation for Humanoids](./15-manipulation.md)
