// Pipeline Name: 02230307_app_pipeline
pipeline {
    agent any
    
    environment {
        // Store GitHub credentials in Jenkins Secrets
        GITHUB_CREDS = credentials('github-credentials')
        NODE_VERSION = '14.16.0'
        NPM_VERSION = '6.14.11'
    }
    
    stages {
        stage('Check Commit Message') {
            steps {
                script {
                    // Check if commit message contains "@push"
                    def commitMsg = sh(returnStdout: true, script: 'git log -1 --pretty=%B').trim()
                    echo "Commit message: ${commitMsg}"
                    if (commitMsg.contains("@push")) {
                        echo "✅ Triggering GitHub push - '@push' found in commit message"
                    } else {
                        error("❌ Commit message does not contain '@push'. Aborting pipeline.")
                    }
                }
            }
        }
        
        stage('Setup Environment') {
            steps {
                script {
                    echo "🔧 Setting up Node.js environment..."
                    // Check Node.js and npm versions
                    sh '''
                        node --version || echo "Node.js not found"
                        npm --version || echo "npm not found"
                    '''
                }
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            echo "📦 Installing backend dependencies..."
                            sh '''
                                npm ci
                                echo "✅ Backend dependencies installed successfully"
                            '''
                        }
                    }
                }
                
                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            echo "📦 Installing frontend dependencies..."
                            sh '''
                                npm ci
                                echo "✅ Frontend dependencies installed successfully"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Lint & Code Quality') {
            parallel {
                stage('Backend Lint') {
                    steps {
                        dir('backend') {
                            echo "🔍 Running backend ESLint..."
                            sh '''
                                npm run eslint-report || true
                                echo "✅ Backend linting completed"
                            '''
                            // Archive the lint report
                            archiveArtifacts artifacts: 'eslint-report.txt', allowEmptyArchive: true
                        }
                    }
                }
                
                stage('Frontend Lint') {
                    steps {
                        dir('frontend') {
                            echo "🔍 Running frontend ESLint..."
                            sh '''
                                npm run eslint-report || true
                                echo "✅ Frontend linting completed"
                            '''
                            // Archive the lint report
                            archiveArtifacts artifacts: 'eslint-report.txt', allowEmptyArchive: true
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Backend Build') {
                    steps {
                        dir('backend') {
                            echo "🏗️ Building backend (TypeScript compilation)..."
                            sh '''
                                npm run build
                                echo "✅ Backend build completed successfully"
                                ls -la build/
                            '''
                        }
                    }
                }
                
                stage('Frontend Build') {
                    steps {
                        dir('frontend') {
                            echo "🏗️ Building frontend (Webpack production build)..."
                            sh '''
                                npm run build
                                echo "✅ Frontend build completed successfully"
                                ls -la dist/ || ls -la build/ || echo "Build directory not found"
                            '''
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                dir('backend') {
                    echo "🧪 Running backend tests with Jest..."
                    sh '''
                        npm run test:coverage
                        echo "✅ Backend tests completed successfully"
                    '''
                    
                    // Archive test coverage reports
                    archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
                    
                    // Publish HTML coverage report
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Backend Test Coverage Report'
                    ])
                }
            }
            post {
                always {
                    // Archive test results even if tests fail
                    archiveArtifacts artifacts: 'backend/coverage/**/*', allowEmptyArchive: true
                }
            }
        }
        
        stage('Docker Build') {
            when {
                // Only run Docker build if Docker files exist
                expression { fileExists('docker-compose-dev.yml') || fileExists('docker-compose-prod.yml') }
            }
            steps {
                echo "🐳 Building Docker images..."
                script {
                    try {
                        sh '''
                            # Check if docker-compose files exist and build accordingly
                            if [ -f "docker-compose-prod.yml" ]; then
                                echo "Building production Docker images..."
                                docker-compose -f docker-compose-prod.yml build --no-cache
                                echo "✅ Production Docker images built successfully"
                            elif [ -f "docker-compose-dev.yml" ]; then
                                echo "Building development Docker images..."
                                docker-compose -f docker-compose-dev.yml build --no-cache
                                echo "✅ Development Docker images built successfully"
                            else
                                echo "No docker-compose files found, skipping Docker build"
                            fi
                        '''
                    } catch (Exception e) {
                        echo "⚠️ Docker build failed: ${e.getMessage()}"
                        echo "Continuing with pipeline..."
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
                    sh '''
                        echo "🚀 Pushing to GitHub..."
                        
                        # Configure git user (required for push)
                        git config user.name "${GITHUB_USER}"
                        git config user.email "${GITHUB_USER}@users.noreply.github.com"
                        
                        # Set remote URL with credentials
                        git remote set-url origin https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/Eyemusican/DSO101_SE_project.git
                        
                        # Push to main branch
                        git push origin HEAD:main
                        
                        echo "✅ Successfully pushed to GitHub!"
                    '''
                }
            }
        }
    }
    
    post {
        always {
            echo "🧹 Cleaning up workspace..."
            // Clean up node_modules to save space (optional)
            sh '''
                echo "Cleaning up node_modules directories..."
                rm -rf backend/node_modules || true
                rm -rf frontend/node_modules || true
                echo "✅ Cleanup completed"
            '''
        }
        success {
            echo "🎉 Pipeline completed successfully!"
            echo "✅ Code has been built, tested, and pushed to GitHub"
        }
        failure {
            echo "❌ Pipeline failed!"
            echo "Please check the logs for details"
        }
        unstable {
            echo "⚠️ Pipeline completed with warnings"
        }
    }
}