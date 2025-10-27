def life_event_guidance(event, user_context=None):
    if event == "career break":
        return "List your break in your resume honestly. Upskill through fresh certifications before returning."
    if event == "moved to Canada":
        return "Explore region-specific job portals. Update your resume to Canadian format."
    return "Stay positive and reach out to a mentor or community."
