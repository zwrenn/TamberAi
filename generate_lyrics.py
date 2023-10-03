import dotenv
import os
import openai
import sys
import json

# Load environment variables from .env file
dotenv.load_dotenv()

# Read OpenAI API key from environment variables
openai.api_key = os.environ.get("OPENAI_API_KEY")


def generate_lyrics(prompt, max_tokens=500, engine="text-davinci-003"):
    full_prompt = f"{prompt}"
    response = openai.Completion.create(
        engine=engine,
        prompt=full_prompt,
        max_tokens=max_tokens
    )
    return response.choices[0].text.strip()


if __name__ == "__main__":
    try:
        prompt = sys.argv[1]
        max_tokens = int(sys.argv[2]) if len(sys.argv) > 2 else 200
        highlighted_lines = json.loads(
            sys.argv[3]) if len(sys.argv) > 3 else {}
        existing_lyrics = sys.argv[4] if len(sys.argv) > 4 else ""
        selected_genre_name = sys.argv[5] if len(sys.argv) > 5 else "Pop"
    except (IndexError, ValueError) as e:
        print(f"Error parsing arguments: {e}")
        sys.exit(1)

    final_lyrics = existing_lyrics  # Start with existing lyrics

    # Include highlighted lines in the prompt
    if highlighted_lines:
        for line in highlighted_lines.values():
            prompt += f"\n{line}"

    # Generate new lyrics
    generated_lyrics = generate_lyrics(prompt, max_tokens)

    # Concatenate existing and generated lyrics
    final_lyrics += "\n" + generated_lyrics

    # print(f"Debug: Final Generated Lyrics:\n{final_lyrics}")
    print(final_lyrics)  # Print only final_lyrics at the end
