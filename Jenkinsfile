pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE_BACKEND = '19taniya/event-backend'
        DOCKER_IMAGE_FRONTEND = '19taniya/event-frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def backendImage = docker.build("${DOCKER_IMAGE_BACKEND}:${env.BUILD_ID}", "./backend")
                        backendImage.push()
                        backendImage.push("latest")
                    }
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def frontendImage = docker.build("${DOCKER_IMAGE_FRONTEND}:${env.BUILD_ID}", "./frontend")
                        frontendImage.push()
                        frontendImage.push("latest")
                    }
                }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                ansiblePlaybook(
                    playbook: 'deploy.yml',
                    inventory: 'inventory.ini',
                    credentialsId: 'ssh-credentials'
                )
            }
        }
    }
}
