FROM python:slim AS app
COPY ./requirements.txt requirements.txt
RUN pip install -r requirements.txt

FROM pwn.red/jail
COPY --from=app / /srv
COPY nc_decrypt.py /srv/app/run
ENV JAIL_MEM=20M JAIL_ENV_NUM=5 JAIL_TIME=60
