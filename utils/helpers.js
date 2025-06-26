import Table from 'cli-table3';

// Function to display steps commands
export function displayTableSteps(dataObject) {
  // Add null/undefined check first
  if (!dataObject) {
    console.log('Error: No response received from AI provider');
    return;
  }

  const { steps } = dataObject;

  // Validate the data
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    console.log('Error: Invalid response format from AI provider');
    console.log('Please ensure your question is correct and specific about commands');
    // console.log('Expected format: { "steps": [...] }');
    // console.log('Received:', JSON.stringify(dataObject, null, 2));
    return;
  }

  // Get headers from the first step
  const headers = Object.keys(steps[0]);

  // Create a table with headers
  const table = new Table({ 
    head: headers.map(h => h.toUpperCase()),
    style: { head: ['cyan'] }
  });

  // Fill the table with data from steps
  steps.forEach(step => {
    const row = headers.map(header => {
      const value = step[header];
      // Add padding and color coding for danger levels
      if (header === 'danger_level') {
        const level = parseInt(value);
        const colors = { 1: 'green', 2: 'yellow', 3: 'red' };
        return `Level ${level}`;
      }
      return typeof value === 'string' ? value : String(value);
    });
    table.push(row);
  });

  // Display the table in the terminal
  console.log(table.toString());
}
