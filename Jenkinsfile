pipeline {
    agent any
    environment {
        DOCKERHUB_USERNAME = '59005'
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/three-tier-app-frontend"
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/three-tier-app-backend"
        KUBECONFIG = "C:\\Users\\User\\.kube\\config"
    }
    stages {
        stage('Checkout') {
            steps {
                git credentialsId: 'github-creds',
                    url: 'https://github.com/rajesh19221/three-tier-app.git',
                    branch: 'main'
            }
        }
        stage('Build Frontend') {
            steps {
                bat "docker build -t %FRONTEND_IMAGE%:latest ./frontend"
            }
        }
        stage('Build Backend') {
            steps {
                bat "docker build -t %BACKEND_IMAGE%:latest ./backend"
            }
        }
        stage('Trivy Scan Frontend') {
            steps {
                bat "trivy image --exit-code 0 --severity HIGH,CRITICAL --format table %FRONTEND_IMAGE%:latest"
            }
        }
        stage('Trivy Scan Backend') {
            steps {
                bat "trivy image --exit-code 0 --severity HIGH,CRITICAL --format table %BACKEND_IMAGE%:latest"
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
                    bat "docker push %FRONTEND_IMAGE%:latest"
                    bat "docker push %BACKEND_IMAGE%:latest"
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
