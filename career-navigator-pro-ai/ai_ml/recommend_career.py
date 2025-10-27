def recommend_career(skills, education, interests):
    if "machine learning" in skills and education == "B.Tech" and "research" in interests:
        return "Data Scientist"
    if "JavaScript" in skills and education in {"B.Tech", "B.Sc"} and "design" in interests:
        return "Frontend Developer"
    if "networking" in skills or "security" in skills:
        return "Cybersecurity Analyst"
    return "General IT Professional"
