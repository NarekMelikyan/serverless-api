const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const helpers = require('./helpers');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamoTableName = process.env.DYNAMODB_TABLE_NAME;

const getStar = async (event) => {
    try {
        const params = {
            TableName: dynamoTableName,
            Key: {
                "starId": { S: event.pathParameters.starId }
            }
        }

        const star = await dynamodb.get(params).promise();

        return buildResponse(200, {
            ...star,
            starId: event.pathParameters.starId
        });
    } catch (e) {
        return buildResponse(400, e);
    }
}

const createStar = async (event) => {
    try {
        const params = {
            TableName: dynamoTableName,
            Item: JSON.parse(event.body)
        };

        const star = await dynamodb.put(params).promise();

        return buildResponse(201, star);
    } catch (e) {
        return buildResponse(400, e);
    }
};

const getAllStars = async (event) => {
    try {
        let allMovieStars;

        if(event.queryStringParameters) {
            allMovieStars = await dynamodb.scan({
                FilterExpression: helpers.collectFilterExpression(event.queryStringParameters),
                ExpressionAttributeNames: helpers.collectExpressionAttributeNames(event.queryStringParameters),
                ExpressionAttributeValues: helpers.collectExpressionAttributeValues(event.queryStringParameters),
                TableName: dynamoTableName,
            }).promise();
        } else {
            allMovieStars = await dynamodb.scan({
                TableName: dynamoTableName,
            }).promise();
        }

        if (allMovieStars['Count'] === 0) {
            return buildResponse(404, "There is no such person");
        }

        return buildResponse(200, allMovieStars);
    } catch (e) {
        return buildResponse(400, e);
    }
};

const buildResponse = (statusCode, body) => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
};

module.exports = {
    getStar,
    createStar,
    getAllStars,
};