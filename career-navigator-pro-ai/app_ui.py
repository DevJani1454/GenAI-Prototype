import streamlit as st
from ai_ml import (
    recommend_career, personality_assessment, skill_gap,
    roadmap_generator, job_market_analytics, peer_benchmark,
    regret_minimization, life_event_guidance
)
from multimodal import resume_parser
from utils import helpers

st.title("Career Navigator Pro — AI/ML Powered Recommendations")
st.header("Input Your Profile")

skills = st.multiselect(
    "Select your skills:",
    [
        "Python", "JavaScript", "SQL", "Machine Learning", "APIs",
        "Leadership", "Security", "Networking", "Statistics", "Data Visualization",
        "Deep Learning", "Model Deployment", "Node.js", "REST APIs",
        "Database Design", "Authentication", "Cloud Deployment", "Testing"
    ]
)
education = st.selectbox(
    "Choose your education:",
    ["B.Tech", "B.Sc", "M.Tech", "Other"]
)
interests = st.multiselect(
    "Your interests:",
    ["research", "design", "innovation", "analytics", "automation", "entrepreneurship"]
)
personality = st.selectbox(
    "Personality Type:",
    ["INTJ", "ENFP", "ISTJ", "ENTJ", "INFP"]
)
target_role = st.text_input(
    "Target Role (e.g., Data Scientist, Backend Engineer)", "Data Scientist"
)
months = st.slider(
    "Timeline to achieve target (months):", min_value=1, max_value=24, value=6
)
life_event = st.selectbox(
    "Recent Major Life Event:", ["None", "career break", "moved to Canada"]
)
resume_text = st.text_area("Paste your Resume Text Here:")

if st.button("Get Recommendations"):
    st.header("AI/ML Feature Outputs")

    st.subheader("Career Recommendation")
    st.write(recommend_career.recommend_career(skills, education, interests))

    st.subheader("Personality Assessment Career Suggestion")
    st.write(personality_assessment.personality_to_career(personality))

    st.subheader("Skill Gap Analysis (vs Target)")
    if target_role == "Data Scientist":
        target_skills = [
            "Python", "Statistics", "Machine Learning", "SQL",
            "Data Visualization", "Deep Learning", "Model Deployment"
        ]
    elif target_role == "Backend Engineer":
        target_skills = [
            "Python", "Node.js", "REST APIs", "Database Design",
            "Authentication", "Cloud Deployment", "Testing"
        ]
    else:
        target_skills = ["Project Management", "Domain Research", "Portfolio Building"]

    missing = skill_gap.skill_gap(skills, target_skills)
    if missing:
        for m in missing:
            st.markdown(f"- {m}")
    else:
        st.write("No major skill gaps detected!")

    st.subheader("Suggested Roadmap")
    roadmap_steps = roadmap_generator.generate_roadmap(target_role, months, skills)
    for step in roadmap_steps:
        st.markdown(f"- {step}")

    st.subheader("Job Market Analytics")
    job_data = job_market_analytics.get_job_trends(target_role, "Toronto")
    st.markdown(f"**Jobs Open:** {job_data['jobs_open']}")
    st.markdown(f"**Average Salary:** {job_data['avg_salary']}")
    st.markdown("**Top Skills:**")
    for skill in job_data['top_skills']:
        st.markdown(f"- {skill}")

    st.subheader("Peer Benchmark")
    st.write(peer_benchmark.peer_benchmark(target_role))

    st.subheader("Motivational Story")
    st.write(peer_benchmark.motivational_story(target_role))

    st.subheader("Regret Minimization Advice")
    st.write(regret_minimization.regret_minimization(interests, []))

    if resume_text:
        st.subheader("Extracted Resume Skills")
        for s in resume_parser.extract_skills_from_resume(resume_text):
            st.markdown(f"- {s}")

    if life_event != "None":
        st.subheader("Life Event Guidance")
        st.write(life_event_guidance.life_event_guidance(life_event))

    st.subheader("Random Motivational Quote")
    st.write(helpers.get_random_quote())
