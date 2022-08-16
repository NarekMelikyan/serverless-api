const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});
const helpers = require('./helpers')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamoTableName = 'movie_stars';
const healthPath = '/health';
const movieStarsPath = '/stars';

const createPost = async (requestBody) => {
    try {
        const params = {
            TableName: dynamoTableName,
            Item: requestBody
        }

        const star = await dynamodb.put(params).promise()

        return buildResponse(201, star)
    } catch (e) {
        return buildResponse(400, e)
    }
};

const getAllPosts = async (event) => {
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
    createPost,
    getAllPosts,
};