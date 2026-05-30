pipeline {
    agent any

    environment {
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials'
        DOCKER_IMAGE_BACKEND = '19taniya/event-backend'
        DOCKER_IMAGE_FRONTEND = '19taniya/event-frontend'
        DOCKER_IMAGE_AUTH = '19taniya/auth-service'
        DOCKER_IMAGE_EVENT = '19taniya/event-service'
        DOCKER_IMAGE_BOOKING = '19taniya/booking-service'
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

        stage('Build & Push Auth Service Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def authImage = docker.build("${DOCKER_IMAGE_AUTH}:${env.BUILD_ID}", "./auth-service")
                        authImage.push()
                        authImage.push("latest")
                    }
                }
            }
        }

        stage('Build & Push Event Service Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def eventImage = docker.build("${DOCKER_IMAGE_EVENT}:${env.BUILD_ID}", "./event-service")
                        eventImage.push()
                        eventImage.push("latest")
                    }
                }
            }
        }

        stage('Build & Push Booking Service Image') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', "${DOCKER_CREDENTIALS_ID}") {
                        def bookingImage = docker.build("${DOCKER_IMAGE_BOOKING}:${env.BUILD_ID}", "./booking-service")
                        bookingImage.push()
                        bookingImage.push("latest")
                    }
                }
            }
        }
    }
}
