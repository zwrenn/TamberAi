import sys
import openai
import os
import json

print("Initializing script...")

# Read OpenAI API key from environment variables
openai.api_key = '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'

print("API Key Set.")

def generate_lyrics(prompt, max_tokens=200, engine="text-davinci-003"):
    print(f"Generating lyrics with prompt: {prompt}, max_tokens: {max_tokens}, engine: {engine}")
    response = openai.Completion.create(
        engine=engine,
        prompt=prompt,
        max_tokens=max_tokens
    )
    print("Lyrics generated.")
    return response.choices[0].text

def generate_iterative_lyrics(existing_lyrics, old_lyrics, max_tokens=200):
    print("Generating iterative lyrics...")
    new_lyrics = []
    old_lyrics_list = old_lyrics.split('\n')
    existing_lyrics_list = existing_lyrics.split('\n')
    
    for line in old_lyrics_list:
        print(f"Processing line: {line}")
        if line in existing_lyrics_list:  # Check if the line is to be kept
            new_lyrics.append(line)
        else:
            prompt = "\n".join(existing_lyrics_list)
            generated_line = generate_lyrics(prompt, max_tokens=20)
            new_lyrics.append(generated_line.strip())
            
    print("Iterative lyrics generated.")
    return '\n'.join(new_lyrics)

def get_language_based_on_genre(genre):
    if genre == "54":
        return "French", "text-davinci-003-fr"
    elif genre == "Schlager":
        return "German", "text-davinci-003-de"
    else:
        return "English", "text-davinci-003"

# Logging: Language and Engine
print(f"Language: {language}, Engine: {engine}")

if __name__ == "__main__":
    # Logging: Script arguments received
    print(f"Python script arguments received: {sys.argv}")
    print("Python script arguments:", sys.argv)
    prompt = sys.argv[1]
    max_tokens = int(sys.argv[2]) if len(sys.argv) > 2 else 200
    highlighted_lines = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
    existing_lyrics = sys.argv[4] if len(sys.argv) > 4 else ""

    if highlighted_lines:
        print("Received highlighted lines:", highlighted_lines)
        highlighted_lines_str = "\n".join(list(highlighted_lines.values()))
        lyrics = generate_iterative_lyrics(existing_lyrics, highlighted_lines_str, max_tokens)
    elif existing_lyrics:
        print("Received existing lyrics:", existing_lyrics)
        lyrics = generate_iterative_lyrics(existing_lyrics, generate_lyrics(prompt, max_tokens), max_tokens)
    else:
        lyrics = generate_lyrics(prompt, max_tokens)
    print("Python Script Args:", sys.argv)
    print("Python Highlighted Lines:", highlighted_lines)
    print("Generated Lyrics:", lyrics)
    print(lyrics)
    print("=== Python Script Ended ===")

