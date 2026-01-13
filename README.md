# PrivateMe – Zero Trust Secure Notes Application

**PrivateMe** is a privacy-focused, offline-first mobile notes application designed to demonstrate a **Zero Trust IAM architecture** for cloud-backed mobile applications. The project treats the mobile client as untrusted by default and enforces all cloud access using **short-lived IAM roles, least-privilege policies, and auditable controls** on AWS.

This repository focuses on the **security and cloud architecture** behind PrivateMe rather than application features alone.

---

## 🔐 Security-First Design Philosophy

PrivateMe is built around the principle of **“never trust, always verify.”**

Key security assumptions:

- Mobile applications can be reverse-engineered
- Devices may be compromised or stolen
- Credentials must never be embedded in client code
- Cloud access must be identity-driven and auditable

As a result, the mobile app never accesses AWS services directly.

---

## 🛡️ Zero Trust Architecture Overview

- **Untrusted Client:** React Native mobile app
- **Trusted Execution:** AWS backend (ECS / EC2)
- **Authorization:** IAM roles with STS-issued credentials
- **Storage:** Encrypted objects in Amazon S3
- **Auditing:** AWS CloudTrail

All access is denied by default unless explicitly allowed.

---

## Features

### Current (MVP)

- Offline-first note creation and management
- Client-side encryption of notes
- Secure authentication
- Local storage support
- Clean, responsive UI (light/dark mode)

### Planned (Cloud Sync Phase)

- Secure cloud synchronization via AWS backend
- Role-based access using IAM and STS
- Encrypted note storage in Amazon S3
- Full audit logging with CloudTrail
- Explicit deny IAM policies

---

## Core Security Controls

- No hardcoded or long-lived credentials
- Role-based access only (no IAM users)
- Least privilege IAM policies
- Explicit deny rules to prevent privilege escalation
- Short-lived credentials via AWS STS
- Client-side encryption for sensitive data
- Centralized audit logging

---

## Repository Structure

.
├── iam/ # IAM policies and roles
├── docs/ # Security documentation
│ ├── threat-model.md
│ ├── security-principles.md
│ └── access-flow.md
├── phases/ # Implementation phases
├── diagrams/ # Architecture diagrams
├── mobile/ # React Native application
└── README.md

---

## Security Documentation

This project includes formal security documentation to demonstrate real-world security design practices:

- **Threat Model:** Identifies risks and mitigations
- **Security Principles:** Defines Zero Trust constraints
- **Access Flow:** Documents end-to-end authorization flow
- **IAM Policies:** Shows least-privilege role design

---

## Validation & Testing

Security controls are validated through:

- IAM permission testing
- Explicit deny verification
- Role removal failure testing
- CloudTrail event inspection

---

## Project Goal

The goal of this project is to demonstrate:

- Practical Zero Trust IAM design
- Secure cloud access patterns for mobile apps
- Role-based authorization using AWS
- Security-focused architecture documentation

This project is intentionally designed to be **portfolio-ready** and **interview-friendly**.

---

## Status

**In Progress**  
Currently completing Zero Trust design and IAM implementation phases.

---

## ⚠️ Disclaimer

This project is for educational and portfolio purposes. It does not store or process real user data.
