---
sidebar_position: 2
---

# Cognitive Planning with LLMs

LLMs can translate natural language into executable robot actions.

## Mapping Natural Language to Robot Actions

### Example: "Clean the room"

```python
def decompose_task(command):
    prompt = f"""
    Task: {command}
    
    Decompose into robot actions:
    1. Navigate to location
    2. Detect objects
    3. Pick up objects
    4. Navigate to trash
    5. Drop objects
    
    Output as JSON.
    """
    return llm(prompt)
```

### Output

```json
{
  "task": "clean_room",
  "steps": [
    {"action": "navigate", "target": "living_room"},
    {"action": "detect", "object_type": "trash"},
    {"action": "pick", "object_id": "obj_1"},
    {"action": "navigate", "target": "trash_bin"},
    {"action": "place", "location": "trash_bin"}
  ]
}
```

## "Clean the room" → ROS 2 Action Graph

### Action Graph Execution

```python
class ActionGraphExecutor(Node):
    def __init__(self):
        super().__init__('action_executor')
        self.navigator = NavigationClient()
        self.manipulator = ManipulationClient()
        
    def execute_graph(self, action_graph):
        for step in action_graph['steps']:
            if step['action'] == 'navigate':
                self.navigator.go_to(step['target'])
            elif step['action'] == 'pick':
                self.manipulator.pick(step['object_id'])
            elif step['action'] == 'place':
                self.manipulator.place(step['location'])
```

## Combining Whisper + GPT + ROS 2

### Complete System

```python
import whisper
import openai
import rclpy

class VoiceControlledRobot(Node):
    def __init__(self):
        super().__init__('voice_robot')
        self.whisper_model = whisper.load_model("base")
        self.executor = ActionGraphExecutor()
        
    def process_voice_command(self, audio_file):
        # 1. Speech to text
        text = self.whisper_model.transcribe(audio_file)["text"]
        
        # 2. LLM planning
        action_graph = self.plan_with_gpt(text)
        
        # 3. Execute
        self.executor.execute_graph(action_graph)
        
    def plan_with_gpt(self, command):
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Robot task planner"},
                {"role": "user", "content": command}
            ]
        )
        return json.loads(response.choices[0].message.content)
```

## Error Handling & Replanning

```python
def execute_with_retry(action_graph):
    for step in action_graph['steps']:
        success = execute_step(step)
        if not success:
            # Ask LLM for alternative
            alternative = replan(step, current_state)
            execute_step(alternative)
```

## Limitations

- **Grounding**: LLMs don't understand physics
- **Safety**: Need verification before execution
- **Latency**: API calls can be slow

## Best Practices

1. **Verify plans**: Check feasibility before execution
2. **Use few-shot examples**: Improve LLM output quality
3. **Implement timeouts**: Prevent infinite loops
4. **Log interactions**: For debugging and improvement

---

Next: [Conversational Robotics](./13-conversational.md)
