pipeline {
    agent any
    environment {
        DOCKERHUB_USERNAME = '59005'
        JFROG_URL = 'trialxaz6ro.jfrog.io'
        FRONTEND_IMAGE_DOCKERHUB = "${DOCKERHUB_USERNAME}/three-tier-app-frontend"
        BACKEND_IMAGE_DOCKERHUB = "${DOCKERHUB_USERNAME}/three-tier-app-backend"
        FRONTEND_IMAGE_JFROG = "${JFROG_URL}/docker-local/three-tier-app-frontend"
        BACKEND_IMAGE_JFROG = "${JFROG_URL}/docker-local/three-tier-app-backend"
        KUBECONFIG = "C:\\Users\\User\\.kube\\config"
        TRIVY = "C:\\ProgramData\\chocolatey\\bin\\trivy.exe"
    }
    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-creds',
                    url: 'https://github.com/rajesh19221/three-tier-app.git',
                    branch: 'main'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    bat "C:\\sonar-scanner\\sonar-scanner-5.0.1.3006-windows\\bin\\sonar-scanner.bat -D\"sonar.projectKey=three-tier-app\" -D\"sonar.sources=.\" -D\"sonar.host.url=http://localhost:9000\" -D\"sonar.login=%SONAR_TOKEN%\""
                }
            }
        }
        stage('Build Frontend') {
            steps {
                bat "docker build -t %FRONTEND_IMAGE_DOCKERHUB%:latest ./frontend"
            }
        }
        stage('Build Backend') {
            steps {
                bat "docker build -t %BACKEND_IMAGE_DOCKERHUB%:latest ./backend"
            }
        }
        stage('Trivy Scan Frontend') {
            steps {
                bat "\"%TRIVY%\" image --exit-code 0 --severity HIGH,CRITICAL --format table %FRONTEND_IMAGE_DOCKERHUB%:latest"
            }
        }
        stage('Trivy Scan Backend') {
            steps {
                bat "\"%TRIVY%\" image --exit-code 0 --severity HIGH,CRITICAL --format table %BACKEND_IMAGE_DOCKERHUB%:latest"
            }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                    bat "docker push %FRONTEND_IMAGE_DOCKERHUB%:latest"
                    bat "docker push %BACKEND_IMAGE_DOCKERHUB%:latest"
                }
            }
        }
        stage('Push to JFrog') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'jfrog-creds',
                    usernameVariable: 'JFROG_USER',
                    passwordVariable: 'JFROG_PASS'
                )]) {
                    bat "docker login %JFROG_URL% -u %JFROG_USER% -p %JFROG_PASS%"
                    bat "docker tag %FRONTEND_IMAGE_DOCKERHUB%:latest %FRONTEND_IMAGE_JFROG%:latest"
                    bat "docker tag %BACKEND_IMAGE_DOCKERHUB%:latest %BACKEND_IMAGE_JFROG%:latest"
                    bat "docker push %FRONTEND_IMAGE_JFROG%:latest"
                    bat "docker push %BACKEND_IMAGE_JFROG%:latest"
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                bat "kubectl apply -f k8s/mongodb.yaml --validate=false --kubeconfig=\"C:\\Users\\User\\.kube\\config\""
                bat "kubectl apply -f k8s/backend.yaml --validate=false --kubeconfig=\"C:\\Users\\User\\.kube\\config\""
                bat "kubectl apply -f k8s/frontend.yaml --validate=false --kubeconfig=\"C:\\Users\\User\\.kube\\config\""
                bat "kubectl apply -f k8s/ingress.yaml --validate=false --kubeconfig=\"C:\\Users\\User\\.kube\\config\""
                bat "kubectl rollout restart deployment/frontend -n three-tier-app --kubeconfig=\"C:\\Users\\User\\.kube\\config\""
                bat "kubectl rollout restart deployment/backend -n three-tier-app --kubeconfig=\"C:\\Users\\User\\.kube\\config\""
            }
        }
    }
    post {
        success {
            echo 'Deployment successful! App running at http://localhost'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
