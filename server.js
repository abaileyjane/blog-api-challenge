const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-Parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BlogPosts} = require('./models');
const blogRouter = require('./blogRouter');

const jsonParser = bodyParser.json();
const app = express();

app.use(morgan('common'));
app.use('/posts', blogRouter);
        

//app.listen(process.env.PORT || 8080, () => {
//  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
//});                                                                                           

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}


function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('closing server');
		server.close(err =>{
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}; 

module.exports = {app, runServer, closeServer}