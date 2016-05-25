/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import { toGlobalId } from "graphql-relay";

const ipsum = require("lorem-ipsum");

const nextId = ((seed = 0) => () => ++seed)();

const db = {
  blogs: [],
  posts: [],
  comments: []
};

// Model types
class Blog {
  constructor(id, name) {
    this.id = nextId();
    this.name = name || ipsum({
      units: "words",
      count: 4
    });
  }
}

class Post {
  constructor(blog, title, content) {
    this.id = nextId();
    this.blog = blog.id;
    this.created = String(Date.now());
    this.commentCount = 0;
    this.title = title || ipsum({
      units: "sentence",
      count: 1,
      sentenceLowerBound: 3,
      sentenceUpperBound: 10
    });
    this.content = content || ipsum({
      units: "paragraph",
      count: 10 - (Math.random() * 5 | 0),
      paragraphLowerBound: 3,
      paragraphUpperBound: 5
    });
  }

  addComment(content) {
    const comment = new Comment(this, content);
    db.comments.push(comment);
    this.commentCount += 1;
    return comment;
  }
}

class Comment {
  constructor (post, content) {
    this.id = nextId();
    this.post = post.id;
    this.created = String(Date.now());
    this.content = content || ipsum({
      units: "paragraph",
      count: 1,
      paragraphLowerBound: 3,
      paragraphUpperBound: 5
    });
  }
}

let blog, viewer;

const hydrateWithMockData = () => {
  db.blogs = [new Blog()];

  blog = db.blogs[0];
  viewer = blog;

  db.posts = db.posts.concat([
    new Post(blog),
    new Post(blog),
    new Post(blog),
    new Post(blog),
    new Post(blog),
    new Post(blog),
    new Post(blog)
  ]);
  db.posts.forEach(
    (post) => {
      post.addComment();
      post.addComment();
      post.addComment();
    });

  console.log("Hydrated db");
}

const byCreatedAsc = ({ created: a }, { created: b }) => parseInt(a, 10) - parseInt(b, 10);
const byCreatedDesc = ({ created: a }, { created: b }) => parseInt(b, 10) - parseInt(a, 10);

const getViewer = () => viewer;
const getBlog = (id) => id === blog.id ? blog : null;
const getPost = (id) => db.posts.find(p => p.id === id);
const getPosts = (blog) => db.posts.filter(p => p.blog === blog.id).sort(byCreatedDesc);
const getComment = (id) => db.comments.find(c => c.id === id);
const getComments = (post) => db.comments.filter(c => c.post === post.id).sort(byCreatedAsc);
const addComment = (id, content) => getPost(id).addComment(content);

module.exports = Object.entries({
  getViewer,
  getBlog,
  getPost,
  getPosts,
  getComment,
  getComments,
  addComment,
}).
reduce((acc, [name, fn]) => ({ ...acc, [name]: fn }), {
  Blog,
  Post,
  Comment,
  hydrateWithMockData
});
