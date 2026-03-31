/**
 * Updates variable values in an HTML string produced by the Quill editor.
 * Targets elements with the "inserted_variable" class and a matching
 * "data-variable-name" attribute using regex only — no DOM parser or
 * external libraries required, safe for server-side use.
 *
 * @param {string} html      - The HTML string from the Quill editor
 * @param {Object} oldValues - Map of variable name -> current/old value  e.g. { "Text variable": "Mr Crabs - Spongebob" }
 * @param {Object} newValues - Map of variable name -> new value           e.g. { "Text variable": "Mr Crabs - Spongebob 2" }
 * @returns {string}         - Updated HTML string
 */
function updateHtmlVariableValues(html, oldValues, newValues) {
    try {
        let updatedHtml = html;

        for (const variableName of Object.keys(newValues)) {
            const oldValue = oldValues[variableName];
            const newValue = newValues[variableName];

            // Skip if there's no old value to search for
            if (oldValue === undefined || oldValue === null || oldValue === '') {
                console.warn(`No old value provided for variable "${variableName}", skipping.`);
                continue;
            }

            const escapedOldValue = oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const escapedVariableName = variableName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Match the entire element by class, data-variable-name and current text content.
            // $1 and $2 preserve the opening and closing tags — only the text content is replaced.
            const regex = new RegExp(
                `(<strong[^>]*class="inserted_variable"[^>]*data-variable-name="${escapedVariableName}"[^>]*>)${escapedOldValue}(<\\/strong>)`,
                'gi'
            );

            const occurrencesBefore = (updatedHtml.match(regex) || []).length;
            updatedHtml = updatedHtml.replace(regex, `$1${newValue}$2`);

            console.log(`Variable "${variableName}": replaced ${occurrencesBefore} occurrence(s) of "${oldValue}" → "${newValue}"`);
        }

        return updatedHtml;

    } catch (error) {
        console.error('Error updating HTML variable values:', error);
        return html;
    }
}


// --- Example Usage ---

// Variables are marked with the "inserted_variable" class and a "data-variable-name" attribute.
// The regex targets only these elements, leaving any similar text elsewhere in the document untouched.
const originalHtml = `
    <p>
        <strong class="inserted_variable" data-variable-name="Text variable">Mr Crabs - Spongebob</strong>
    </p>
    <p>
        <strong class="inserted_variable" data-variable-name="Number Variable">200</strong>
    </p>
    <p>
        <strong class="inserted_variable" data-variable-name="Date Variable">Mar 20 2026</strong>
    </p>
    <p>
        This contract was signed in the year 2026 and references document 200.
    </p>
    <p><span class="ql-cursor">﻿</span></p>
`;

// The old (current) values that exist in the HTML
const oldValues = {
    "Text variable":   "Mr Crabs - Spongebob",
    "Number Variable": "200",
    "Date Variable":   "Mar 20 2026"
};

// The new values to replace them with
const newValues = {
    "Text variable":   "Mr Crabs - Spongebob 2",
    "Number Variable": "250",
    "Date Variable":   "Apr 15 2026"
};

const updatedHtml = updateHtmlVariableValues(originalHtml, oldValues, newValues);

// "200" and "2026" in the plain paragraph text remain untouched
console.log("Updated HTML:");
console.log(updatedHtml);

return updatedHtml;
