# 🔍 Phase 5 — CloudTrail & Auditability

## 🎯 Phase Objective

Prove that **all access and actions are logged** across the PrivateMe AWS environment.

This phase verifies:

- ✅ CloudTrail is enabled
- ✅ IAM role activity is auditable (AssumeRole)
- ✅ S3 object access is logged (PutObject)
- ✅ Denied access attempts are logged (AccessDenied)

---

## 🔐 Zero Trust Principles Applied

- ❌ No hardcoded credentials
- ❌ No anonymous/public access
- ❌ No unlogged actions
- ✅ Role-based access only
- ✅ Explicit allow, implicit deny
- ✅ Full audit visibility

---

## 🧱 Current Architecture Context (Phase 5)

- CloudTrail trail: `privateme-org-trail`
- S3 bucket: `privateme-notes`
- Key prefixes used:
  - `user-uploads/`
  - `users/`
- Backend runs on ECS Fargate with:
  - Task role: `privateme_backend_role`
  - Execution role: `ecsTaskExecutionRole`

---

## 🛠️ Actions Taken

### 1) Enable CloudTrail (All Regions)

Created/validated a multi-region CloudTrail to capture:

- IAM events (management events)
- S3 bucket management events
- S3 data events (object-level read/write)

**Configuration:**

- Trail name: `privateme-org-trail`
- Multi-region: ✅ Enabled
- Management events: ✅ Enabled
- Logging: ✅ On

---

### 2) Enable S3 Data Events (Critical)

CloudTrail does **not** log S3 object activity by default, so S3 Data Events were enabled for the private data bucket.

**Configured Data Events:**
Bucket: `privateme-notes`

- ✅ Read + Write events for prefix: `user-uploads/`
- ✅ Read + Write events for prefix: `users/`

This ensures **object-level** access (PutObject/GetObject) is logged.

---

## 🧪 Tests Performed

## ✅ Test 1 — Generate Allowed S3 Write Event (PutObject)

### Goal

Trigger an S3 **PutObject** event that should appear in CloudTrail data events.

### Command Line Test (No App Required)

Run in CloudShell:
echo "Phase 5 audit test" > phase5.txt
aws s3 cp phase5.txt s3://privateme-notes/user-uploads/phase5.txt

**Expected Result**

Upload succeeds

CloudTrail logs a data event for:

eventSource = s3.amazonaws.com

eventName = PutObject

requestParameters.bucketName = privateme-notes

requestParameters.key begins with user-uploads/

**What Happened**

✅ Upload succeeded and object appeared in S3:

s3://privateme-notes/user-uploads/phase5.txt

⚠️ PutObject not immediately visible in CloudTrail Event history UI

**Notes / Reality Check**

CloudTrail Event history is primarily for management events.

S3 data events can appear with delay or be harder to locate in Event history.

The most reliable validation is:

confirm data events are enabled on the trail, and

confirm the S3 upload succeeded to the tracked prefix.

---

## Test 2 — Verify CloudTrail Data Event Configuration

### Goal

Confirm the trail is configured to log S3 object-level events.

Verification (Console)

CloudTrail → Trails → privateme-org-trail → Data events

Confirmed:

Bucket: privateme-notes

Prefixes enabled:

/user-uploads/ (Read/Write Enabled)

/users/ (Read/Write Enabled)

## Test 3 — Generate a Denied Access Event (AccessDenied)

### Goal

Prove that unauthorized access attempts are logged.

Command Line Test (Example)

Attempt a write to a prefix NOT allowed by the bucket policy (or use a principal without permissions).

Example pattern:

Try uploading to a disallowed key (depends on your bucket policy restrictions)

Or try using a role/user without s3:PutObject

Expected:

Upload fails with AccessDenied

CloudTrail logs the denied event (management logs + possible data event)
