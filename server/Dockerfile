FROM node:19-slim

# Install dependencies
WORKDIR /usr/app
COPY ./ /usr/app

RUN apt-get update && apt-get install -y alien unzip libaio1 wget && \
	npm install

# Download and install the Oracle Instant Client Basic package
RUN wget -O /tmp/oracle-instantclient-basiclite-linuxx64.rpm https://download.oracle.com/otn_software/linux/instantclient/oracle-instantclient-basiclite-linuxx64.rpm && \
    alien -i /tmp/oracle-instantclient-basiclite-linuxx64.rpm && \
    rm -f /tmp/oracle-instantclient-basiclite-linuxx64.rpm

# Set the environment variable for the library path
ENV ORACLE_HOME=/usr/lib/oracle/21.8/client64
ENV LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME/lib
ENV PATH=$PATH:$ORACLE_HOME/bin

# Copy the BIGIPLinuxClient.tgz file to the image
COPY BIGIPLinuxClient.tgz /tmp/BIGIPLinuxClient.tgz

# Extract the contents of the .tgz file and install the software
RUN tar xvfz /tmp/BIGIPLinuxClient.tgz -C /tmp && \
    dpkg -i /tmp/BIGIPLinuxClient/linux_f5cli.x86_64.deb && \
    rm -f /tmp/BIGIPLinuxClient.tgz /tmp/BIGIPLinuxClient/linux_f5cli.x86_64.deb


# # Copy the rest of your application code
# COPY . /app
# WORKDIR /app


EXPOSE 3001

# Download the root certificate
RUN wget https://zid.univie.ac.at/fileadmin/user_upload/d_zid/zid-open/daten/datennetz/vpn/Linux/SHA-2_Root_USERTrust_RSA_Certification_Authority.crt && \
mv SHA-2_Root_USERTrust_RSA_Certification_Authority.crt /etc/ssl/certs/USERTrust_RSA_Certification_Authority.pem  && \
ln -sf /etc/ssl/certs/USERTrust_RSA_Certification_Authority.pem /etc/ssl/certs/fc5a8f99.0

# Run the "f5fpc" command and the Node.js server
CMD sh start-vpn.sh
