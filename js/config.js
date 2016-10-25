var credentials = new AWS.Credentials('accessKeyIdHere', 'secretAccessKeyHere');

AWS.config.credentials = credentials;
AWS.config.region = 'us-west-2';
AWS.sslEnabled = false;
AWS.maxRetries = 2;
