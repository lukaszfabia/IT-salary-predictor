FROM python:3.12

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --upgrade pip

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY ./api /code/api

CMD ["uvicorn", "api.main:api", "--host", "0.0.0.0", "--port", "8000"]