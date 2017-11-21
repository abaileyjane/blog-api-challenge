const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true}
  }
});

blogPostSchema.virtual('authorString').get(function(){
  return `${this.author.firstname} ${this.author.lastname}`.trim()
});

blogPostSchema.methods.apiRepr = function() {

  return{
    created: this._id,
    title: this.title,
    author: this.authorString,
    content: this.content
  };
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = {BlogPost};