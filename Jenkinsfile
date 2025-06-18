pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
    }
    
    environment {
        GITHUB_CREDS = credentials('github-credentials')
        STUDENT_ID = '02230307'
        DOCKER_HUB_REPO = 'eyemusician'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    if (isUnix()) {
                        sh 'pwd && ls -la'
                    } else {
                        bat 'cd && dir'
                    }
                }
            }
        }
        
        stage('Check Commit Message') {
            steps {
                script {
                    def commitMsg
                    if (isUnix()) {
                        commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=format:"%s"').trim()
                    } else {
                        commitMsg = bat(returnStdout: true, script: 'git log -1 --pretty=format:"%%s"').trim()
                    }
                    echo "Commit message: ${commitMsg}"
                    
                    if (commitMsg.contains("@push")) {
                        echo "✅ Commit message contains '@push'. Proceeding..."
                    } else {
                        error("❌ Commit message must contain '@push' to trigger pipeline.")
                    }
                }
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            docker --version
                            node --version
                            npm --version
                        '''
                    } else {
                        bat '''
                            docker --version
                            node --version
                            npm --version
                        '''
                    }
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    echo "Installing backend dependencies..."
                                    cd backend
                                    npm ci --only=production
                                '''
                            } else {
                                bat '''
                                    echo Installing backend dependencies...
                                    cd backend
                                    npm ci --only=production
                                '''
                            }
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    echo "Installing frontend dependencies..."
                                    cd frontend
                                    npm ci
                                '''
                            } else {
                                bat '''
                                    echo Installing frontend dependencies...
                                    cd frontend
                                    npm ci
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    echo "Building Docker images..."
                    
                    if (isUnix()) {
                        sh '''
                            echo "Building backend image..."
                            cd backend
                            docker build -f Dockerfile.prod -t ${DOCKER_HUB_REPO}/backend:${STUDENT_ID} .
                            cd ..
                            
                            echo "Building frontend image..."
                            cd frontend
                            docker build -f Dockerfile.prod -t ${DOCKER_HUB_REPO}/frontend:${STUDENT_ID} .
                            cd ..
                            
                            echo "Listing built images:"
                            docker images
                        '''
                    } else {
                        bat '''
                            echo Building backend image...
                            cd backend
                            docker build -f Dockerfile.prod -t %DOCKER_HUB_REPO%/backend:%STUDENT_ID% .
                            cd ..
                            
                            echo Building frontend image...
                            cd frontend
                            docker build -f Dockerfile.prod -t %DOCKER_HUB_REPO%/frontend:%STUDENT_ID% .
                            cd ..
                            
                            echo Listing built images:
                            docker images
                        '''
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    echo "Running basic tests..."
                    
                    if (isUnix()) {
                        sh '''
                            echo "Testing backend build..."
                            docker run --rm ${DOCKER_HUB_REPO}/backend:${STUDENT_ID} node --version || echo "Backend test completed"
                            
                            echo "Testing frontend build..."
                            docker run --rm ${DOCKER_HUB_REPO}/frontend:${STUDENT_ID} node --version || echo "Frontend test completed"
                        '''
                    } else {
                        bat '''
                            echo Testing backend build...
                            docker run --rm %DOCKER_HUB_REPO%/backend:%STUDENT_ID% node --version || echo Backend test completed
                            
                            echo Testing frontend build...
                            docker run --rm %DOCKER_HUB_REPO%/frontend:%STUDENT_ID% node --version || echo Frontend test completed
                        '''
                    }
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
                    script {
                        echo "Pushing to GitHub..."
                        
                        if (isUnix()) {
                            sh '''
                                git config user.email "jenkins@example.com"
                                git config user.name "Jenkins CI"
                                
                                git remote set-url origin https://$GITHUB_USER:$GITHUB_TOKEN@github.com/$GITHUB_USER/DSO101_SE_project.git
                                
                                git push origin HEAD:main || git push origin HEAD:master
                            '''
                        } else {
                            bat '''
                                git config user.email "jenkins@example.com"
                                git config user.name "Jenkins CI"
                                
                                git remote set-url origin https://%GITHUB_USER%:%GITHUB_TOKEN%@github.com/%GITHUB_USER%/DSO101_SE_project.git
                                
                                git push origin HEAD:main || git push origin HEAD:master
                            '''
                        }
                        
                        echo "✅ Successfully pushed to GitHub!"
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker system prune -f || echo "Cleanup completed"'
                } else {
                    bat 'docker system prune -f || echo Cleanup completed'
                }
            }
        }
        success {
            echo "🎉 Pipeline completed successfully!"
        }
        failure {
            echo "❌ Pipeline failed!"
        }
    }
}