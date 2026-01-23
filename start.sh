#!/bin/bash
python -m venv venv
. venv/Scripts/activate


cd DjangoBackend
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata data.json
python manage.py runserver &

cd ../ViteReadingApp
npm install
npm run dev
