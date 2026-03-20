function updateHtmlVariableValues(html, oldValues, newValues) {
    try {
        let updatedHtml = html;

        for (const variableName of Object.keys(newValues)) {
            const oldValue = oldValues[variableName];
            const newValue = newValues[variableName];

            if (oldValue === undefined || oldValue === null || oldValue === '') {
                console.warn(`No old value provided for variable "${variableName}", skipping.`);
                continue;
            }

            const escapedOldValue = oldValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Use lookahead and lookbehind to match whole values only
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
