# Jenkins Setup Guide for Event Management System

## Quick Start - Jenkins Local Setup

### Prerequisites
- Java 11, 17, or 21 (Jenkins requires these versions)
- Your project repository from GitHub

---

## Method 1: Using Jenkins WAR File (Recommended for Windows)

### Step 1: Download Jenkins
```bash
# Create jenkins folder
mkdir $env:USERPROFILE\jenkins
cd $env:USERPROFILE\jenkins

# Download Jenkins (Stable version)
Invoke-WebRequest -Uri 'https://get.jenkins.io/war-stable/2.462.1/jenkins.war' `
  -OutFile 'jenkins.war'
```

### Step 2: Install Java 21
```bash
# Download Java 21 from:
# https://www.oracle.com/java/technologies/downloads/#java21

# Or use Windows Package Manager:
winget install Oracle.JDK.21
```

### Step 3: Start Jenkins
```bash
cd $env:USERPROFILE\jenkins
java -jar jenkins.war --httpPort=8080
```

### Step 4: Access Jenkins
```
URL: http://localhost:8080
```

You'll see:
```
*************************************************************
*                                                           *
*           Jenkins initial setup is required!             *
*           An admin user has been created and a           *
*           password generated.                            *
*           Please use the following password to           *
*           proceed to installation:                       *
*                                                           *
*           COPY THIS PASSWORD AND PASTE IN BROWSER        *
*                                                           *
*************************************************************
```

---

## Step 5: Configure Jenkins

### 1. Unlock Jenkins
- Copy the password from console
- Paste it in the browser at http://localhost:8080

### 2. Install Plugins
- Click "Install suggested plugins"
- Wait for installation (~5-10 minutes)
- Plugins needed:
  - Pipeline
  - GitHub Integration
  - Docker Pipeline
  - Git

### 3. Create First Admin User
- Username: `admin`
- Password: Choose a strong password
- Email: your-email@example.com

### 4. Jenkins URL Configuration
- Jenkins URL: `http://localhost:8080/`
- Click "Save and Continue"

---

## Step 6: Create Jenkins Pipeline Job

### 1. Create New Item
```
Jenkins Dashboard → New Item
```

### 2. Job Configuration
```
Job Name: Event-Management-Pipeline
Type: Pipeline
```

### 3. Pipeline Configuration
```
Definition: Pipeline script from SCM
SCM: Git
Repository URL: https://github.com/taniyasharma3132/dockerizedevent-management.git
Branch: main
Script Path: Jenkinsfile
```

### 4. Build Triggers
- ✅ GitHub hook trigger for GITScm polling
- ✅ Poll SCM (Optional): `H/15 * * * *` (every 15 minutes)

### 5. Save and Run

---

## Step 7: View Jenkins Pipeline

### Build Dashboard
```
http://localhost:8080/job/Event-Management-Pipeline/
```

### Build History
```
http://localhost:8080/job/Event-Management-Pipeline/builds
```

### Console Output
```
http://localhost:8080/job/Event-Management-Pipeline/[BUILD_NUMBER]/console
```

---

## Your Jenkinsfile Pipeline Stages

Your pipeline will automatically run these stages:

```
✅ Checkout - Clone your GitHub repository
✅ Build & Push Backend Image - Docker image → DockerHub (19taniya/event-backend)
✅ Build & Push Frontend Image - Docker image → DockerHub (19taniya/event-frontend)
✅ Build & Push Auth Service Image - Docker image → DockerHub (19taniya/auth-service)
✅ Build & Push Event Service Image - Docker image → DockerHub (19taniya/event-service)
✅ Build & Push Booking Service Image - Docker image → DockerHub (19taniya/booking-service)
```

---

## Method 2: Using Docker (Alternative)

### Run Jenkins in Docker
```bash
docker run -d -p 8080:8080 -p 50000:50000 `
  -v jenkins_home:/var/jenkins_home `
  -v /var/run/docker.sock:/var/run/docker.sock `
  --name jenkins jenkins/jenkins:latest
```

Then follow **Step 4 onwards** from above.

---

## Webhook Configuration (GitHub → Jenkins Auto-Build)

### 1. Get Jenkins Webhook URL
```
http://localhost:8080/github-webhook/
```

### 2. GitHub Repository Settings
```
GitHub Repo → Settings → Webhooks → Add webhook
```

### 3. Webhook Settings
```
Payload URL: http://[YOUR_IP]:8080/github-webhook/
Content type: application/json
Events: Just the push event
Active: ✅ Checked
```

Now every push to GitHub will automatically trigger Jenkins build!

---

## Troubleshooting

### Jenkins Won't Start
```bash
# Check Java version
java -version

# Must be 11, 17, or 21 (not 24)
# Download Java 21: https://www.oracle.com/java/technologies/downloads/#java21
```

### Build Fails - Docker Not Found
```bash
# Install Docker Desktop:
# https://www.docker.com/products/docker-desktop
```

### DockerHub Credentials Not Found
```
Jenkins → Manage Jenkins → Manage Credentials
→ Add Credentials
→ Docker Hub Username/Password
→ ID: dockerhub-credentials
```

---

## Viewing Build Logs

After starting a build:

1. **Build Page**
   ```
   http://localhost:8080/job/Event-Management-Pipeline/1/
   ```

2. **Console Output** (Real-time logs)
   ```
   http://localhost:8080/job/Event-Management-Pipeline/1/console
   ```

3. **Pipeline View** (Visual stage display)
   ```
   http://localhost:8080/job/Event-Management-Pipeline/1/display/redirect
   ```

---

## Expected Build Output

```
Started by user Admin
Running in Workspace /var/jenkins_home/workspace/Event-Management-Pipeline

[Pipeline] node
[Pipeline] {
[Pipeline] checkout
[Pipeline] {
[Pipeline] checkout scm
[Pipeline] }
[Pipeline] }
[Pipeline] {
[Pipeline] withRegistry
[Pipeline] {
[Pipeline] build
[+] Building 12.5s (15/15) FINISHED
 => [backend stage 1/3]
 ...
[Pipeline] push
latest: digest: sha256:abc123...
[Pipeline] }
[Pipeline] }
```

---

## Summary

Your Jenkins pipeline will:
1. ✅ Pull code from GitHub
2. ✅ Build all Docker images (backend, frontend, auth-service, event-service, booking-service)
3. ✅ Push images to DockerHub
4. ✅ Show real-time logs
5. ✅ Track build history

**Access at:** http://localhost:8080/job/Event-Management-Pipeline/

---

## Next Steps
1. Install Java 21
2. Download Jenkins WAR
3. Start Jenkins
4. Create pipeline job
5. Connect to your GitHub repository
6. Watch builds execute automatically!
