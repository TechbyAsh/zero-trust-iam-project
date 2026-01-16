# PrivateMe Backend API

Node.js backend for PrivateMe secure notes app, designed for AWS ECS Fargate deployment.

## Features

- ✅ No hardcoded AWS credentials (uses IAM roles)
- ✅ Handles encrypted note blobs (opaque to backend)
- ✅ Server-side encryption at rest (S3 AES256)
- ✅ Docker containerized
- ✅ Health check endpoint for ECS

## API Endpoints

### GET /health

Health check endpoint for load balancer.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2026-01-09T07:04:00.000Z",
  "uptime": 123.45,
  "environment": "production"
}
```

### POST /notes/upload

Upload encrypted note to S3.

**Request:**

```json
{
  "userId": "user-123",
  "noteId": "note-456",
  "encryptedData": "base64-encoded-encrypted-blob"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Note uploaded successfully",
  "key": "users/user-123/notes/note-456.enc",
  "etag": "\"abc123...\""
}
```

### GET /notes/fetch

Retrieve encrypted note from S3.

**Query Parameters:**

- `userId` (required)
- `noteId` (required)

**Response:**

```json
{
  "success": true,
  "encryptedData": "base64-encoded-encrypted-blob",
  "noteId": "note-456",
  "userId": "user-123"
}
```

## Local Development

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev
```

## Docker Build & Run

```bash
docker build -t privateme-backend .
docker run -p 3000:3000 \
  -e S3_BUCKET_NAME=your-bucket \
  -e AWS_REGION=us-east-1 \
  privateme-backend
```

## AWS ECS Fargate Deployment

### Prerequisites

1. **S3 Bucket**: Create bucket for encrypted notes
2. **ECR Repository**: Push Docker image
3. **IAM Task Role**: Grant S3 permissions
4. **ECS Cluster**: Create Fargate cluster

### IAM Task Role Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::privateme-notes/users/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::privateme-notes"
    }
  ]
}
```

### Deploy Steps

```bash
# 1. Build and tag image
docker build -t privateme-backend .

# 2. Tag for ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag privateme-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/privateme-backend:latest

# 3. Push to ECR
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/privateme-backend:latest

# 4. Create ECS task definition with:
#    - Task role with S3 permissions
#    - Environment variables (S3_BUCKET_NAME, AWS_REGION)
#    - Health check: /health
#    - Port mapping: 3000

# 5. Create ECS service with Application Load Balancer
```

## Environment Variables

| Variable         | Required | Default     | Description    |
| ---------------- | -------- | ----------- | -------------- |
| `PORT`           | No       | 3000        | Server port    |
| `NODE_ENV`       | No       | development | Environment    |
| `S3_BUCKET_NAME` | Yes      | -           | S3 bucket name |
| `AWS_REGION`     | No       | us-east-1   | AWS region     |

## Security Notes

- ✅ Backend never decrypts notes
- ✅ Uses AWS IAM roles (no credentials in code)
- ✅ S3 server-side encryption enabled
- ✅ HTTPS enforced via ALB
- ✅ CORS and Helmet security headers
- ✅ Request size limited to 10MB

## Monitoring

- Health check endpoint: `/health`
- CloudWatch logs automatically captured
- ECS task health checks every 30s

## Testing Locally

```bash
# Start the server
npm start

# Test health endpoint
curl http://localhost:3000/health

# Test upload (requires AWS credentials or IAM role)
curl -X POST http://localhost:3000/notes/upload \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "noteId": "test-note-1",
    "encryptedData": "SGVsbG8gV29ybGQh"
  }'

# Test fetch
curl "http://localhost:3000/notes/fetch?userId=test-user&noteId=test-note-1"
```
