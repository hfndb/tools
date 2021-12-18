#!/bin/bash

if [ "`whoami`" != "root" ]
then
	echo "I have to be root"
	exit 1
fi

DIR=`dirname $0`
cd $DIR

apt-get install libnotify-bin xcb zenity

if [ ! -f ./package.json ]; then
	npm init --yes
fi

npm install zx
