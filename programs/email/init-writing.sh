#!/bin/bash

# Initizalize writing

cd `dirname $0`
if [ -f ./custom/env.sh ]; then
	source ./custom/env.sh
else
	source ./env.sh
fi

CUSTOMIZED=./custom/template-org.html
if [ -f $CUSTOMIZED ]; then
	cp -f $CUSTOMIZED $FILE_ORG
else
	cp -f ./template-org.html $FILE_ORG
fi

# Open temp file in web browser
$BROWSER $FILE_ORG

# Open temp file in editor
$EDITOR $FILE_ORG
