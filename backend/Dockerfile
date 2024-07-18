FROM python:3.12

WORKDIR /backend

COPY ./requirements.txt /backend/requirements.txt

RUN pip install --upgrade pip

RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

COPY ./api /backend/api

CMD ["uvicorn", "api.main:api", "--host", "0.0.0.0", "--port", "8000"]