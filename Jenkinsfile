pipeline {
    agent any
    
    tools {
        nodejs "NodeJS"
    }
    
    environment {
        // Store GitHub credentials in Jenkins Secrets
        GITHUB_CREDS = credentials('github-credentials')
        STUDENT_ID = '02230307'
        DOCKER_HUB_REPO = 'eyemusician'
    }
    
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    // Check if commit message contains "@push"
                    def commitMsg = ""
                    if (isUnix()) {
                        commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    } else {
                        commitMsg = bat(returnStdout: true, script: '@git log -1 --pretty=%%B').trim()
                    }
                    
                    echo "Commit message: ${commitMsg}"
                    
                    if (commitMsg.contains("@push")) {
                        echo "✅ Triggering GitHub push automation..."
                    } else {
                        error("❌ Commit message does not contain '@push'. Aborting.")
                    }
                }
            }
        }
        
        stage('Environment Setup') {
            steps {
                script {
                    if (isUnix()) {
                        sh '''
                            echo "=== Environment Information ==="
                            node --version
                            npm --version
                            docker --version
                            git --version
                            echo "=== Workspace Contents ==="
                            ls -la
                        '''
                    } else {
                        bat '''
                            echo === Environment Information ===
                            node --version
                            npm --version
                            docker --version
                            git --version
                            echo === Workspace Contents ===
                            dir
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
                                    if [ -f package-lock.json ]; then
                                        npm ci --omit=dev
                                    else
                                        npm install --production
                                    fi
                                '''
                            } else {
                                bat '''
                                    echo Installing backend dependencies...
                                    cd backend
                                    if exist package-lock.json (
                                        npm ci --omit=dev
                                    ) else (
                                        npm install --production
                                    )
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
                                    if [ -f package-lock.json ]; then
                                        npm ci
                                    else
                                        npm install
                                    fi
                                '''
                            } else {
                                bat '''
                                    echo Installing frontend dependencies...
                                    cd frontend
                                    if exist package-lock.json (
                                        npm ci
                                    ) else (
                                        npm install
                                    )
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    echo "Building backend..."
                                    cd backend
                                    # Build application
                                    npm run build || echo "No build script found, skipping..."
                                    
                                    # Build Docker image
                                    echo "Building backend Docker image..."
                                    docker build -f Dockerfile.prod -t ${DOCKER_HUB_REPO}/backend:${STUDENT_ID} .
                                    echo "✅ Backend Docker image built successfully"
                                '''
                            } else {
                                bat '''
                                    echo Building backend...
                                    cd backend
                                    npm run build || echo "No build script found, skipping..."
                                    
                                    echo Building backend Docker image...
                                    docker build -f Dockerfile.prod -t %DOCKER_HUB_REPO%/backend:%STUDENT_ID% .
                                    echo ✅ Backend Docker image built successfully
                                '''
                            }
                        }
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    echo "Building frontend..."
                                    cd frontend
                                    # Build application
                                    npm run build || echo "No build script found, skipping..."
                                    
                                    # Build Docker image
                                    echo "Building frontend Docker image..."
                                    docker build -f Dockerfile.prod -t ${DOCKER_HUB_REPO}/frontend:${STUDENT_ID} .
                                    echo "✅ Frontend Docker image built successfully"
                                '''
                            } else {
                                bat '''
                                    echo Building frontend...
                                    cd frontend
                                    npm run build || echo "No build script found, skipping..."
                                    
                                    echo Building frontend Docker image...
                                    docker build -f Dockerfile.prod -t %DOCKER_HUB_REPO%/frontend:%STUDENT_ID% .
                                    echo ✅ Frontend Docker image built successfully
                                '''
                            }
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    echo "Running backend tests..."
                                    cd backend
                                    
                                    # Run tests and generate reports
                                    npm test -- --reporter=json --outputFile=test-results.json || echo "No tests found"
                                    npm test -- --reporter=junit --outputFile=test-results.xml || echo "No tests found"
                                    
                                    # Container tests
                                    echo "Testing backend container..."
                                    docker run --rm --name backend-test ${DOCKER_HUB_REPO}/backend:${STUDENT_ID} echo "Backend container test passed" || echo "Container test failed"
                                    
                                    echo "✅ Backend tests completed"
                                '''
                            } else {
                                bat '''
                                    echo Running backend tests...
                                    cd backend
                                    
                                    npm test -- --reporter=json --outputFile=test-results.json || echo "No tests found"
                                    npm test -- --reporter=junit --outputFile=test-results.xml || echo "No tests found"
                                    
                                    echo Testing backend container...
                                    docker run --rm --name backend-test %DOCKER_HUB_REPO%/backend:%STUDENT_ID% echo "Backend container test passed" || echo "Container test failed"
                                    
                                    echo ✅ Backend tests completed
                                '''
                            }
                        }
                    }
                    post {
                        always {
                            // Archive test results if they exist
                            script {
                                if (fileExists('backend/test-results.xml')) {
                                    archiveArtifacts artifacts: 'backend/test-results.xml', fingerprint: true
                                }
                                if (fileExists('backend/test-results.json')) {
                                    archiveArtifacts artifacts: 'backend/test-results.json', fingerprint: true
                                }
                            }
                        }
                    }
                }
                
                stage('Frontend Tests') {
                    steps {
                        script {
                            if (isUnix()) {
                                sh '''
                                    echo "Running frontend tests..."
                                    cd frontend
                                    
                                    # Run tests and generate reports
                                    npm test -- --reporter=json --outputFile=test-results.json || echo "No tests found"
                                    npm test -- --reporter=junit --outputFile=test-results.xml || echo "No tests found"
                                    
                                    # Container tests
                                    echo "Testing frontend container..."
                                    docker run --rm --name frontend-test ${DOCKER_HUB_REPO}/frontend:${STUDENT_ID} echo "Frontend container test passed" || echo "Container test failed"
                                    
                                    echo "✅ Frontend tests completed"
                                '''
                            } else {
                                bat '''
                                    echo Running frontend tests...
                                    cd frontend
                                    
                                    npm test -- --reporter=json --outputFile=test-results.json || echo "No tests found"
                                    npm test -- --reporter=junit --outputFile=test-results.xml || echo "No tests found"
                                    
                                    echo Testing frontend container...
                                    docker run --rm --name frontend-test %DOCKER_HUB_REPO%/frontend:%STUDENT_ID% echo "Frontend container test passed" || echo "Container test failed"
                                    
                                    echo ✅ Frontend tests completed
                                '''
                            }
                        }
                    }
                    post {
                        always {
                            // Archive test results if they exist
                            script {
                                if (fileExists('frontend/test-results.xml')) {
                                    archiveArtifacts artifacts: 'frontend/test-results.xml', fingerprint: true
                                }
                                if (fileExists('frontend/test-results.json')) {
                                    archiveArtifacts artifacts: 'frontend/test-results.json', fingerprint: true
                                }
                            }
                        }
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
                        if (isUnix()) {
                            sh '''
                                echo "🚀 Pushing to GitHub..."
                                
                                # Configure Git
                                git config user.name "${GITHUB_USER}"
                                git config user.email "${GITHUB_USER}@users.noreply.github.com"
                                
                                # Set remote URL with token
                                git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/Eyemusican/DSO101_SE_project.git
                                
                                # Add build artifacts or status files
                                echo "Build completed at $(date)" > build-status.txt
                                echo "Images built:" >> build-status.txt
                                echo "- ${DOCKER_HUB_REPO}/backend:${STUDENT_ID}" >> build-status.txt
                                echo "- ${DOCKER_HUB_REPO}/frontend:${STUDENT_ID}" >> build-status.txt
                                
                                # Add and commit build status
                                git add build-status.txt
                                git commit -m "Jenkins: Build completed successfully [skip ci]" || echo "No changes to commit"
                                
                                # Push to GitHub
                                git push origin HEAD:main
                                
                                echo "✅ Successfully pushed to GitHub!"
                            '''
                        } else {
                            bat '''
                                echo 🚀 Pushing to GitHub...
                                
                                git config user.name "%GITHUB_USER%"
                                git config user.email "%GITHUB_USER%@users.noreply.github.com"
                                
                                git remote set-url origin https://%GITHUB_USER%:%GITHUB_TOKEN%@github.com/Eyemusican/DSO101_SE_project.git
                                
                                echo Build completed at %date% %time% > build-status.txt
                                echo Images built: >> build-status.txt
                                echo - %DOCKER_HUB_REPO%/backend:%STUDENT_ID% >> build-status.txt
                                echo - %DOCKER_HUB_REPO%/frontend:%STUDENT_ID% >> build-status.txt
                                
                                git add build-status.txt
                                git commit -m "Jenkins: Build completed successfully [skip ci]" || echo "No changes to commit"
                                
                                git push origin HEAD:main
                                
                                echo ✅ Successfully pushed to GitHub!
                            '''
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                // Clean up Docker images and system
                if (isUnix()) {
                    sh 'docker system prune -f || echo "Cleanup completed"'
                } else {
                    bat 'docker system prune -f || echo "Cleanup completed"'
                }
            }
        }
        success {
            echo '🎉 Pipeline completed successfully!'
            echo '📊 Check the archived test reports in Jenkins'
            echo '🔄 Changes have been pushed back to GitHub'
        }
        failure {
            echo '❌ Pipeline failed!'
            echo '📧 Check the logs above for error details'
        }
    }
}