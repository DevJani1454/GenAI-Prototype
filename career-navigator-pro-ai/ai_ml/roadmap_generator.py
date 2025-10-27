def generate_roadmap(target_role, months, user_skills):
    # Define realistic skill requirements for each career
    role_skills = {
        "Data Scientist": [
            "Python", "Statistics", "Machine Learning", "SQL",
            "Data Visualization", "Deep Learning", "Model Deployment"
        ],
        "Backend Engineer": [
            "Python", "Node.js", "REST APIs", "Database Design",
            "Authentication", "Cloud Deployment", "Testing"
        ],
        "ML Engineer": [
            "Python", "Machine Learning", "Deep Learning", "MLOps",
            "TensorFlow or PyTorch", "Model Deployment", "APIs"
        ]
    }

    # Best learning resources per skill (real links!)
    learning_resources = {
        "Python": "https://www.coursera.org/learn/python",
        "Statistics": "https://www.khanacademy.org/math/statistics-probability",
        "Machine Learning": "https://www.coursera.org/learn/machine-learning",
        "SQL": "https://www.codecademy.com/learn/learn-sql",
        "Data Visualization": "https://www.datacamp.com/courses/introduction-to-data-visualization-with-python",
        "Deep Learning": "https://www.deeplearning.ai/",
        "Model Deployment": "https://www.fullstackpython.com/deployment.html",
        "Node.js": "https://nodejs.dev/learn",
        "REST APIs": "https://www.restapitutorial.com/",
        "Database Design": "https://www.coursera.org/specializations/database-management",
        "Authentication": "https://auth0.com/docs/get-started/authentication",
        "Cloud Deployment": "https://www.udemy.com/course/aws-deployment/",
        "Testing": "https://www.softwaretestinghelp.com/best-python-testing-frameworks/",
        "MLOps": "https://coursera.org/learn/mlops",
        "TensorFlow or PyTorch": "https://www.coursera.org/learn/deep-neural-networks-with-pytorch",
        "APIs": "https://www.freecodecamp.org/news/how-to-build-an-api/"
    }

    # Fallback for any other career
    needed_skills = role_skills.get(target_role, [
        "Project Management", "Domain Research", "Portfolio Building"
    ])

    # Calculate skill gaps and their learning order
    missing_skills = [skill for skill in needed_skills if skill not in user_skills]
    upskilling_sequence = missing_skills + [s for s in user_skills if s in needed_skills]

    steps = []
    for month in range(months):
        skill = upskilling_sequence[month % len(upskilling_sequence)]
        resource = learning_resources.get(skill, "Find a top-rated course on Coursera, Udemy, or edX")
        if skill in missing_skills:
            desc = (
                f"Month {month + 1}: Learn and practice **{skill}** with "
                f"[this resource]({resource}). Build a mini-project or take a quiz."
            )
        else:
            desc = (
                f"Month {month + 1}: Apply your skills in **{skill}** to real-world projects. "
                "Consider contributing to open-source or creating a demo portfolio project."
            )
        steps.append(desc)
    # Final month: wrap-up
    if months > 1:
        steps[-1] = (
            f"Month {months}: Review all progress. Update your resume, enrich your GitHub, "
            "and do mock interviews for your target role."
        )
    return steps
