#!/bin/bash

cd `dirname $0`
if [ -f ./custom/env.sh ]; then
	source ./custom/env.sh
else
	source ./env.sh
fi

./edits.mjs s $FILE_TMP
