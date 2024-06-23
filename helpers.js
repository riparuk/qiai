import Table from 'cli-table3';

// Fungsi untuk menampilkan tabel berdasarkan objek steps
export function displayTableSteps(dataObject) {
  const { steps } = dataObject;

  // Validasi data
  if (!steps || !Array.isArray(steps) || steps.length === 0) {
    console.log('Invalid steps object. Must provide a valid array of steps.');
    return;
  }

  // Mendapatkan header dari steps pertama
  const headers = Object.keys(steps[0]);

  // Membuat tabel dengan mengatur header
  const table = new Table({ head: headers });

  // Mengisi data steps ke dalam tabel
  steps.forEach(step => {
    const row = headers.map(header => {
      const value = step[header];
      // Menambahkan padding untuk memperhalus tampilan
      return typeof value === 'string' ? value.padEnd(10) : value;
    });
    table.push(row);
  });

  // Menampilkan tabel di terminal
  console.log(table.toString());
}

/**
 * Function to ensure that the OPENAI_API_KEY environment variable is set.
 * Throws an error and exits the process if the environment variable is not set.
 */
export function ensureOpenaiApiKey() {
    if (!process.env.OPENAI_API_KEY) {
      console.error("Error: OPENAI_API_KEY environment variable is not set.");
      console.error("Please set the OPENAI_API_KEY environment variable before running the script.");
      process.exit(1); // Exit the process with failure status
    }
}
