#!/bin/bash

host=35.247.243.104
port=27017
db=menuOnline
username="api"
password="4J0cknFC8j9*"

mongoexport --host=$host --port=$port --username=$username --password=$password --collection=$1 --db=$db --out=./src/seeds/$1.json