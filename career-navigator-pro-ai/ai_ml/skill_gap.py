def skill_gap(user_skills, required_skills):
    missing = list(set(required_skills) - set(user_skills))
    return missing
