/**
 * @file calculateResults.mjs
 * @description Utility function to calculate and aggregate results from questionnaire responses.
 *              The calculation applies section-specific weights (defined externally) to generate
 *              normalized overall results. Each section’s score is computed as a percentage
 *              of correctly answered questions and then combined using weighted averages.
 * @author Pablo Campos
 * @date 09/02/2025
 */

// Import modules
import readQuestionnaireData from "./readQuestionnaireData.mjs";

// Constants variables from environment
import "dotenv/config";
const { TEST_RESPONSES } = process.env;

/**
 * Calculates questionnaire results by scoring answers within each section
 * and applying section-level weights to produce aggregated overall results.
 *
 * @function calculateResults
 * @param {Object} questionnaireResponses - The questionnaire data, including all responses.
 * @param {Object<string, number>} weights - A mapping of section types to their respective weights. All weights must sum to exactly `1.0`.
 * @returns {Object} Updated questionnaire responses with calculated results.
 * @throws {Error} If inputs are invalid or weights do not sum to 1.
 */

const calculateResults = (questionnaireResponses, weights) => {
  if (!questionnaireResponses) {
    throw new Error("No questionnaire responses provided");
  }

  if (!weights) {
    throw new Error("No weights provided");
  }

  // Validate that all weights sum to exactly 1
  const totalWeight = Object.values(weights).reduce((acc, w) => acc + w, 0);
  if (totalWeight !== 1) {
    throw new Error("Weights must sum to 1");
  }

  // Aggregators for section scores
  const overallResults = {};
  const sectionCounts = {};

  // Map over responses and calculate section results
  const updatedResults = questionnaireResponses?.responses.map(
    ({ sectionId, sectionType, answers }) => {
      let score = 0;
      let questionsInSection = answers.length;

      answers.forEach((answer) => {
        if (answer.answer === "Sí") score += 1;
      });

      // Calculate score as percentage of 10
      const sectionScore = (score / questionsInSection) * 10;

      // Init dynamic keys
      if (!overallResults[sectionType]) overallResults[sectionType] = 0;
      if (!sectionCounts[sectionType]) sectionCounts[sectionType] = 0;

      overallResults[sectionType] += sectionScore;
      sectionCounts[sectionType] += 1;

      return {
        sectionId,
        sectionType,
        answers,
        result: sectionScore,
      };
    }
  );

  // Average results per type
  Object.keys(overallResults).forEach((type) => {
    if (sectionCounts[type] > 0) {
      overallResults[type] =
        (overallResults[type] / sectionCounts[type]) * weights[type];
    } else {
      overallResults[type] = 0;
    }
  });

  return {
    ...questionnaireResponses,
    responses: updatedResults,
    overallResults,
  };
};

export default calculateResults;

/* -------------------------------------------------------------------------- */
/*                              Example Execution                             */
/* -------------------------------------------------------------------------- */
//const currentWeights = { essential: 0.6, complementary: 0.4 };
//let questionnaireData = readQuestionnaireData(TEST_RESPONSES);
//let questionnaireResults = calculateResults(questionnaireData, currentWeights);

//console.log("Questionnaire Results:", questionnaireResults);
