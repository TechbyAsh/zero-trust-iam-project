# 🛡️ Phase 1 — Backend Compute (Trusted Execution Environment)

## Phase Objective

Create a **trusted backend execution environment** in AWS that is allowed to assume IAM roles.

This backend is the **only component** permitted to access AWS resources.  
The mobile application remains **untrusted and credential-free**.

---

## Zero Trust Principles Applied

- ❌ No AWS credentials in the mobile app
- ❌ No static secrets in source code
- ✅ IAM roles attach only to AWS-managed compute
- ✅ Short-lived credentials issued via STS
- ✅ Clear trust boundary between client and backend

---

## Step Summary

### 1. Backend Execution Model

**Decision:** Use **ECS with Fargate**

**Why:**  
Managed compute, native IAM integration, no server management, strong production relevance.

---

### 2. ECS Cluster (Control Plane)

Created an ECS cluster (`privateme-cluster`) to define a **trusted execution zone** where IAM roles can be safely injected.

This cluster establishes where AWS permissions are allowed to exist.

---

### 3. Minimal Backend Service

Implemented a lightweight backend service with only essential endpoints:

| Endpoint             | Purpose                 |
| -------------------- | ----------------------- |
| `GET /health`        | Service health check    |
| `POST /notes/upload` | Store encrypted data    |
| `GET /notes/fetch`   | Retrieve encrypted data |

Payloads are treated as **opaque encrypted blobs**.  
The backend never decrypts user data.

---

### 4. Credential-Free Application Design

The backend application:

- Uses the AWS SDK **without specifying credentials**
- Relies on ECS task metadata for temporary credentials
- Contains no environment secrets or access keys

This enforces Zero Trust authentication via IAM role assumption.

---

### 5. Containerization

The backend was containerized and pushed to Amazon ECR to ensure:

- Immutable deployments
- Clean execution boundaries
- Compatibility with ECS Fargate

---

### 6. IAM Task Roles (No Permissions Yet)

Created:

- **Task Execution Role** for ECS operations
- **Task Role** for application access to AWS services

At this stage, **no permissions were granted**, enforcing least privilege by default.

---

### 7. ECS Task Definition

Configured a Fargate task definition with:

- Minimal CPU and memory
- Container image from ECR
- Task role attached to the workload

This is where IAM becomes bound to compute.

---

### 8. ECS Service Deployment

Deployed the backend as an ECS service to:

- Maintain availability
- Automatically replace failed tasks
- Keep a single trusted instance running

---

### 9. Validation

Confirmed the trusted execution environment by verifying:

- Service responds successfully
- No AWS credentials exist in environment variables
- AWS access fails if the task role is removed

---

## Outcome

Phase 1 establishes a **secure, trusted backend** capable of assuming IAM roles while keeping the client application fully untrusted.

This foundation enables least-privilege access, short-lived credentials, and strict separation of trust for all subsequent phases.
