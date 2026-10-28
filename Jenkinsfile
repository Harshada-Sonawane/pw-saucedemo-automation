pipeline {
  agent any
  parameters { choice(name: 'ENVIRONMENT', choices: ['qa', 'uat'], description: 'Choose test environment') }
  stages {
    stage('Install') { steps { sh 'npm install && npx playwright install --with-deps chromium' } }
    stage('Run tests') {
      steps {
        script {
          def urls = [qa: 'https://qa.example.com', uat: 'https://uat.example.com']
          def credentials = [qa: 'qa-login', uat: 'uat-login']
          withEnv(["BASE_URL=${urls[params.ENVIRONMENT]}"]) {
            withCredentials([usernamePassword(credentialsId: credentials[params.ENVIRONMENT], usernameVariable: 'TEST_USERNAME', passwordVariable: 'TEST_PASSWORD')]) {
              sh 'npx playwright test'
            }
          }
        }
      }
    }
  }
  post { always { archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true } }
}
