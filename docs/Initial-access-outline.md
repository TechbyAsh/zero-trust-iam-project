# Initial-access-outline – PrivateMe (Zero Trust IAM)

## Overview

This document describes the initial **end-to-end access flow** for PrivateMe when synchronizing encrypted user notes using AWS. The flow is designed according to **Zero Trust security principles**, where the mobile application is treated as untrusted and all cloud access is explicitly authorized through IAM roles and short-lived credentials. A final access-flow.md will be provided.

---

## High-Level Access Model

PrivateMe enforces a **client–server–IAM** access pattern:

- The mobile app never accesses AWS services directly
- All cloud interactions are mediated by a trusted backend
- IAM evaluates every request using least-privilege policies
- Access is denied unless explicitly permitted

---

## Actors

| Actor       | Description                                        |
| ----------- | -------------------------------------------------- |
| Mobile App  | React Native client running on an untrusted device |
| Backend API | AWS-hosted service (ECS / EC2)                     |
| IAM         | AWS identity and access control service            |
| STS         | Issues short-lived credentials                     |
| S3          | Encrypted note storage                             |
| CloudTrail  | Audit logging service                              |

---

## Step-by-Step Access Flow

### 1. User Authentication

- User signs in using email/password
- Mobile app receives an authentication token (e.g., JWT or session token)
- No AWS credentials are issued to the client

**Trust Level:** Untrusted client

---

### 2. Encrypted Data Preparation (Client-Side)

- Notes are encrypted locally on the device
- Encryption keys never leave the device
- Encrypted payloads are prepared for sync

**Security Control:** Client-side encryption

---

### 3. API Request Submission

- Mobile app sends an HTTPS request to the backend API
- Request includes:
  - Authentication token
  - Encrypted note payload
- No direct reference to AWS resources exists in the request

**Security Control:** Secure transport (HTTPS)

---

### 4. Backend Request Validation

- Backend validates the authentication token
- Backend enforces authorization rules (user ownership, request validity)
- Invalid or unauthorized requests are rejected

**Trust Level:** Trusted execution environment

---

### 5. IAM Role Assumption (STS)

- Backend runs within AWS (ECS / EC2)
- Backend assumes an IAM role via AWS STS
- STS issues **short-lived credentials** automatically

**Security Control:** Role-based access, no static credentials

---

### 6. IAM Policy Evaluation

IAM evaluates the request using:

- Trust policy (who can assume the role)
- Permission policy (what actions are allowed)
- Explicit deny rules (what is forbidden)

If any deny condition is met, access is blocked.

**Security Control:** Least privilege + explicit deny

---

### 7. Secure S3 Access

- Backend uses temporary credentials to access S3
- Access is limited to:
  - A specific bucket
  - A specific object prefix
- Encrypted note data is stored or retrieved

**Security Control:** Resource-scoped permissions

---

### 8. Audit Logging (CloudTrail)

- CloudTrail records:
  - `AssumeRole` events
  - S3 access attempts
  - Denied actions
- Logs are immutable and centrally stored

**Security Control:** Full auditability

---

### 9. Response to Client

- Backend returns a success or failure response
- Encrypted data is returned when applicable
- No AWS-specific information is exposed to the client

---

## Failure Scenarios & Expected Behavior

| Scenario                 | Expected Result           |
| ------------------------ | ------------------------- |
| Invalid auth token       | Request rejected          |
| Backend role removed     | AWS access denied         |
| Unauthorized S3 path     | Explicit deny triggered   |
| Direct mobile AWS access | Impossible                |
| Expired credentials      | Automatic refresh via STS |

---

## Zero Trust Enforcement Summary

| Layer       | Enforcement               |
| ----------- | ------------------------- |
| Mobile App  | No cloud trust            |
| Backend API | Identity validation       |
| IAM         | Authorization enforcement |
| STS         | Credential lifecycle      |
| S3          | Resource protection       |
| CloudTrail  | Auditing                  |

---

## Key Security Guarantees

- No AWS credentials are exposed to the client
- All credentials are temporary and scoped
- Access is denied by default
- All cloud activity is logged and auditable

---

## Summary

The access flow for PrivateMe demonstrates a **Zero Trust IAM architecture** where all cloud interactions are mediated through trusted AWS execution environments, enforced by role-based access, short-lived credentials, and explicit deny policies. This design ensures secure, auditable, and privacy-preserving synchronization of encrypted user data.
