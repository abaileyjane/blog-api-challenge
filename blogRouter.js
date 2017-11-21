const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser');

const {BlogPosts} = require('./models');
const{BlogPost} = require('./models');

const jsonParser = bodyParser.json();

router.use(function (req, res, next) {
  console.log('Time:', Date.now())
  next()
})

router.get('/', (req, res) =>{
	console.log('router has been deployed')
	BlogPost
		.find()
		.then(console.log('doing it!'))
		.then(posts => {
			res.json({
				posts: posts.map(
					(post) => post.apiRepr())
			});
		})

		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'internal server error'});
			});

	//res.json(BlogPosts.get());
	//console.log("i GOT it");
	//res.status(200);
});

router.get('/:id', (req, res) =>{
	BlogPost
	.findById(req.params.id)
	.then(post => res.json(blogpost.apiRepr()))
	.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'internal server error'});
			});

});

router.post('/', (req, res) => {
	const requiredFields = ["title", "content", "author"];
	for(let i=0; i<requiredFields.length; i++){
		const field = requiredFields[i]
		if(!(field in req.body)){
			const message = `missing \`${field}\` in request`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	console.log('triggered post app')
	console.log(Object.keys(req.body.author));
	BlogPost
		.create({
			title: req.body.title,
			author: {firstname: req.body.author['firstname'], lastname: req.body.author['lastname']},
			content: req.body.content
		})
		.then(
			blogPost => res.status(201).json(blogPost.apiRepr()))
		.catch(
			err => {
				console.error(err);
				res.status(500).json({message: 'internal server error'});
			});
	//const item = BlogPosts.create(req.body.title, req.body.content, req.body.author);
	//res.status(201).json(item);
});

router.put('/:id', (req,res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)){
		const message = (
			`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`
			);
		console.error(message);
		return res.status(400).json({message: message})}
	const toUpdate = {};
	const updatableFields = ['content','title', 'author']

	updatableFields.forEach(field => {
		if (field in req.body) {
			toUpdate[field] = req.body[field];
		}
	});

	BlogPost
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(blogPost => res.status(204).end())
		.catch(err => res.status(500).json({message: 'internal server error'}))
})

//router.put('/:id', jsonParser, (req, res) => {
//	const requiredFields = ["title", "content", "author"];
//	if(req.params.id !== req.body.id){
//		console.log("request path id is not valid")
//		res.status(400);
//	}
//	for(let i=0; i<requiredFields.length; i++){
//		const field = requiredFields[i]
//		if(!(field in req.body)){
//			const message = `missing ${field} in request`
//			console.error(message);
//			return res.status(400).send(message);
//		}}
//	console.log(`updating post with id ${req.params.id}`);
//	BlogPosts.update({
//		title: req.body.title,
//		content: req.body.content,
//		id: req.params.id,
//		author: req.body.author
//	})
//	res.status(204).end();
//})

router.delete('/:id', (req,res) => {
	BlogPost
	.findByIdAndRemove(req.params.id)
	.then(blogPost => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Internal server error'}));
})

//router.delete('/blog-posts/:id', (req,res) =>{
//	BlogPosts.delete(req.params.id);
//	console.log(`Deleted post with id ${req.params.id}`)
//	res.status(204).end();
//})
module.exports = router;