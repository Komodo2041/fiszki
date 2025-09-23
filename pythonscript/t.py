import requests
import json
from deep_translator import GoogleTranslator
import time

# URL do surowego pliku z GitHub
url = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt'

# Pobierz listę słów
response = requests.get(url)
if response.status_code != 200:
    print("Błąd pobierania pliku!")
    exit(1)

words = [line.strip() for line in response.text.splitlines() if line.strip()]
print(f"Pobrano {len(words)} słów.")

# Inicjalizuj tłumacza
translator = GoogleTranslator(source='en', target='pl')

# Lista na wyniki
translations = []

# Tłumacz słowa partiami, aby uniknąć limitów API (po 50 słów przerwa 2s)
batch_size = 50
for i in range(0, len(words), batch_size):
    batch = words[i:i + batch_size]
    for word in batch:
        try:
            # Tłumacz słowo
            polish = translator.translate(word)
            translations.append([word, polish if polish else word])
            print(f"Tłumaczone: {word} -> {polish}")
        except Exception as e:
            print(f"Błąd tłumaczenia '{word}': {e}")
            translations.append([word, ""])  # Puste tłumaczenie w razie błędu
    
    # Przerwa między partiami
    if i + batch_size < len(words):
        time.sleep(2)

# Zapisz do JSON
with open('english_polish_words.json', 'w', encoding='utf-8') as f:
    json.dump(translations, f, ensure_ascii=False, indent=2)

print("Plik 'english_polish_words.json' został utworzony pomyślnie!")