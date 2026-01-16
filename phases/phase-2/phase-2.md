# Phase 2 – IAM Role Design (Zero Trust Core)

## Objective

Design and implement a **Zero Trust IAM model** for the PrivateMe backend that eliminates long-lived credentials and enforces **least privilege** using role-based access and short-lived credentials issued by AWS STS.

This phase establishes **who** can access AWS resources, **what** they can do, and **what is explicitly forbidden**.

---

## Zero Trust IAM Principles Applied

- No IAM users for application access
- No hardcoded or long-lived credentials
- Role-based access only
- Least privilege by default
- Explicit deny as a security guardrail
- Short-lived credentials via AWS STS

---

## Backend Identity Model

### Backend Execution Role

The backend service runs inside AWS ECS and assumes an IAM role that represents its **runtime identity**.

**Role Name**
privateme-backend-role

**Purpose**

- Authenticate the backend to AWS services
- Restrict access to only required resources
- Prevent direct access from untrusted clients

---

## Trust Policy (Who Can Assume the Role)

The trust policy restricts role assumption to ECS tasks only.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}

 Security Outcome

Only ECS tasks can assume the role

IAM users, EC2 instances, and mobile clients are denied

Role assumption uses AWS STS with short-lived credentials


**Permission Policy (What the Role Can Do)**

The permission policy grants minimal access required for encrypted note synchronization.

📄 iam/privateme-backend-execution-role.json


Security Outcome

Only read and write access is granted

Access is restricted to a single bucket and prefix

Destructive or discovery actions are denied by default

---

Explicit Deny Policy (Defense in Depth)

An explicit deny policy is applied to prevent access outside approved paths, even if broader permissions are accidentally added in the future.

📄 iam/explicit-deny-policy.json

 Security Outcome

Explicit deny overrides all allow permissions

Prevents privilege escalation and misconfiguration

Enforces strict path-based access control

---

Role Attachment

Both the allow policy and explicit deny policy are attached to:
'privateme-backend-role'

The role is assigned as the Task Role in the ECS task definition.

---

### STS & Credential Lifecycle

Credentials are issued dynamically by AWS STS

No static credentials are stored or reused

Credentials rotate automatically

Expired credentials are rejected by AWS
```

---

### Summary

Phase 2 establishes the security foundation of the PrivateMe backend by using IAM roles, STS-issued credentials, and explicit deny policies to enforce Zero Trust access controls. This design ensures that only trusted AWS execution environments can access encrypted user data, and only within strictly defined boundaries.
