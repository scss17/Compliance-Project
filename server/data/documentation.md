# Questionnaire Data Documentation

## Copyright Notice

© 2025 Campoz Consultoria. All rights reserved.

The content of the questionnaire, including all questions, section titles, and descriptions, is protected by copyright. You may not copy, distribute, or modify this content without express written permission.

## Questionnaire JSON Files

This folder contains two JSON files:
- ``questionnaire-default.json``: Complete questionnaire with all section and questions.
- ``questionnaire-testing.json``: Smaller version used for testing purposes. 

### JSON Structure

```json
{
  "questionnaireId": "string",
  "sections": [
    {
      "sectionId": "string",
      "sectionTitle": "string",
      "sectionDescription": "string",
      "sectionType": "essential | complementary",
      "questions": [
        {
          "id": "string",
          "text": "string"
        }
      ]
    }
  ]
}
```

### Structure Overview
- ``questionnaireId``: Unique identifier for the questionnaire.
- ``sections``: Array of sections included in the questionnaire.

Each section contains:

- ``sectionId``: Identifier for the section (e.g., I, IIa, III).
- ``sectionTitle``: Name of the section.
- ``sectionDescription``: Explains the purpose and scope of the section.
- ``sectionType``:
	- ``essential``: Key sections required for assessment.
	- ``complementary``: Optional sections that provide additional context.
- ``questions``: Array of questions with:
	- ``id``: Unique question ID within the section.
	- ``text``: The actual question text.

## Usage Notes
- Any change in the section descriptions in the in the ``questionnaire-default.json`` must be reflected here in the ``README.md``.

- ``questionnaire-testing.json`` file is intended for development or experimentation; do not use it for production data.

