import Relay from "react-relay";
import React from "react";
import PostComments from "./PostComments";

class Post extends React.Component {
    render() {
        const { post } = this.props;

        return (
            <article>
                <h2>{post.title}</h2>
                <p>{new Date(parseInt(post.created, 10)).toString()}</p>
                <p>{post.content}</p>

                <PostComments post={post} />
            </article>
        );
    }
}

export default Relay.createContainer(Post, {
    fragments: {
        post: () => Relay.QL`
            fragment on Post {
                created
                title
                content
                ${PostComments.getFragment("post")}
            }
        `
    }
});
