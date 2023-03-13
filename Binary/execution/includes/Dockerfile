FROM ubuntu:22.04 AS custom

RUN apt-get update && \
    apt-get install -y libprotobuf-dev libnl-route-3-200 protobuf-compiler && \
    rm -rf /var/lib/apt/lists/

RUN export LD_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/

RUN dpkg --add-architecture i386
RUN apt-get -y update && apt-get -y install -o APT::Immediate-Configure=false libc6:i386 libncurses5:i386 libstdc++6:i386

FROM pwn.red/jail

COPY --from=custom / /srv

ENV JAIL_PIDS=30
ENV JAIL_TIME=60
ENV JAIL_PORT=1337

COPY ./flag.txt /srv/app/
COPY ./execution /srv/app/run

EXPOSE 1337/tcp