# Project 2: Online quiz app


Online address: https://quiz-app-heroku1.herokuapp.com/

How to run locally: write "docker-compose up" in terminal while in the parent folder of the application which contains docker-compose.yml, project.env files and flyway folder. You'll need docker installed on you computer.

How to run tests: 
Open the terminal in the root folder and run the following command: docker-compose run --rm app test --allow-all. You'll need docker installed on you computer.

What the app does:
After signing up or in, users can partake in and create quizzes on different topics using the browser. Alternatively, a user can get a question and answer it using API. If a user has admin rights, he or she can create new topics for quizzes. A simple statistics on the app data is provided at the main page.