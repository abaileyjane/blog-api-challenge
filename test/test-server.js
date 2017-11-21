const chai = require('chai');
const chaihttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');
const should = chai.should();

chai.use(chaihttp);

describe('Blog Posts', function(){
	before(function(){
		return runServer();
	})

	after(function(){
		return closeServer(); 
	})

	it('should list blog posts on GET', function(){
		return chai.request(app)
		.get('/blog-posts')
		.then(function(res){
			res.should.have.status(200)
			res.should.be.json;
			res.should.be.a('array');
			res.body.length.should.be.above(0);
			res.body.should.have.all.keys('id','author','content','title')
		})
	})
});
