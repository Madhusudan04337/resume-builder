#!/bin/bash
# ==============================================================================
# Auto-Deploy script for MDK Resume AI on Google Cloud Run
# Configures Cloud Run Service bindings & environment variables securely.
# ==============================================================================

# Database Connection Details
PROJECT_ID="${PROJECT_ID:-resume-builder-497808}"
SERVICE_NAME="${SERVICE_NAME:-resume-builder}"
REGION="${REGION:-asia-south1}"
INSTANCE_CONNECTION_NAME="${INSTANCE_CONNECTION_NAME:-future-abode-497817-n6:us-central1:cloud-sql-resume-bulider}"

# Load local environment variables if .env exists
if [ -f .env ]; then
  echo "🔑 Loading configuration from .env..."
  while IFS= read -r line || [ -n "$line" ]; do
    if [[ ! "$line" =~ ^# ]] && [[ "$line" =~ = ]]; then
      key=$(echo "$line" | cut -d'=' -f1 | tr -d '[:space:]')
      val=$(echo "$line" | cut -d'=' -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")
      if [ -z "${!key}" ]; then
        export "$key"="$val"
      fi
    fi
  done < .env
fi

# Database User Credentials & Secrets (with fallbacks if not defined in environment/.env)
DB_USER="${DB_USER:-postgres}"
DB_PASS="${DB_PASS:-yourpassword}"
DB_NAME="${DB_NAME:-resume-builder}"
JWT_SECRET="${JWT_SECRET:-mdk_resume_ai_secure_token_key_2026}"

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ Error: GEMINI_API_KEY is not defined in the environment or in the .env file."
  echo "Please set GEMINI_API_KEY in your .env file before running this script."
  exit 1
fi

echo "================================================================"
echo "🚀 Deploying MDK Resume AI to Google Cloud Run..."
echo "📍 Region: $REGION"
echo "🗄️ Cloud SQL: $INSTANCE_CONNECTION_NAME"
echo "================================================================"

gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --add-cloudsql-instances $INSTANCE_CONNECTION_NAME \
  --set-env-vars CLOUD_SQL_CONNECTION_NAME=$INSTANCE_CONNECTION_NAME,DB_USER=$DB_USER,DB_PASS=$DB_PASS,DB_NAME=$DB_NAME,JWT_SECRET=$JWT_SECRET,GEMINI_API_KEY=$GEMINI_API_KEY

echo "================================================================"
echo "✓ Deployment complete! Your service is fully connected to database."
echo "================================================================"
