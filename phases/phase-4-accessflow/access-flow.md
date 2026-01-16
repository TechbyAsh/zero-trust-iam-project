# Access Flow — Zero Trust Enforcement

## Objective

Document the **end-to-end access flow** for the PrivateMe application and demonstrate how **Zero Trust principles** are enforced at runtime using AWS IAM, STS, and CloudTrail.

This document explains **who accesses what, when, and why**, and where AWS evaluates trust.

---

## Core Zero Trust Principle

> Every request is evaluated independently.  
> Trust is never assumed and is granted only when explicitly allowed.

---

## Actors & Trust Levels

| Actor            | Description          | Trust Level              |
| ---------------- | -------------------- | ------------------------ |
| React Native App | Mobile client        | ❌ Untrusted             |
| Backend API      | ECS application      | ⚠️ Conditionally Trusted |
| AWS STS          | Issues credentials   | ✅ Trusted               |
| IAM              | Authorization engine | ✅ Trusted               |
| Amazon S3        | Encrypted storage    | ✅ Trusted               |
| AWS CloudTrail   | Audit logging        | ✅ Trusted               |

---

## End-to-End Access Flow

---

### 1. Client Request Initiation

**Actor:** React Native Mobile App  
**Trust Level:** Untrusted

- User initiates an action (upload or fetch note)
- Mobile app sends an HTTPS request to the backend API
- Request includes:
  - Application authentication token
  - Encrypted note payload

**Security Enforcement**

- Mobile app has **no AWS credentials**
- Direct access to AWS services is impossible

---

### 2. Backend Authentication & Authorization

**Actor:** Backend API (ECS)

- Backend validates user identity
- Confirms user authorization for the requested resource
- Rejects unauthorized or malformed requests

**Purpose**
IAM enforces infrastructure permissions, not business logic.  
This layer prevents cross-user access.

---

### 3. ECS Task Receives Temporary Credentials

**Actor:** AWS STS

- ECS launches the task with an attached IAM role
- AWS automatically provides:
  - Temporary credentials
  - Scoped permissions
  - Automatic rotation

**Zero Trust Control**

- Credentials are:
  - Short-lived
  - Never hardcoded
  - Never exposed to the client

---

### 4. IAM Policy Evaluation (Zero Trust Core)

When the backend attempts to access Amazon S3, AWS evaluates:

---

#### 4.1 Trust Policy

- Confirms the role can be assumed by ECS
- Verifies the principal is valid

❌ Failure results in immediate denial

---

#### 4.2 Permission Policy

- Validates the requested action:
  - `s3:GetObject`
  - `s3:PutObject`
- Confirms the resource:
  - Correct bucket
  - Correct prefix (`user-uploads/*`)

---

#### 4.3 Explicit Deny Evaluation

- Checks for explicit deny statements
- Explicit denies override all allows

🚨 Any matching deny results in rejection

---

### 5. Access Decision

| Outcome | Result                     |
| ------- | -------------------------- |
| Allowed | S3 operation succeeds      |
| Denied  | AWS returns `AccessDenied` |

- Allowed operations encrypt data using SSE-KMS
- Versioning ensures recoverability
- Denied requests expose no data

---

### 6. Audit Logging

**Actor:** AWS CloudTrail

- Logs all access attempts:
  - Principal ARN
  - Action
  - Resource
  - Outcome
- KMS usage events are recorded

**Purpose**

- Incident response
- Security auditing
- Compliance verification

---

## Zero Trust Enforcement Summary

| Layer   | Control            |
| ------- | ------------------ |
| Client  | No AWS access      |
| Backend | Auth validation    |
| Compute | IAM role only      |
| IAM     | Least privilege    |
| IAM     | Explicit deny      |
| Storage | SSE-KMS encryption |
| Audit   | CloudTrail logging |

---

## Key Takeaways

- No trust is placed in the client
- All AWS access is role-based
- Credentials are temporary and scoped
- Explicit denies prevent privilege escalation
- All actions are auditable

---

## Related Documents

- `docs/threat-model.md`
- `docs/security-principles.md`
- `iam/backend-execution-role.json`
- `iam/explicit-deny-policy.json`
