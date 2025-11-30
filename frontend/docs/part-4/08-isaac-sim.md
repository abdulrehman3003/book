---
sidebar_position: 1
---

# NVIDIA Isaac Sim

Isaac Sim is NVIDIA's photorealistic robot simulation platform built on Omniverse.

## Key Features

- **Photorealistic rendering**: RTX ray tracing
- **Physics simulation**: PhysX 5
- **Synthetic data generation**: For AI training
- **ROS 2 integration**: Native support

## Getting Started

### Installation

```bash
# Download from NVIDIA Omniverse
# Install Isaac Sim extension
```

### Basic Scene Setup

```python
from omni.isaac.kit import SimulationApp
simulation_app = SimulationApp({"headless": False})

from omni.isaac.core import World
world = World()
world.scene.add_default_ground_plane()
```

## Photorealistic Simulation

### RTX Rendering

Isaac Sim uses NVIDIA RTX for:
- Real-time ray tracing
- Accurate lighting
- Material properties (PBR)

### Camera Sensors

```python
from omni.isaac.sensor import Camera

camera = Camera(
    prim_path="/World/camera",
    resolution=(1920, 1080),
    frequency=30
)
```

## Synthetic Data Generation

Generate labeled training data:

```python
from omni.replicator.core import Writer

# Generate 1000 images with annotations
for i in range(1000):
    randomize_scene()
    capture_frame()
    save_annotations()  # Bounding boxes, segmentation
```

## Domain Randomization for Sim-to-Real

```python
import omni.replicator.core as rep

with rep.trigger.on_frame(num_frames=100):
    rep.randomizer.color(
        textures=rep.get.prims(semantics=[("class", "object")])
    )
    rep.randomizer.light(
        lights=rep.get.prims(semantics=[("class", "light")])
    )
```

## ROS 2 Bridge

```python
from omni.isaac.core.utils.extensions import enable_extension
enable_extension("omni.isaac.ros2_bridge")

# Publish joint states, camera images, etc.
```

## Use Cases

- Training vision models with synthetic data
- Testing navigation algorithms
- Validating manipulation policies
- Human-robot interaction studies

---

Next: [Isaac ROS](./09-isaac-ros.md)
