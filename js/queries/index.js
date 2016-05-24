import Relay from "react-relay";

export const viewerQuery = () => Relay.QL`
        query {
            viewer
        }
    `;

export const blogQuery = () => Relay.QL`
        query {
            blog(id: $blogId)
        }
    `;

export const postsQuery = () => Relay.QL`
        query {
            posts(id: $postId)
        }
    `;

export const postQuery = () => Relay.QL`
        query {
            post(id: $postId)
        }
    `;

export const commentsQuery = () => Relay.QL`
        query {
            comments(id: $postId)
        }
    `;

export const commentQuery = () => Relay.QL`
        query {
            comment(id: $commentId)
        }
    `;

