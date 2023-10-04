FROM ubuntu:22.04

## configure for named arguments
ARG pgpwd
ARG pgdatawriterpw
ARG rootpw
ARG dbname

# add lsb_release so we know what linux distro we are on
RUN apt-get update
RUN apt-get install -y lsb-release
RUN apt-get clean all

# add build tools
RUN apt-get update && apt-get install -y build-essential

## Set up APT for Postgres
RUN apt-get update && apt-get install -y wget gnupg2 \
 && sh -c 'echo "deb  http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" >> /etc/apt/sources.list.d/pgdg.list' \
 && wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - \
 && DEBIAN_FRONTEND="noninteractive" TZ="US/Pacific" apt-get -y install tzdata \
 && apt-get update && apt-get install -y software-properties-common \
 && apt-get install -y vim

## Install sudo, curl, and xsel
RUN apt-get install -y sudo curl xsel

## install Postgres
RUN apt-get install -y postgresql-15
RUN apt-get install -y postgresql-client-15 
RUN apt-get install -y postgresql-contrib-15 
RUN apt-get install -y postgresql-server-dev-15
RUN apt-get update
RUN apt-get clean all

## Install git
RUN apt install -y git

## install Postgres pgvector extension
RUN cd /tmp \
 && git clone --branch v0.4.2 https://github.com/pgvector/pgvector.git \
 && cd pgvector \
 && make \
 && make install

 ## copy setup script to container
 COPY setup.pgsql /tmp/setup.pgsql
 RUN chmod 777 /tmp/setup.pgsql

## create two users to access postgres dbs -- a data owner and a data writer
RUN useradd -ms /bin/bash dbadmin \
 && useradd -ms /bin/bash dbwriter \
 && echo dbadmin:${pgpwd} | chpasswd -e || true \
 && echo dbdatawriter:${pgdatawriterpw} | chpasswd -e || true 

## set root pwd
RUN echo root:${rootpw} | chpasswd

## POSTGRES ##
## enable postgres user access to sudo
RUN usermod -aG sudo postgres

## swtich to postgres service account user
USER postgres

## Configure db admin and writer users, initialize a db, and add a dummy table with dummy data
RUN service postgresql start && psql --command "CREATE USER dbadmin WITH SUPERUSER ENCRYPTED PASSWORD '${pgpwd}';" && createdb -O dbadmin ${dbname} \
 && psql --command "CREATE USER dbdatawriter WITH ENCRYPTED PASSWORD '${pgdatawriterpw}';" \
 && psql --command "GRANT ALL PRIVILEGES ON DATABASE ${dbname} TO dbdatawriter;"

RUN service postgresql start && PGPASSWORD=${pgpwd} psql dbadmin -h 127.0.0.1 -d ${dbname} -f /tmp/setup.pgsql

## Configure Postgres network security
RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/15/main/pg_hba.conf \
 && echo "listen_addresses='*'" >> /etc/postgresql/15/main/postgresql.conf

EXPOSE 5432

## Configure postgres to only listen to local
RUN echo "local	all	all		md5" >> /etc/postgresql/15/main/pg_hba.conf

## start postgres when container started
CMD ["/usr/lib/postgresql/15/bin/postgres", "-D", "/var/lib/postgresql/15/main", "-c", "config_file=/etc/postgresql/15/main/postgresql.conf"]
