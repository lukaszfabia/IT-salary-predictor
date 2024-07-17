FROM python:3.12

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./api /code/api
COPY ./objects /code/objects

# 
CMD ["fastapi", "run", "api/main.py", "--port", "80"]