#!/bin/bash

cd `dirname $0`
. ./env.sh

CUSTOMIZED=./template-org-customized.html
if [ -f $CUSTOMIZED ]; then
	cp -f $CUSTOMIZED $FILE_ORG
else
	cp -f ./template-org.html $FILE_ORG
fi
$EDITOR $FILE_ORG
