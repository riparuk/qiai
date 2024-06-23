import Table from 'cli-table3';

// Function to display steps commands
export function displayTableSteps(dataObject) {
  const { steps } = dataObject;

  // Validate the data
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    // console.log('Invalid steps object. Must provide a valid array of steps.');
    console.log("Invalid");
    return;
  }

  // Get headers from the first step
  const headers = Object.keys(steps[0]);

  // Create a table with headers
  const table = new Table({ head: headers });

  // Fill the table with data from steps
  steps.forEach(step => {
    const row = headers.map(header => {
      const value = step[header];
      // Add padding to smooth the display
      return typeof value === 'string' ? value.padEnd(10) : value;
    });
    table.push(row);
  });

  // Display the table in the terminal
  console.log(table.toString());
}
