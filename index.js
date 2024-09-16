require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

var urls = [];
var counter = 0;

app.post('/api/shorturl',function(req,res){
  try {
    const url = new URL(req.body.url);
    dns.lookup(url.hostname,(err, address, family)=>{
      if(err){
        res.json({
           error: 'invalid url' 
        });
      }else{
        res.json(
          { 
            original_url : url, 
            short_url : counter
          }
        );
        urls.push(url);
        counter++;
      }
    })
  } catch (error) {
    res.json({
      error: 'invalid url' 
   });
  }
});

app.get('/api/shorturl/:urlNumber',function(req,res){
  const urlNumber = req.params.urlNumber;
  res.redirect(urls[urlNumber]);
});
