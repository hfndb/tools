#!/bin/bash

cd `dirname $0`
. ./env.sh

LANGUAGE=$1
if [ "$LANGUAGE" == "" ]; then
	LANGUAGE=en
fi

# Extract email from template
sed -n '/@ -->/,/<!-- @/p' $FILE_ORG | \
	# Remove surrouding tags
	sed '/-->/d' | \
	# Remove paragraph counter
	sed '/<ol><li>/d' | \
	sed '/<\/li><li>/d' | \
	sed '/<\/li><\/ol>/d' | \
	# Remove empty lines
	sed '/^$/d' \
	> $FILE_TMP

# Check spell with spell check
aspell -l $LANGUAGE -c $FILE_TMP

# Open temp file in editor
$EDITOR $FILE_TMP
