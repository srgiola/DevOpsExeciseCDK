const { Stack, Construct } = require('aws-cdk-lib');
const { ServerlessConstruct } = require('./serverless-construct');

class DevOpsExeciseCdkStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    // Utiliza el constructo Serverless
    const serverlessResources = new ServerlessConstruct(this, 'ServerlessResources');
  }
}

module.exports = { DevOpsExeciseCdkStack }