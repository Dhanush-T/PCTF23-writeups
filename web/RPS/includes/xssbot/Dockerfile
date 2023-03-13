FROM python:3.10-slim-bullseye

WORKDIR /usr/src/app

COPY ./requirements.txt .

RUN pip --no-cache-dir install -r requirements.txt

RUN apt-get update && apt-get install -y wget gnupg curl unzip

# Adding trusting keys to apt for repositories
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -

# Adding Google Chrome to the repositories
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

# Updating apt to see and install Google Chrome
RUN apt-get -y update

# Magic happens
RUN apt-get install -y google-chrome-stable

# Download the Chrome Driver
RUN wget -O /tmp/chromedriver.zip http://chromedriver.storage.googleapis.com/109.0.5414.25/chromedriver_linux64.zip

# Unzip the Chrome Driver into /usr/local/bin directory
RUN unzip /tmp/chromedriver.zip chromedriver -d /usr/local/bin/


ENV PYTHONUNBUFFERED=1

COPY script.py .

CMD ["python3", "script.py"]