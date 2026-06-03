const XLSX = require('xlsx');
const path = require('path');

/**
 * Parse uploaded CSV/XLSX/XLS file and return array of records
 * Validates that required columns exist: FirstName, Phone, Notes
 * @param {string} filePath - Absolute path to the uploaded file
 * @returns {{ data: Array, error: string|null }}
 */
const parseUploadedFile = (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    // Read the workbook
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return { data: null, error: 'File is empty or has no sheets.' };
    }

    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON with header row
    const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rawData || rawData.length === 0) {
      return { data: null, error: 'The file contains no data rows.' };
    }

    // Validate required columns (case-insensitive check)
    const firstRow = rawData[0];
    const keys = Object.keys(firstRow).map((k) => k.toLowerCase().trim());

    const requiredColumns = ['firstname', 'phone', 'notes'];
    const missingColumns = requiredColumns.filter((col) => !keys.includes(col));

    if (missingColumns.length > 0) {
      return {
        data: null,
        error: `Missing required columns: ${missingColumns
          .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
          .join(', ')}. Required: FirstName, Phone, Notes`,
      };
    }

    // Normalize column names and build clean records
    const normalizedData = rawData.map((row) => {
      const normalized = {};
      Object.keys(row).forEach((key) => {
        normalized[key.toLowerCase().trim()] = String(row[key]).trim();
      });

      return {
        firstName: normalized['firstname'] || '',
        phone: normalized['phone'] || '',
        notes: normalized['notes'] || '',
      };
    });

    // Filter out completely empty rows
    const filteredData = normalizedData.filter(
      (row) => row.firstName || row.phone
    );

    return { data: filteredData, error: null };
  } catch (err) {
    console.error('File parsing error:', err);
    return { data: null, error: 'Failed to parse file. Please check the file format.' };
  }
};

/**
 * Round-robin task distribution algorithm
 * Distributes records equally among agents, remaining records go to first agents sequentially
 * @param {Array} records - Array of task records
 * @param {Array} agents - Array of agent documents
 * @returns {Array} Records with assignedAgent field set
 */
const distributeTasksRoundRobin = (records, agents) => {
  if (!agents || agents.length === 0) {
    throw new Error('No agents available for task distribution.');
  }

  return records.map((record, index) => ({
    ...record,
    assignedAgent: agents[index % agents.length]._id,
  }));
};

module.exports = { parseUploadedFile, distributeTasksRoundRobin };
