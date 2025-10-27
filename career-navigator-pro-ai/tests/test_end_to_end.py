import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from ai_ml import recommend_career, personality_assessment, skill_gap, roadmap_generator, job_market_analytics, peer_benchmark, regret_minimization
from multimodal import resume_parser
from utils import helpers

def run_all_demos():
    user = helpers.create_demo_user()

    print("Career Recommendation:", recommend_career.recommend_career(user['skills'], user['education'], user['interests']))
    print("Personality Assessment:", personality_assessment.personality_to_career('ENFP'))
    print("Skill Gap:", skill_gap.skill_gap(["Python"], ["Python", "ML"]))
    print("Roadmap:", roadmap_generator.generate_roadmap("Data Analyst", 4, user['skills']))
    print("Job Trends:", job_market_analytics.get_job_trends("Data Scientist", "Toronto"))
    print("Peer Benchmark:", peer_benchmark.peer_benchmark("Data Scientist"))
    print("Motivational Story:", peer_benchmark.motivational_story("Product Manager"))
    print("Regret Minimization:", regret_minimization.regret_minimization(["entrepreneurship"], ["public speaking"]))
    print("Resume Skills:", resume_parser.extract_skills_from_resume("Experienced in Python and APIs"))
    print("Motivational Quote:", helpers.get_random_quote())

if __name__ == "__main__":
    run_all_demos()
