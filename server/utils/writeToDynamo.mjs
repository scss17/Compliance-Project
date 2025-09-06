/**
 * @file writeToDynamo.mjs
 * @description Utility function to insert questionnaire data into a DynamoDB table.
 *              Each questionnaire section is stored as a separate item using `questionnaireId` and `sectionId` as composite keys.
 * @author Pablo Campos
 * @date 09/02/2025
 */

// Import modules
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromIni } from "@aws-sdk/credential-providers";

// Constants variables from environment
import "dotenv/config";
const { REGION, AWS_PROFILE } = process.env;

/**
 * Writes questionnaire data into a DynamoDB table.
 *
 * @async
 * @function writeToDynamo
 * @param {string} tableName - Name of the DynamoDB table.
 * @param {Object} questionnaireData - Parsed questionnaire JSON object.
 * @throws {Error} If the DynamoDB table does not exist or an unexpected error occurs.
 */

const writeToDynamo = async (tableName, questionnaireData) => {
  // DynamoDB client configuration
  const client = new DynamoDBClient({
    region: REGION,
    credentials: fromIni({ profile: AWS_PROFILE }),
  });
  const docClient = DynamoDBDocumentClient.from(client);

  // Check if the table exists
  const command = new ListTablesCommand({});
  const response = await client.send(command);

  if (!response.TableNames.includes(tableName)) {
    throw new Error(`Table "${tableName}" does not exist`);
  }

  const { questionnaireId, sections } = questionnaireData;
  console.log(`Questionnaire ID: ${questionnaireId}`);
  for (const {
    sectionId,
    sectionTitle,
    sectionDescription,
    sectionType,
    questions,
  } of sections) {
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: {
        questionnaireId,
        sectionId,
        sectionTitle,
        sectionDescription,
        sectionType,
        questions,
      },
      ConditionExpression:
        "attribute_not_exists(questionnaireId) AND attribute_not_exists(sectionId)",
    });

    try {
      await docClient.send(putCommand);
      console.log("Data written to DynamoDB successfully.");
    } catch (error) {
      if (error.name === "ConditionalCheckFailedException") {
        console.log(
          `Item with questionnaireId: ${questionnaireId} and sectionId: ${sectionId} already exists. Skipping.`
        );
      } else {
        console.error("Error writing to DynamoDB:", error);
      }
    }
  }
};

export default writeToDynamo;
