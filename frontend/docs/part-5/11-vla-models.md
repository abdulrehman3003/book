---
sidebar_position: 1
---

# Vision-Language-Action (VLA) Models

VLA models combine vision, language understanding, and action generation for robotic control.

## What are VLAs?

VLA models integrate:
- **Vision**: Understanding visual scenes
- **Language**: Natural language commands
- **Action**: Robot control outputs

### Architecture

```
Image → Vision Encoder → Multimodal Fusion ← Language Encoder ← Text
                              ↓
                        Action Decoder
                              ↓
                        Robot Actions
```

## Using LLMs for Robotic Planning

### Example: GPT-4 for Task Planning

```python
import openai

def plan_task(command):
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": """
            You are a robot task planner. Given a command, output:
            1. Subtasks
            2. Required objects
            3. Action sequence
            """},
            {"role": "user", "content": command}
        ]
    )
    return response.choices[0].message.content
```

## Perception → Reasoning → Action Pipelines

### Complete Pipeline

```python
class VLAPipeline:
    def __init__(self):
        self.vision_model = load_vision_model()
        self.llm = load_llm()
        self.action_model = load_action_model()
        
    def execute(self, image, command):
        # 1. Perceive
        scene_description = self.vision_model(image)
        
        # 2. Reason
        plan = self.llm(command, scene_description)
        
        # 3. Act
        actions = self.action_model(plan)
        return actions
```

## State-of-the-Art Models

- **RT-2** (Google): Robotics Transformer with vision-language
- **PaLM-E** (Google): Embodied multimodal LLM
- **CLIP** (OpenAI): Vision-language alignment

## Example: Object Manipulation

```python
# Command: "Pick up the red cup"
image = capture_camera()
objects = detect_objects(image)
red_cup = filter_by_color(objects, "red")
grasp_pose = compute_grasp(red_cup)
execute_grasp(grasp_pose)
```

---

Next: [Cognitive Planning with LLMs](./12-llm-planning.md)
