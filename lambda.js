'use strict';

console.log('Loading function');

const aws = require('aws-sdk');
const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const transcoder = new aws.ElasticTranscoder();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Bucket;
    const key = decodeURIComponent(event.Key);
    const criteria = {
        Bucket: bucket,
        Key: key,
    };
    s3.getObject(criteria, (err, data) => {
        if (err) {
            console.log(err);
            const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
            console.log(message);
            callback(message);
        } else {
            console.log('CONTENT TYPE:', data.ContentType);
            var params = {
                Input: {
                    Key: "mov_bbb.ogg",
                    FrameRate: "auto",
                    Resolution: "auto",
                    AspectRatio: "auto",
                    Interlaced: "auto",
                    Container: "mp4"
                },
                Outputs: [{
                    Key: key.replace(/\.[^\.]+$/, '.mp4'),
                    Rotate: "0",
                    PresetId: "1351620000001-000010",
                }],
                PipelineId: "1477114958608-c056k2"
            };
            transcoder.createJob(params, function(err, data) {
                if (err) {
                    console.log(err, err.stack);
                    callback(err.stack);
                } // an error occurred
                else  {
                    console.log(data);
                    callback(null, data.ContentType);
                }
            });
            callback(null, data.ContentType);
        }
    });
};
