function updateVariableValues(base64String, variableUpdates) {
   try {
       // Step 1: Decode base64 to get Delta content
       const jsonContent = decodeURIComponent(escape(atob(base64String)));
       const deltaContent = JSON.parse(jsonContent);
       
       // Step 2: Process each operation in the Delta
       if (deltaContent.ops && Array.isArray(deltaContent.ops)) {
           deltaContent.ops = deltaContent.ops.map(op => {
               // Check if this operation contains a variable
               if (op.insert &&
                   typeof op.insert === 'object' &&
                   op.insert.variable &&
                   op.insert.variable.name) {
                   
                   const variableName = op.insert.variable.name;
                   
                   // Check if we have an update for this variable
                   if (variableUpdates.hasOwnProperty(variableName)) {
                       // Create a new operation with updated value
                       const updatedOp = {
                           ...op,
                           insert: {
                               ...op.insert,
                               variable: {
                                   ...op.insert.variable,
                                   value: variableUpdates[variableName]
                               }
                           }
                       };
                       
                       // Also update the attributes if they exist
                       if (op.attributes && op.attributes.name === variableName) {
                           updatedOp.attributes = {
                               ...op.attributes,
                               value: variableUpdates[variableName]
                           };
                       }
                       
                       return updatedOp;
                   }
               }
               
               // Return original operation if no update needed
               return op;
           });
       }
       
       // Step 3: Encode back to base64
       const updatedJsonContent = JSON.stringify(deltaContent);
       const updatedBase64 = btoa(unescape(encodeURIComponent(updatedJsonContent)));
       
       return updatedBase64;
       
   } catch (error) {
       console.error('Error updating variable values:', error);
       return null;
   }
}

/**
* Helper function to extract all variables from a base64 encoded Delta
* @param {string} base64String - The base64 encoded Delta content
* @returns {Array} - Array of variable objects found in the content
*/
function extractVariables(base64String) {
   try {
       const jsonContent = decodeURIComponent(escape(atob(base64String)));
       const deltaContent = JSON.parse(jsonContent);
       const variables = [];
       
       if (deltaContent.ops && Array.isArray(deltaContent.ops)) {
           deltaContent.ops.forEach(op => {
               if (op.insert &&
                   typeof op.insert === 'object' &&
                   op.insert.variable) {
                   
                   variables.push({
                       name: op.insert.variable.name,
                       type: op.insert.variable.type,
                       required: op.insert.variable.required,
                       currentValue: op.insert.variable.value || null
                   });
               }
           });
       }
       
       return variables;
       
   } catch (error) {
       console.error('Error extracting variables:', error);
       return [];
   }
}

/**
* Helper function to get a human-readable preview of the content
* @param {string} base64String - The base64 encoded Delta content
* @returns {string} - Plain text representation
*/
function getContentPreview(base64String) {
   try {
       const jsonContent = decodeURIComponent(escape(atob(base64String)));
       const deltaContent = JSON.parse(jsonContent);
       let preview = '';
       
       if (deltaContent.ops && Array.isArray(deltaContent.ops)) {
           deltaContent.ops.forEach(op => {
               if (typeof op.insert === 'string') {
                   preview += op.insert;
               } else if (op.insert && op.insert.variable) {
                   // Show variable value if available, otherwise show name in brackets
                   const varValue = op.insert.variable.value || `{{${op.insert.variable.name}}}`;
                   preview += varValue;
               }
           });
       }
       
       return preview;
       
   } catch (error) {
       console.error('Error getting content preview:', error);
       return '';
   }
}


const originalBase64 = "eyJvcHMiOlt7ImF0dHJpYnV0ZXMiOnsibmFtZSI6IlRleHQgdmFyaWFibGUiLCJ0eXBlIjoidGV4dCIsInJlcXVpcmVkIjpmYWxzZSwidmFsdWUiOiJNciBDcmFicyAtIFNwb25nZWJvYiJ9LCJpbnNlcnQiOnsidmFyaWFibGUiOnsibmFtZSI6IlRleHQgdmFyaWFibGUiLCJ0eXBlIjoidGV4dCIsInJlcXVpcmVkIjpmYWxzZSwidmFsdWUiOiJNciBDcmFicyAtIFNwb25nZWJvYiJ9fX0seyJpbnNlcnQiOiJcbiJ9LHsiYXR0cmlidXRlcyI6eyJuYW1lIjoiTnVtYmVyIFZhcmlhYmxlIiwidHlwZSI6InRleHQiLCJyZXF1aXJlZCI6ZmFsc2UsInZhbHVlIjoiMjAwIn0sImluc2VydCI6eyJ2YXJpYWJsZSI6eyJuYW1lIjoiTnVtYmVyIFZhcmlhYmxlIiwidHlwZSI6InRleHQiLCJyZXF1aXJlZCI6ZmFsc2UsInZhbHVlIjoiMjAwIn19fSx7Imluc2VydCI6IlxuIn0seyJhdHRyaWJ1dGVzIjp7Im5hbWUiOiJEYXRlIFZhcmlhYmxlIiwidHlwZSI6InRleHQiLCJyZXF1aXJlZCI6ZmFsc2UsInZhbHVlIjoiTWFyIDIwIDIwMjYifSwiaW5zZXJ0Ijp7InZhcmlhYmxlIjp7Im5hbWUiOiJEYXRlIFZhcmlhYmxlIiwidHlwZSI6InRleHQiLCJyZXF1aXJlZCI6ZmFsc2UsInZhbHVlIjoiTWFyIDIwIDIwMjYifX19LHsiaW5zZXJ0IjoiXG4ifV19";

// Change the StartDate from "3/20/25" to "4/15/25"
const variableUpdates = {
   "Text variable":"Mr Crabs - Spongebob 2"
};

const updatedBase64 = updateVariableValues(originalBase64, variableUpdates);

return updatedBase64;
