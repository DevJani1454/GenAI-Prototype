def get_job_trends(role, location):
    sample_trends = {
        "Data Scientist": {"jobs_open": 1200, "avg_salary": 150000, "top_skills": ["Python", "ML", "SQL"]},
        "Backend Engineer": {"jobs_open": 900, "avg_salary": 130000, "top_skills": ["Python", "Node.js", "APIs"]}
    }
    return sample_trends.get(role, {"jobs_open": 100, "avg_salary": 90000, "top_skills": ["Communication", "Adaptability"]})
