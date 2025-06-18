pipeline {
    agent any
    
    environment {
        // Store GitHub credentials in Jenkins Secrets
        GITHUB_CREDS = credentials('github-credentials')
        REPO_URL = 'https://github.com/Eyemusican/DSO101_SE_project.git'
    }
    
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    // Check if commit message contains "@push"
                    def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    echo "Commit message: ${commitMsg}"
                    if (commitMsg.contains("@push")) {
                        echo "✅ Triggering GitHub push automation..."
                        env.SHOULD_PUSH = 'true'
                    } else {
                        echo "❌ Commit message does not contain '@push'. Skipping push."
                        env.SHOULD_PUSH = 'false'
                    }
                }
            }
        }
        
        stage('Checkout') {
            steps {
                git branch: 'main', url: env.REPO_URL
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm install'
                            sh 'npm run build'
                        } else {
                            bat 'npm install'
                            bat 'npm run build'
                        }
                    }
                }
            }
        }
        
        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'npm install'
                        } else {
                            bat 'npm install'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    // Test Backend
                    dir('backend') {
                        if (isUnix()) {
                            sh 'npm test'
                        } else {
                            bat 'npm test'
                        }
                    }
                    
                    // Test Frontend (if tests exist)
                    dir('frontend') {
                        if (isUnix()) {
                            sh 'npm test -- --watchAll=false --coverage'
                        } else {
                            bat 'npm test -- --watchAll=false --coverage'
                        }
                    }
                }
            }
            post {
                always {
                    // Archive test results
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'backend/coverage',
                        reportFiles: 'index.html',
                        reportName: 'Backend Test Coverage Report'
                    ])
                    
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'frontend/coverage',
                        reportFiles: 'index.html',
                        reportName: 'Frontend Test Coverage Report'
                    ])
                }
            }
        }
        
        stage('Push to GitHub') {
            when {
                expression { env.SHOULD_PUSH == 'true' }
            }
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-credentials',
                    usernameVariable: 'GITHUB_USER',
                    passwordVariable: 'GITHUB_TOKEN'
                )]) {
                    script {
                        if (isUnix()) {
                            sh '''
                                git config user.name "${GITHUB_USER}"
                                git config user.email "${GITHUB_USER}@github.com"
                                git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/Eyemusican/DSO101_SE_project.git
                                git add .
                                git commit -m "Jenkins automated push - $(date)" || echo "No changes to commit"
                                git push origin HEAD:main
                            '''
                        } else {
                            bat '''
                                git config user.name "%GITHUB_USER%"
                                git config user.email "%GITHUB_USER%@github.com"
                                git remote set-url origin https://%GITHUB_USER%:%GITHUB_TOKEN%@github.com/Eyemusican/DSO101_SE_project.git
                                git add .
                                git commit -m "Jenkins automated push - %date%" || echo "No changes to commit"
                                git push origin HEAD:main
                            '''
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline completed!'
        }
        success {
            echo '✅ Pipeline executed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}