#!/bin/bash

set -x

# Define variables
IMAGE_NAME="my-frontend"
TAG=$(git rev-parse --short HEAD)
PROJECT_ID="unlimitedmarketplace"
REGION="europe-north1"

# Navigate to project directory
cd "$(dirname "$0")"

# Build the Docker image
docker build -t ${IMAGE_NAME}:${TAG} .

# Tag the Docker image
docker tag ${IMAGE_NAME}:${TAG} gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

# Push the Docker image to Google Container Registry
docker push gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG}

# Deploy the image to Google Cloud Run
gcloud run deploy ${IMAGE_NAME} \
  --image gcr.io/${PROJECT_ID}/${IMAGE_NAME}:${TAG} \
  --region ${REGION} \
  --platform managed \
  --allow-unauthenticated

set +ex

