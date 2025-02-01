# import google.auth

# credentials, project = google.auth.default()
# print(credentials, project)

# import os
# import time
# import io
# import pygame
# from google.cloud import speech, translate_v2 as translate, texttospeech
# import pyaudio
# from six.moves import queue

# import google.generativeai as genai

# # Configure Gemini API
# genai.configure(api_key="AIzaSyAyQcDivAKpHJog5NEZqC1NsBjDVGotXss")

# # Audio recording parameters
# RATE = 16000
# CHUNK = int(RATE / 10)  # 100ms

# # Initialize Pygame for playback
# pygame.mixer.init()

# # Language variables (modify as needed)
# ORIGINAL_LANGUAGE = "en-US"  # Input language for speech recognition
# TARGET_LANGUAGE = "hi-IN"    # Target language for translation and TTS

# class MicrophoneStream:
#     def __init__(self, rate, chunk):
#         self.rate = rate
#         self.chunk = chunk
#         self.buff = queue.Queue()
#         self.closed = True

#     def __enter__(self):
#         self.audio_interface = pyaudio.PyAudio()
#         self.audio_stream = self.audio_interface.open(
#             format=pyaudio.paInt16,
#             channels=1,
#             rate=self.rate,
#             input=True,
#             frames_per_buffer=self.chunk,
#             input_device_index=self.get_vb_cable_index(),
#             stream_callback=self._fill_buffer,
#         )
#         self.closed = False
#         return self

#     def __exit__(self, type, value, traceback):
#         self.audio_stream.stop_stream()
#         self.audio_stream.close()
#         self.closed = True
#         self.buff.put(None)
#         self.audio_interface.terminate()

#     def _fill_buffer(self, in_data, frame_count, time_info, status_flags):
#         self.buff.put(in_data)
#         return None, pyaudio.paContinue

#     def generator(self):
#         while not self.closed:
#             chunk = self.buff.get()
#             if chunk is None:
#                 return
#             yield chunk

#     def get_vb_cable_index(self):
#         for i in range(self.audio_interface.get_device_count()):
#             device_info = self.audio_interface.get_device_info_by_index(i)
#             if "VB-Audio Virtual Cable" in device_info.get("name", ""):
#                 return i
#         raise ValueError("VB Cable not found. Ensure it's set up correctly.")

# def translate_text(text, target_language=TARGET_LANGUAGE):
#     """Translates text using Google Cloud Translate API."""
#     translate_client = translate.Client(credentials=credentials)
#     result = translate_client.translate(text, target_language=target_language)
#     return result["translatedText"]

# def synthesize_speech_to_memory(text, language_code=TARGET_LANGUAGE, voice_name=None):
#     """Converts text to speech and returns audio content in memory."""
#     client = texttospeech.TextToSpeechClient(credentials=credentials)
#     input_text = texttospeech.SynthesisInput(text=text)
#     voice = texttospeech.VoiceSelectionParams(
#         language_code=language_code, 
#         name=voice_name or f"{language_code}-Standard-A"  # Default voice
#     )
#     audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)
#     response = client.synthesize_speech(input=input_text, voice=voice, audio_config=audio_config)
#     return io.BytesIO(response.audio_content)

# def play_audio_from_memory(audio_stream):
#     """Streams audio from memory using Pygame."""
#     # Reset the stream pointer to the beginning
#     audio_stream.seek(0)
#     try:
#         pygame.mixer.music.load(audio_stream, "mp3")
#         pygame.mixer.music.play()
#         while pygame.mixer.music.get_busy():
#             continue
#     except pygame.error as e:
#         print(f"Error playing audio: {e}")


# meeting_transcript = []  # Store all spoken text for MoM
# # silence_timeout = 60  # Timeout in seconds for no speech detection

# def listen_print_loop(responses):
#     """Processes and translates speech-to-text responses in real-time."""
#     last_transcript = None  
#     last_speech_time = time.time()

#     for response in responses:
#         if not response.results:
#             continue

#         result = response.results[0]
#         if not result.alternatives:
#             continue

#         transcript = result.alternatives[0].transcript.strip()

#         if transcript.lower() == "exit":
#             print("Exiting...")
#             break

#         if transcript != last_transcript and result.is_final:
#             last_transcript = transcript
#             print(f"Original: {transcript}")

#             # Store transcript for MoM generation
#             meeting_transcript.append(transcript)

#             # Translate the text
#             translated_text = translate_text(transcript)
#             print(f"Translated: {translated_text}")

#             # Convert translated text to speech
#             audio_stream = synthesize_speech_to_memory(translated_text)
#             play_audio_from_memory(audio_stream)
        
#         # if time.time() - last_speech_time > silence_timeout:
#         #     print("\n🔴 No speech detected for 30 seconds. Exiting meeting...\n")
#         #     break  

#     # After the meeting ends, generate MoM
#     generate_meeting_summary(meeting_transcript)

# def generate_meeting_summary(transcript_list):
#     """Sends meeting transcript to Gemini API for MoM generation."""
#     if not transcript_list:
#         print("No transcript available for MoM.")
#         return

#     transcript_text = "\n".join(transcript_list)  # Combine all spoken text

#     prompt = f"""
#     Below is a transcript of a meeting. Summarize the key points, decisions, and action items.
#     Ensure it is structured as formal Minutes of Meeting (MoM):

#     {transcript_text}
#     """

#     model = genai.GenerativeModel("gemini-1.5-flash")
#     response = model.generate_content(prompt)

#     if response.text:
#         summary = response.text.strip()
#         print("\n=== Minutes of Meeting ===\n")
#         print(summary)

#         # Optionally, save the summary to a text file
#         with open("minutes_of_meeting.txt", "w") as file:
#             file.write(summary)
        
#         print("Minutes of Meeting saved successfully!")
#     else:
#         print("Error generating MoM.")


# def main():
#     client = speech.SpeechClient(credentials=credentials)
#     config = speech.RecognitionConfig(
#         encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
#         sample_rate_hertz=RATE,
#         language_code=ORIGINAL_LANGUAGE,  # Input language for speech-to-text
#     )
#     streaming_config = speech.StreamingRecognitionConfig(
#         config=config,
#         interim_results=True,
#     )

#     with MicrophoneStream(RATE, CHUNK) as stream:
#         audio_generator = stream.generator()
#         requests = (speech.StreamingRecognizeRequest(audio_content=chunk) for chunk in audio_generator)

#         responses = client.streaming_recognize(config=streaming_config, requests=requests)
#         listen_print_loop(responses)

# if __name__ == "__main__":
#     main()