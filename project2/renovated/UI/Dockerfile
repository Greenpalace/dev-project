FROM httpd:2.4

COPY UI/ /usr/local/apache2/htdocs

RUN npm install
RUN cd /usr/local/apache2/htdocs
RUN npm install
RUN cd /usr/local/apache2/bin
RUN httpd -k restart