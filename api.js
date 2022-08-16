const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const helpers = require('./helpers')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamoTableName = 'stars-table-dev';

const createStar = async (event) => {
    try {
        return buildResponse(201, event)

        // const params = {
        //     TableName: dynamoTableName,
        //     Item: event.body
        // }
        //
        // const star = await dynamodb.put(params).promise()

    } catch (e) {
        return buildResponse(400, e)
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
                TableName: dynamoTableName
            }).promise();
        } else {
            allMovieStars = await dynamodb.scan({
                TableName: dynamoTableName,
            }).promise();
        }
        if (allMovieStars['Count'] === 0) {
            return buildResponse(404, "There is no such person")
        }

        return buildResponse(200, allMovieStars)
    } catch (e) {
        return buildResponse(400, e)
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
}

module.exports = {
    createStar,
    getAllStars,
};