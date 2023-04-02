# React And Django App

CRUD Operations using React for frontend and Django for backend

## Run the Project

Clone the repository

#### Running the Django Project

> Move into server directory (django):
```
cd server
```

> Create virtual environment

- On WindowsOS

```
python -m venv <path to venv>
```

> Activate virtual environment 

- On WindowsOS

- Using bash:
```
source <venv>/Scripts/activate
```

- Using CMD:
```
<venv>\Scripts\activate.bat
```

- Using PowerShell:
```
<venv>\Scripts\Activate.ps1
```

> Install requirements

```
pip install django djangorestframework django-cors-headers
```

> Run migrations:

```
python manage.py makemigrations
```

```
python manage.py migrate
```

> Run on port 8000:

```
python manage.py runserver
```

### Running the ReactJS Project

> Move into client directory (ReactJS)

```
cd client
```

> Install dependencies

```
npm install
```

> Create .env file using .env.sample

> Start the project

```
npm start
```

```
admin account:
```

> user: admin

> password: 1234

```
docker:
```

> To build the images cd go the folder with the docker-compose.yaml file and run: docker-compose up

```
chatbot:
```
> To use the Chatbot, create a file called "secret_key.py" inside the server/api.

>inside it put:

>OPENAI_KEY = "< your openai key >"

>docker-compose up


```
note:
```
This website built as a final project for John Bryce Training. 