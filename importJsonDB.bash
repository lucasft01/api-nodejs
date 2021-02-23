#!/bin/bash

host=localhost
port=27017
db=test
lista='ls ./src/seeds/collections/*.json'

for collection in $lista; do
  echo $collection
  mongoimport --host=$host --port=$port --collection=$collection --db=$db --file=$collection
done