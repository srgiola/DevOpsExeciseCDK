#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { DevOpsExeciseCdkStack } = require('../lib/dev_ops_execise_cdk-stack');

const app = new cdk.App();
new DevOpsExeciseCdkStack(app, 'DevOpsExeciseCdkStack', {
});
