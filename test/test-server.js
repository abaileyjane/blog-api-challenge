const chai = require('chai');
const chaihttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, closeServer, runServer} = require('../server');
const should = chai.should();

const{BlogPost} = require('../models');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaihttp);

function seedBlogData(){
	console.log('seeding blog data');
	const seedData = [];

	for (let i=1; i < 10; i++){
		seedData.push(generateBlogData());
	}
	return BlogPost.insertMany(seedData);
}

function generateBlogData(){
	return {
		title: faker.definitions.catch_phrase_descriptor,
		content: faker.lorem.paragraph,
		name: {firstname: faker.definitions.first_name,
				lastname: faker.definitions.last_name}
			}

}

function tearDownDb(){
	console.log("deleting database");
	return mongoose.connection.dropDatabase();
}
describe('Blog Post', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function(){
		return seedBlogData();
	});

	afterEach(function(){
		return tearDownDb()
	});

	after(function(){
		return closeServer(); 
	})

	describe('GET endpoint', function(){

	it('should list blog posts on GET', function(){
		return chai.request(app)
		.get('/posts')
		.then(function(res){
			res = _res;
			res.should.have.status(200)
			res.should.be.a('array');
			res.body.length.should.be.above(0);
			res.body.should.have.all.keys('id','author','content','title')
		})
	})
})
});
