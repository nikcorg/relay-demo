import Relay from "react-relay";
import React from "react";
import Comment from "./comment";
import CommentForm from "./CommentForm";
import AddCommentMutation from "../mutations/AddCommentMutation";

class PostComments extends React.Component {
    addComment(comment) {
        const { post } = this.props;

        return new Promise((resolve, reject) => {
            Relay.Store.commitUpdate(
                new AddCommentMutation({ id: post.id, comment, post }), {
                    onSuccess: resolve,
                    onFailure: reject
                }
            );
        });
    }

    render() {
        const { post } = this.props;

        return <div>
            <h3>Comments ({post.commentCount})</h3>
            <ol>
                {post.comments.edges.map(({ node }) => <Comment key={node.id} comment={node} />)}
            </ol>

            <h4>Leave comment</h4>
            <CommentForm post={post} onSubmit={(comment) => this.addComment(comment)} />
        </div>;
    }
}

export default Relay.createContainer(PostComments, {
    initialVariables: {
        pageSize: 10
    },
    fragments: {
        post: () => Relay.QL`
            fragment on Post {
                commentCount
                comments(last: $pageSize) {
                    edges {
                        node {
                            id
                            ${Comment.getFragment("comment")}
                        }
                    }
                }
                ${CommentForm.getFragment("post")}
                ${AddCommentMutation.getFragment("post")}
            }
        `
    }
});
