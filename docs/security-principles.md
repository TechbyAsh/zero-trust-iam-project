# Security Principles – PrivateMe (Zero Trust IAM)

## Overview

This document defines the **core security principles** guiding the design and implementation of PrivateMe’s cloud-backed synchronization features. These principles are based on a **Zero Trust security model**, where no user, device, or request is trusted by default.

All access to cloud resources is explicitly authorized using short-lived IAM roles, least-privilege policies, and auditable controls.

---

## Zero Trust Philosophy

PrivateMe follows the Zero Trust principle of **“never trust, always verify.”**

This means:

- The mobile application is treated as an untrusted client
- Identity and authorization are enforced on every request
- Access is denied unless explicitly allowed
- Security is applied at multiple layers

---

## Core Security Principles

### 1. No Hardcoded or Long-Lived Credentials

- No AWS access keys are embedded in mobile or backend code
- IAM users are not used for application access
- All cloud access uses short-lived credentials issued by AWS STS

**Benefit:** Eliminates the risk of credential leakage through code exposure.

---

### 2. Role-Based Access Only

- All AWS access is granted via IAM roles
- Roles are attached to trusted AWS execution environments (ECS / EC2)
- Permissions are scoped to specific actions and resources

**Benefit:** Prevents direct user or device access to AWS resources.

---

### 3. Least Privilege by Default

- IAM policies grant only the minimum permissions required
- Access is restricted to specific services, buckets, and object prefixes
- Permissions are continuously evaluated by AWS IAM

**Benefit:** Reduces blast radius in the event of compromise.

---

### 4. Explicit Deny Over Implicit Trust

- Explicit deny policies are used to block unintended access
- Deny rules override all allow permissions
- Deny conditions restrict access outside approved resource paths

**Benefit:** Prevents accidental over-permissioning and privilege escalation.

---

### 5. Short-Lived Credentials (STS)

- IAM roles are assumed using AWS Security Token Service (STS)
- Credentials automatically expire and rotate
- No persistent secrets are stored or reused

**Benefit:** Limits exposure window for stolen or compromised credentials.

---

### 6. Separation of Trust Boundaries

- Mobile app: Untrusted
- Backend execution environment: Trusted
- IAM and AWS services: Authoritative security enforcement

**Benefit:** Ensures compromise in one layer does not impact others.

---

### 7. Client-Side Encryption for Sensitive Data

- User notes are encrypted before leaving the device
- The backend never decrypts user content
- Encrypted blobs are treated as opaque data

**Benefit:** Protects user privacy even in the event of backend compromise.

---

### 8. Centralized Audit & Monitoring

- CloudTrail logs all IAM and S3 access events
- Role assumptions and denied actions are recorded
- Logs provide non-repudiation and forensic capability

**Benefit:** Enables detection, investigation, and compliance validation.

---

## Security Enforcement Points

| Layer        | Control                             |
| ------------ | ----------------------------------- |
| Mobile App   | Encryption, authentication          |
| Backend API  | Authorization, request validation   |
| IAM          | Role assumption, policy enforcement |
| AWS Services | Resource-level access control       |
| CloudTrail   | Audit logging                       |

---

## Design Constraints

The following constraints are enforced throughout the project:

- No direct AWS access from the mobile application
- No wildcard permissions on production IAM roles
- No shared roles between unrelated services
- No public access to cloud storage resources

---

## Security Validation

Security controls are validated through:

- IAM policy testing
- Access denial verification
- Role removal failure testing
- CloudTrail event inspection

---

## Summary

PrivateMe’s security architecture is intentionally designed around **Zero Trust principles**, enforcing identity-based access, short-lived credentials, and strict authorization controls. This approach minimizes risk, limits blast radius, and ensures that all cloud access is observable, auditable, and revocable.
