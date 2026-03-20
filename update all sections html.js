/**
 * Updates variable values in an HTML string produced by the Quill editor.
 * Replaces old variable values with new ones inside any tag (e.g. <p>, <strong>, <span>).
 * Uses negative lookahead and lookbehind to prevent partial matches (e.g. "0" matching inside "2026").
 *
 * @param {string} html - The HTML string from the Quill editor
 * @param {Object} oldValues - Map of variable name -> current/old value  e.g. { "Text variable": "Mr Crabs - Spongebob" }
 * @param {Object} newValues - Map of variable name -> new value           e.g. { "Text variable": "Mr Crabs - Spongebob 2" }
 * @returns {string} - Updated HTML string
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

            // Escape any special regex characters in the old value
            const escapedOldValue = oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Use lookahead and lookbehind to match whole values only,
            // preventing partial matches e.g. "0" matching inside "2026" or "1960"
            const regex = new RegExp(`(?<![\\w])${escapedOldValue}(?![\\w])`, 'g');

            const occurrencesBefore = (updatedHtml.match(regex) || []).length;

            updatedHtml = updatedHtml.replace(regex, newValue);

            console.log(`Variable "${variableName}": replaced ${occurrencesBefore} occurrence(s) of "${oldValue}" → "${newValue}"`);
        }

        return updatedHtml;

    } catch (error) {
        console.error('Error updating HTML variable values:', error);
        return html;
    }
}


// --- Example Usage ---

const originalHtml = `<p><strong>Mr Crabs - Spongebob</strong></p><p><strong>200</strong></p><p><strong>Mar 20 2026</strong></p><p><span class="ql-cursor">﻿</span></p>`;

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

console.log("Updated HTML:");
console.log(updatedHtml);

return updatedHtml;
