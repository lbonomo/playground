#!/bin/bash

apt-get update -y
apt-get install apache2 -y
/etc/init.d/apache2 start
