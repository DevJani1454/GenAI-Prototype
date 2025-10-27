import random
import datetime

def get_random_quote():
    quotes = [
        "The future depends on what you do today.",
        "Opportunities don't happen. You create them.",
        "Mistakes are proof that you are trying."
    ]
    return random.choice(quotes)

def get_current_timestamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def create_demo_user():
    return {
        "name": "Demo User",
        "education": "B.Tech",
        "experience": "1 year",
        "skills": ["Python", "SQL"],
        "goals": ["Data Analyst"],
        "interests": ["analytics", "automation"]
    }
