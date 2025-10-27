import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9\s,]', '', text)
    return text.strip()

def encode_list_to_vector(items, all_items):
    return [1 if item in items else 0 for item in all_items]
