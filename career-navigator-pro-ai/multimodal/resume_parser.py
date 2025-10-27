def extract_skills_from_resume(text):
    keywords = ["Python", "JavaScript", "SQL", "Machine Learning", "APIs", "Leadership"]
    present = [skill for skill in keywords if skill.lower() in text.lower()]
    return present
