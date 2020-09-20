#!/bin/bash

set -e

zip -r website.zip html 

curl	-H "Content-Type: application/zip" \
	-H "Authorization: Bearer ${NETLIFY_KEY}" \
	--data-binary "@website.zip" \
	https://api.netlify.com/api/v1/sites/nlcm.in/deploys

