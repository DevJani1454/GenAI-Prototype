def career_persona_prompt(user):
    return f"""
    Build a career persona profile for:
    - Education: {user.get('education')}
    - Experience: {user.get('experience')}
    - Skills: {', '.join(user.get('skills', []))}
    - Career Goals: {', '.join(user.get('goals', []))}
    """

def regret_engine_prompt(user):
    return f"""
    The user regrets not following passions like {', '.join(user.get('interests', []))}.
    Suggest positive ways to act on them without major risk.
    """

def roadmap_prompt(user):
    return f"""
    Generate a {user.get('months', 6)}-month roadmap to become a {user.get('target_role')}.
    Skill level: {user.get('skill_level', 'beginner')}.
    """
