FROM buildpack-deps:buster
USER root

#install curl and build tools
RUN apt-get update && apt-get -y install curl

## install lua5.4.4 tutorial: https://www.lua.org/download.html
RUN curl -R http://www.lua.org/ftp/lua-5.4.4.tar.gz -o /tmp/lua-5.4.4.tar.gz && \
    cd /tmp && \
    tar zxf /tmp/lua-5.4.4.tar.gz && \
    cd /tmp/lua-5.4.4 && \
    make all test && \
    make install && \
    cd / && \
    rm -rf /tmp/*

## install python 3.10.11 tutorial: https://computingforgeeks.com/how-to-install-python-on-ubuntu-linux-system/
RUN VERSION=3.10.11 && \
    curl -R https://www.python.org/ftp/python/$VERSION/Python-$VERSION.tgz -o /tmp/Python-$VERSION.tgz && \
    cd /tmp/ && \
    tar -xf Python-$VERSION.tgz && \
    cd Python-3.10.11 && \
    ./configure --enable-optimizations && \
    make -j $(nproc) && \
    make altinstall && \
    cd / && \
    rm -rf /tmp/*

# install rust 1.71.0
# RUN curl -R https://static.rust-lang.org/dist/rust-1.71.0-x86_64-unknown-linux-gnu.tar.gz -o /tmp/rust-1.71.0-x86_64-unknown-linux-gnu.tar.gz && \
#     cd /tmp/ && \
#     tar -xf rust-1.71.0-x86_64-unknown-linux-gnu.tar.gz && \
#     cd rust-1.71.0-x86_64-unknown-linux-gnu && \
#     ./install.sh && \
#     cd / && \
#     rm -rf /tmp/*

# ruby install tutorial https://www.ruby-lang.org/en/documentation/installation/
RUN curl -R https://cache.ruby-lang.org/pub/ruby/3.2/ruby-3.2.2.tar.gz -o /tmp/ruby-3.2.2.tar.gz && \
    cd /tmp/ && \
    tar -xf ruby-3.2.2.tar.gz && \
    cd ruby-3.2.2 && \
    ./configure && \
    make && \
    make install && \
    cd / && \
    rm -rf /tmp/*

# # openjdk install
# RUN curl -R https://download.java.net/java/GA/jdk20.0.1/b4887098932d415489976708ad6d1a4b/9/GPL/openjdk-20.0.1_linux-x64_bin.tar.gz -o /tmp/openjdk-20.0.1_linux-x64_bin.tar.gz && \
#     cd /tmp/ && \
#     tar -xf openjdk-20.0.1_linux-x64_bin.tar.gz && \
#     cd openjdk-20.0.1_linux-x64_bin

# install Isolate
WORKDIR /usr/local/etc/isolate
COPY ./engine/isolate .
RUN mkdir sandboxes
RUN apt-get update && apt-get -y install gcc && apt-get -y install libcap-dev && apt-get install make && apt-get -y install g++
RUN apt-get update && apt-get install -y cgroup-tools
RUN make isolate
ENV PATH="/usr/local/etc/isolate:$PATH"

# install nodeJS
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash
RUN apt-get install -y nodejs
RUN npm install pm2@latest -g
WORKDIR /engine
COPY ./engine/package.json .
RUN npm install
COPY ./engine .
CMD ["npm", "run", "start"]
