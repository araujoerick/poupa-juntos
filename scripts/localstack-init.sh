#!/bin/bash
set -e

echo "Initializing LocalStack resources..."

awslocal s3 mb s3://poupa-juntos-receipts
echo "S3 bucket 'poupa-juntos-receipts' created."

awslocal sqs create-queue --queue-name poupa-juntos-contributions
echo "SQS queue 'poupa-juntos-contributions' created."

echo "LocalStack initialization complete."
