#!/bin/bash

set -x

# Define variables
IMAGE_NAME="my-frontend"
TAG=$(git rev-parse --short HEAD)
PROJECT_ID="unlimitedmarketplace"
REGION="europe-north1"

# Navigate to project directory
cd "$(dirname "$0")/sem3-fe"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${TAG} .

# Tag the Docker image
docker tag ${IMAGE_NAME}:${TAG} gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

# Authenticate with Google Cloud
echo $GCLOUD_SERVICE_KEY | base64 -d > ${HOME}/gcloud-service-key.json
gcloud auth activate-service-account --key-file ${HOME}/gcloud-service-key.json
gcloud auth configure-docker

# Push the Docker image to Google Container Registry
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

# Deploy the image to Google Cloud Run
gcloud run deploy ${IMAGE_NAME} \
  --image gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG} \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated

set +x

