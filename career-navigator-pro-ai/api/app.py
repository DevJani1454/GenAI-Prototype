from fastapi import FastAPI, Body
from ai_ml import (
    recommend_career, personality_assessment, skill_gap,
    roadmap_generator, life_event_guidance, peer_benchmark,
    regret_minimization, job_market_analytics
)
from multimodal import resume_parser

app = FastAPI(title="Career Navigator Pro AI Engine")

@app.post("/recommend")
def recommend(payload: dict = Body(...)):
    return {"career": recommend_career.recommend_career(**payload)}

@app.post("/personality")
def personality(payload: dict = Body(...)):
    return {"career": personality_assessment.personality_to_career(payload['personality'])}

@app.post("/skill-gap")
def skill_gap_analysis(payload: dict = Body(...)):
    return {"missing_skills": skill_gap.skill_gap(payload['user_skills'], payload['target_skills'])}

@app.post("/roadmap")
def gen_roadmap(payload: dict = Body(...)):
    return {"roadmap": roadmap_generator.generate_roadmap(**payload)}

@app.post("/life-guidance")
def event_guidance(payload: dict = Body(...)):
    return {"advice": life_event_guidance.life_event_guidance(**payload)}

@app.post("/peer-benchmark")
def benchmark(payload: dict = Body(...)):
    return {
        "benchmark": peer_benchmark.peer_benchmark(payload['career']),
        "story": peer_benchmark.motivational_story(payload['career'])
    }

@app.post("/regret")
def regret(payload: dict = Body(...)):
    return {"advice": regret_minimization.regret_minimization(payload['interests'], payload['fears'])}

@app.post("/trends")
def job_trend(payload: dict = Body(...)):
    return {"trends": job_market_analytics.get_job_trends(payload['role'], payload['location'])}

@app.post("/resume-parse")
def resume_extract(payload: dict = Body(...)):
    return {"skills": resume_parser.extract_skills_from_resume(payload['text'])}
