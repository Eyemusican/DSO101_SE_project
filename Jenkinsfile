pipeline {
    agent any
    environment {
        // Store GitHub credentials in Jenkins Secrets
        GITHUB_CREDS = credentials('github-credentials')
    }
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    // Check if commit message contains "@push"
                    def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    echo "Commit message: ${commitMsg}"
                    if (commitMsg.contains("@push")) {
                        echo "Triggering GitHub push..."
                    } else {
                        error("Commit message does not contain '@push'. Aborting.")
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                echo "Building the application..."
                script {
                    // Install dependencies for frontend
                    dir('frontend') {
                        sh 'npm install --legacy-peer-deps'
                        sh 'npm run build'
                    }
                    // Install dependencies for backend
                    dir('backend') {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                echo "Running tests..."
                script {
                    // Run frontend tests
                    dir('frontend') {
                        sh 'npm test -- --coverage --watchAll=false'
                    }
                    // Run backend tests
                    dir('backend') {
                        sh 'npm test -- --coverage --watchAll=false'
                    }
                }
            }
            post {
                always {
                    // Publish test results
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Coverage Report'
                    ])
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Backend Coverage Report'
                    ])
                }
            }
        }
        
        stage('Push to GitHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    sh '''
                        git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/Eyemusican/DSO101_SE_project.git
                        git push origin HEAD:main
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed!'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}