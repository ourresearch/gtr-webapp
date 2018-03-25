const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

let app = express();
app.use(serveStatic(__dirname + "/dist"));


  app.get('*', function(req, res) {
      res.sendfile('./dist/index.html');
  });


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log('Listening on port ' + port)
});