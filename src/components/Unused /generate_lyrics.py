import sys
import openai
import json
import re  # Importing the Regular Expressions library
from openai import Tokenizer

# Initialize
print("Initializing script...")
openai.api_key = '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'
print("API Key Set.")

# Initialize the tokenizer
tokenizer = Tokenizer()

# Function to count tokens


def count_tokens(text):
    tokens = tokenizer.tokenize(text)
    return len(tokens)

# Function to generate lyrics


def generate_lyrics(prompt, max_tokens, engine="text-davinci-003"):
    try:
        response = openai.Completion.create(
            engine=engine,
            prompt=prompt,
            max_tokens=max_tokens
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return ""


# Main function
if __name__ == "__main__":
    prompt = sys.argv[1]
    max_tokens = int(sys.argv[2])
    structure = json.loads(sys.argv[7])  # Parsing the song structure

    # Count tokens in the prompt
    prompt_tokens = count_tokens(prompt)
    remaining_tokens = max_tokens - prompt_tokens

    generated_lyrics = []

    # Tokens allocation (You can adjust these numbers)
    tokens_per_section = {
        'Verse 1': 60,
        'Chorus': 60,
        'Verse 2': 60,
        'Bridge': 60,
        'Outro': 60
    }

    for section in structure:
        allocated_tokens = min(tokens_per_section.get(
            section, 40), remaining_tokens)
        section_prompt = f"{section}:\n"
        section_lyrics = generate_lyrics(section_prompt, allocated_tokens)
        generated_lyrics.append(f"{section}:\n{section_lyrics}")
        remaining_tokens -= allocated_tokens

    # Joining all the sections to form the full lyrics
    full_lyrics = '\n'.join(generated_lyrics)
    print(full_lyrics)
