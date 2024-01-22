#!/bin/bash

# Configure the Subsquid CLI
source .env
sqd auth -k $DEPLOYMENT_KEY
