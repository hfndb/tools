#!/bin/bash

# Initizalize writing

cd `dirname $0`
if [ -f ./custom/env.sh ]; then
	source ./custom/env.sh
else
	source ./env.sh
fi

echo
echo "Continue where you were? (y/n, default y)"
read -p "> " CONTINUE

if [ "$CONTINUE" == "n" ]; then
	# Backup previous email, just to be sure
	cp -f $FILE_ORG $FILE_ORG.bak
	# Prepare next email
	CUSTOMIZED=./custom/template-org.html
	if [ -f $CUSTOMIZED ]; then
		cp -f $CUSTOMIZED $FILE_ORG
	else
		cp -f ./template-org.html $FILE_ORG
	fi
fi

# Open temp file in web browser
$BROWSER $FILE_ORG

# Open temp file in editor
$EDITOR $FILE_ORG
