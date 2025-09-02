/**
 * @file readQuestionnaireData.mjs
 * @description Utility function to read and parse a questionnaire JSON file based on a given ID.
 *              The function expects a file with the pattern `questionnaire-{id}.json` under the `data/` directory.
 * @author Pablo Campos
 * @date 09/02/2025
 */

// Import modules
import fs from "fs";
import path from "path";

/**
 * Reads a questionnaire JSON file based on its ID.
 *
 * @function readQuestionnaireData
 * @param {string} questionnaireId - The ID of the questionnaire (e.g., "default", "testing").
 * @returns {Object} Parsed JSON object representing the questionnaire data.
 * @throws {Error} If the file does not exist or cannot be parsed.
 */
const readQuestionnaireData = (questionnaireId) => {
	// Construct the file path
	const wd = process.cwd();
	const filePath = path.join(wd, "data", `questionnaire-${questionnaireId}.json`);

	// Check if the file exists
	if (!fs.existsSync(filePath)) {
		throw new Error(`File does not exist: ${filePath}`);
	}

	// Read the file
	let questionnaireData;
	try {
		questionnaireData = fs.readFileSync(filePath, "utf-8");
		return JSON.parse(questionnaireData);
	} catch (error) {
		throw new Error(`Error parsing questionnaire data from ${filePath}: ${error.message}`);
	}
};

export default readQuestionnaireData;
