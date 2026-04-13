const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const file = path.join(__dirname, '..', 'data', 'weekends.json');
  if (!fs.existsSync(file)) {
    return res.status(503).json({ error: 'Data not yet available.' });
  }
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.setHeader('Content-Type', 'application/json');
  res.send(fs.readFileSync(file, 'utf8'));
};
