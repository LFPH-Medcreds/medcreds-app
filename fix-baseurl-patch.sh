#!/bin/sh

echo "Setting Upstream: $API_URL"

find /usr/share/nginx/html/_nuxt -type f -name 'app.*' -exec perl -i -pe "s#/api#$API_URL#g" {} \;

