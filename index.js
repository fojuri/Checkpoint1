const express = require('express');

const app = express();

app.use(express.static(('index.html')));

app.listen(process.env.PORT || 5000, () => {
  console.log('Server listening on port 5000');
});
