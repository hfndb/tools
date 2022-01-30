#!/bin/bash

# Resume writing

cd `dirname $0`
if [ -f ./custom/env.sh ]; then
	source ./custom/env.sh
else
	source ./env.sh
fi

# Open temp file in web browser
$BROWSER $FILE_ORG

# Open temp file in editor
$EDITOR $FILE_ORG
