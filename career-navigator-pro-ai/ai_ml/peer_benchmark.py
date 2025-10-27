import random

def peer_benchmark(user_career, peer_data=None):
    averages = {"Data Scientist": 4.2, "Software Engineer": 3.8, "Product Manager": 5.0}
    avg = averages.get(user_career, 4.0)
    return f"People in your field typically reach their goal in {avg} months."

def motivational_story(user_career):
    stories = [
        "After a gap year, Alex became a Data Scientist at a top company.",
        "Priya switched careers and landed her dream Product Manager role in just a year!"
    ]
    return random.choice(stories)
