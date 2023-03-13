FROM php:7.4-apache

RUN \
["/bin/bash", \
"-c", \
"echo -e '\
ServerName localhost\n \
ServerSignature Off\n \
ServerTokens Prod' >> \
/etc/apache2/apache2.conf" \
]

RUN ln -fs /dev/null /var/log/apache2/access.log

EXPOSE 80