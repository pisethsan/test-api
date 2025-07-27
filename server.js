/**
 * server.js
 *
 * This server now saves incoming POST data to a local file.
 * It uses the built-in 'fs' (File System) module from Node.js.
 */

// 1. Import necessary libraries
const express = require('express');
const fs = require('fs'); // Import the File System module

// 2. Initialize the Express application
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Middleware to parse JSON
app.use(express.json());

// 4. Define the API endpoint
app.post('/api/posts', (req, res) => {
  const postData = req.body;
  console.log('Received data:', postData);

  if (!postData || Object.keys(postData).length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No data provided in the request body.'
    });
  }

  // --- NEW: Save the data to a file ---

  // Convert the incoming JSON object into a string.
  // We add a newline character '\n' so each post is on a new line.
  const dataToSave = JSON.stringify(postData) + '\n';

  // Use fs.appendFile to add the data to 'posts.json'.
  // This will create the file if it doesn't exist.
  // If it does exist, it will add the new data to the end of the file.
  fs.appendFile('posts.json', dataToSave, (err) => {
    if (err) {
      // If an error occurs while writing the file...
      console.error('Failed to save data:', err);
      // Send a 500 Internal Server Error response to the client.
      return res.status(500).json({
        success: false,
        message: 'Error saving data to file.'
      });
    }

    // If the file is saved successfully...
    console.log('Data saved to posts.json');
    // Send a success response back to the client.
    res.status(201).json({
      success: true,
      message: 'Data posted and saved successfully!',
      receivedData: postData
    });
  });
});

// 5. Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
