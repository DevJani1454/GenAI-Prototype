def personality_to_career(personality_type):
    mapping = {
        'INTJ': "Data Scientist",
        'ENFP': "Product Manager",
        'ISTJ': "Software Engineer",
        'ENTJ': "Startup Founder",
        'INFP': "UX Designer"
    }
    return mapping.get(personality_type, "Generalist")
