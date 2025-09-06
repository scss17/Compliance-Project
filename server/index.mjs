/**
 * @file index.mjs
 * @description Main entry point for the backend application.
 *              Manages reading questionnaire data from a JSON file
 *              and writing it to a DynamoDB table.
 * @author Pablo Campos
 * @date 09/02/2025
 */

// Utility functions
import readQuestionnaireData from "./utils/readQuestionnaireData.mjs";
import writeToDynamo from "./utils/writeToDynamo.mjs";

// Constants variables from environment
import "dotenv/config";
const { QUESTIONNAIRE_ID, TABLE_NAME } = process.env;

try {
  console.log("Starting process...");

  // Read questionnaire data from JSON file
  let questionnaireData = readQuestionnaireData(QUESTIONNAIRE_ID);

  // Write questionnaire data into DynamoDB
  writeToDynamo(TABLE_NAME, questionnaireData);
} catch (error) {
  console.error("An error has occurred:", error);
} finally {
  console.log("Process finished.");
}
