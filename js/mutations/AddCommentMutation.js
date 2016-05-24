import Relay from "react-relay";

export default class AddCommentMutation extends Relay.Mutation {
    static fragments = {
        post: () => Relay.QL`
            fragment on Post {
                id
            }
        `
    }

    getCollisionKey() {
        return `add_comment_${this.props.post.id}`;
    }

    getMutation() {
        return Relay.QL`
            mutation {
                addComment
            }
        `;
    }

    getVariables() {
        return {
            postId: this.props.post.id,
            content: this.props.comment
        };
    }

    getConfigs() {
        return [{
            type: "FIELDS_CHANGE",
            fieldIDs: {
                post: this.props.post.id
            }
        }];
    }

    getOptimisticResponse() {
        return {
            newCommentEdge: {
                node: {
                    content: this.props.comment
                }
            },
            post: {
                commentCount: this.props.post.commentCount + 1
            }
        };
    }

    getFatQuery() {
        return Relay.QL`
            fragment on AddCommentPayload @relay(pattern: true) {
                post {
                    commentCount
                    comments {
                        edges {
                            node {
                                created
                                content
                            }
                        }
                    }
                }
                newCommentEdge
            }
        `
    }
}
