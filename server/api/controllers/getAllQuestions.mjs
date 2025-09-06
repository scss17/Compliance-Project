/**
 * @file getAllQuestions.mjs
 * @description AWS Lambda function to scan a DynamoDB table and return questionnaire data.
 *              The function retrieves all items (sections) from a specified DynamoDB table
 *              and includes the questionnaire ID in the response.
 *
 * @author Pablo
 * @date 09/06/2025
 */

// Import modules to run locally with AWS credentials
//! Do not add this code to Lambda functions
import { fromIni } from "@aws-sdk/credential-providers";
import "dotenv/config";

const AWS_PROFILE = process.env.AWS_PROFILE;

// Import modules
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

// Load environment variables
const TABLE_NAME = process.env.TABLE_NAME;
const QUESTIONNAIRE_ID = process.env.QUESTIONNAIRE_ID;
const AWS_REGION = process.env.REGION;

// Initialize DynamoDB client with credentials from AWS profile
const client = new DynamoDBClient({
  region: AWS_REGION,
  credentials: fromIni({ profile: AWS_PROFILE }), //! Do not add this code to Lambda functions
});
const docClient = DynamoDBDocumentClient.from(client);

/**
 * Lambda handler function to fetch questionnaire data from DynamoDB.
 *
 * @async
 * @function handler
 * @param {Object} event - AWS Lambda event object (not used in this implementation).
 * @throws {Error} Returns statusCode 500 with error message if DynamoDB scan fails.
 */
export const handler = async (event) => {
  // Create scan command to retrieve all items from the table
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    // Execute the scan operation
    const response = await docClient.send(command);

    return {
      statusCode: 200,
      body: JSON.stringify({
        questionnaireId: QUESTIONNAIRE_ID,
        sections: response.Items || [],
      }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An unexpected error occurred",
        error: error.message,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};
