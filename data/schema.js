/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInputObjectType
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
  nodeDefinitions,
} from 'graphql-relay';

import {
  // Import methods that your schema can use to interact with your database
  User,
  Blog,
  Post,
  Comment,
  getViewer,
  getUser,
  getBlog,
  getBlogs,
  getPost,
  getPosts,
  getComment,
  getComments,
  addComment,
  hydrateWithMockData
} from './database';

import {
  compose,
  lensProp,
  view,
  nthArg
} from "ramda";

var idLens = view(lensProp("id"));

var toLocalId = compose(Number, idLens, fromGlobalId);

var idArg = compose(idLens, nthArg(1));

var makeIdObj = (id) => ({ id });

/**
 * We get the node interface and field from the Relay library.
 *
 * The first method defines the way we resolve an ID to its object.
 * The second defines the way we resolve an object to its GraphQL type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    if (type === 'Blog') {
      return compose(getBlog, Number)(id);
    } else if (type === 'Post') {
      return compose(getPost, Number)(id);
    } else if (type === 'Comment') {
      return compose(getComment, Number)(id);
    } else {
      return null;
    }
  },
  (obj) => {
    if (obj instanceof Blog)  {
      return blogType;
    } else if (obj instanceof Post) {
      return postType;
    } else if (obj instanceof Comment) {
      return commentType;
    } else {
      return null;
    }
  }
);

/**
 * Define your own types here
 */

var blogType = new GraphQLObjectType({
  name: "Blog",
  fields: () => ({
    id: globalIdField("Blog"),
    name: {
      type: GraphQLString
    },
    posts: {
      type: postConnection,
      args: connectionArgs,
      resolve: (blog, args) => connectionFromArray(getPosts(blog), args)
    }
  }),
  interfaces: [nodeInterface]
});

var postType = new GraphQLObjectType({
  name: "Post",
  fields: () => ({
    id: globalIdField("Post"),
    title: {
      type: GraphQLString
    },
    created: {
      type: GraphQLString
    },
    content: {
      type: GraphQLString
    },
    commentCount: {
      type: GraphQLInt
    },
    comments: {
      type: commentConnection,
      args: connectionArgs,
      resolve: (post, args) => connectionFromArray(getComments(post), args)
    }
  }),
  interfaces: [nodeInterface]
});

var commentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    id: globalIdField("Comment"),
    content: {
      type: GraphQLString
    },
    created: {
      type: GraphQLString
    },
  }),
  interfaces: [nodeInterface]
});

/**
 * Define your own connection types here
 */

var {connectionType: postConnection} =
  connectionDefinitions({ name: "Post", nodeType: postType });

var {connectionType: commentConnection, edgeType: commentConnectionEdge } =
  connectionDefinitions({ name: "Comment", nodeType: commentType });

/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 */
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    node: nodeField,
    // Add your own root fields here
    viewer: {
      type: blogType,
      resolve: () => getViewer(),
    },
    blog: {
      type: blogType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: compose(getBlog, toLocalId, idArg)
    },
    posts: {
      type: new GraphQLList(postType),
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: compose(getPosts, makeIdObj, toLocalId, idArg)
    },
    post: {
      type: postType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: compose(getPost, toLocalId, idArg)
    },
    comments: {
      type: new GraphQLList(commentType),
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: compose(getComments, makeIdObj, toLocalId, idArg)
    },
    comment: {
      type: commentType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve: compose(getComment, toLocalId, idArg)
    }
  }),
});

var commentInputType = new GraphQLInputObjectType({
  name: "CommentInput",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString }
  })
});

var addCommentMutationType = mutationWithClientMutationId({
  name: "AddComment",
  inputFields: {
    postId: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    newCommentEdge: {
      type: commentConnectionEdge,
      resolve: (payload) => {
        const post = getPost(payload.postId);
        const comment = getComment(payload.commentId);

        const edge = {
          node: comment,
          cursor: cursorForObjectInConnection(getComments(post), comment)
        };

        return edge;
      }
    },
    post: {
      type: postType,
      resolve: (payload) => getPost(payload.postId)
    }
  },
  mutateAndGetPayload: ({ postId: globalPostId, content }) => {
    const postId = toLocalId(globalPostId);
    const post = getPost(postId);
    const commentId = post.addComment(content).id;
    const payload = { commentId, postId };

    return payload;
  }
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
var mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    // Add your own mutations here
    addComment: addCommentMutationType
  })
});

// populate db with mock data
hydrateWithMockData();

/**
 * Finally, we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export var Schema = new GraphQLSchema({
  query: queryType,
  // Uncomment the following after adding some mutation fields:
  mutation: mutationType
});
