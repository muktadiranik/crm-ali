## Project Run Process

#### Follow these steps to run this project

1. setup virtualenvn for Windows 
       py -m pip install --user virtualenv
       py -m venv env
       .\env\Scripts\activate
       
 or Linux/Mac
       python3 -m venv env
       source env/bin/activate
 
2. Install Django Package 
       python -m pip install Django
       pip install -r requirements.txt
       
3. go to the `Infinity_CRM` folder
- Copy the environment file `cp .env.example .env`
- Make the secrate key, if they have problem `python3 -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`


Note : Postgres database is used here, first install postgres database, and create a database, then add `DB_NAME` the name or add `DB_PASSWORD` 

4. for migration
       python manage.py makemigrations
       python manage.py migrate 
       
5. Run server
       python manage.py runserver

       
6. Go the jobs folder and run the command `yarn install`
7. Run the react project by command `yarn dev`