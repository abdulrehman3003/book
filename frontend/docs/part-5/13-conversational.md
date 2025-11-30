---
sidebar_position: 3
---

# Conversational Robotics

Enable natural human-robot interaction through speech and multi-modal communication.

## Speech-to-Text with Whisper

### Setup

```python
import whisper

model = whisper.load_model("base")
result = model.transcribe("audio.mp3")
print(result["text"])
```

### Real-Time Streaming

```python
import pyaudio
import numpy as np

class RealtimeWhisper:
    def __init__(self):
        self.model = whisper.load_model("base")
        self.audio = pyaudio.PyAudio()
        
    def stream_transcribe(self):
        stream = self.audio.open(
            format=pyaudio.paInt16,
            channels=1,
            rate=16000,
            input=True,
            frames_per_buffer=1024
        )
        
        while True:
            audio_chunk = stream.read(1024)
            text = self.transcribe_chunk(audio_chunk)
            yield text
```

## Conversational AI for Robots

### Dialogue Management

```python
class RobotDialogue(Node):
    def __init__(self):
        super().__init__('dialogue')
        self.conversation_history = []
        
    def chat(self, user_input):
        self.conversation_history.append({
            "role": "user",
            "content": user_input
        })
        
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=self.conversation_history
        )
        
        assistant_message = response.choices[0].message.content
        self.conversation_history.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return assistant_message
```

## Multi-Modal Interaction (Speech, Gesture, Vision)

### Gesture Recognition

```python
import mediapipe as mp

class GestureRecognizer:
    def __init__(self):
        self.hands = mp.solutions.hands.Hands()
        
    def recognize(self, image):
        results = self.hands.process(image)
        if results.multi_hand_landmarks:
            # Detect pointing, waving, etc.
            return self.classify_gesture(results)
```

### Fusion System

```python
class MultiModalFusion:
    def __init__(self):
        self.speech = RealtimeWhisper()
        self.gesture = GestureRecognizer()
        self.vision = ObjectDetector()
        
    def process(self, audio, image):
        speech_text = self.speech.transcribe(audio)
        gesture = self.gesture.recognize(image)
        objects = self.vision.detect(image)
        
        # Combine modalities
        if "that" in speech_text and gesture == "pointing":
            target = self.get_pointed_object(gesture, objects)
            return f"User wants {target}"
```

## Text-to-Speech (TTS)

```python
from gtts import gTTS
import pygame

def speak(text):
    tts = gTTS(text=text, lang='en')
    tts.save("response.mp3")
    pygame.mixer.init()
    pygame.mixer.music.load("response.mp3")
    pygame.mixer.music.play()
```

## Example: Interactive Robot Assistant

```python
class RobotAssistant(Node):
    def __init__(self):
        super().__init__('assistant')
        self.whisper = RealtimeWhisper()
        self.dialogue = RobotDialogue()
        
    def run(self):
        while True:
            # Listen
            user_speech = self.whisper.listen()
            
            # Understand
            response = self.dialogue.chat(user_speech)
            
            # Respond
            speak(response)
            
            # Act if needed
            if "bring me" in user_speech:
                self.execute_fetch_task(user_speech)
```

## Challenges

- **Noise robustness**: Background noise affects recognition
- **Latency**: Real-time requirements
- **Context understanding**: Maintaining conversation state
- **Safety**: Confirming critical actions

## Best Practices

1. **Use wake words**: "Hey robot, ..."
2. **Provide feedback**: Visual/audio confirmation
3. **Handle ambiguity**: Ask clarifying questions
4. **Implement timeouts**: Don't wait forever for input

---

Next: [Part VI — Humanoid Robotics](../part-6.md)
