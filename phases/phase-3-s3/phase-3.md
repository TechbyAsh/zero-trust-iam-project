# 🛡️ Phase 3 — S3 Secure Access Design

## Phase Objective

Ensure Amazon S3 access is **role-only** and restricted to the trusted backend running in ECS.

This phase enforces Zero Trust by guaranteeing that:

- No public or client-side access to S3 exists
- Only a specific IAM role can read and write objects
- All access is explicitly defined and tightly scoped

---

## Zero Trust Principles Applied

- ❌ No public bucket access
- ❌ No ACL-based permissions
- ❌ No user or client credentials
- ✅ Role-based access only
- ✅ Explicit allow, implicit deny

---

## Actions Taken

### 1. Create a Private S3 Bucket

Created an S3 bucket for storing encrypted user data.

**Security configuration:**

- Block all public access
- Disable ACLs (bucket-owner enforced)
- No public endpoints or policies

This ensures the bucket cannot be accessed anonymously or via legacy permission models.

---

### 2. Apply Bucket Policy (Role-Only Access)

Attached a bucket policy that **explicitly allows access only from the ECS backend IAM role**.

No other principals (users, services, or accounts) are permitted.

#### Bucket Policy

phase-3-s3/bucket-policy.json

---

**Policy Characteristics:**

Scoped to a specific role

Scoped to a specific object path

No wildcard principals

No bucket-level admin access

All other access attempts are implicitly denied.

### 3. Enable Data Protection Controls

Enabled the following native S3 protections:

Versioning

Protects against accidental overwrites or deletions

Server-side encryption

Ensures all objects are encrypted at rest by default

These controls protect data even if access boundaries are misconfigured elsewhere.

## Outcome

Phase 3 establishes a Zero Trust storage layer where Amazon S3:

Is completely private

Accepts requests only from trusted compute

Enforces access through IAM role identity, not credentials

This ensures storage access cannot exist outside the trusted execution environment.

**Note**
To harden this phase I will later use SSE-KMS + Key policy
