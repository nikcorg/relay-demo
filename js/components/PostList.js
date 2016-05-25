import Relay from "react-relay";
import React from "react";

import { Link } from "react-router";

const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];

class PostList extends React.Component {
    renderPostsList() {
        const { viewer: { posts } } = this.props;

        if (!posts || 0 === posts.edges.length) {
            return <p>Sorry, no posts</p>;
        }

        return <ol>{posts.edges.map(
            ({ node: p }) => <li key={p.id}>
                <Link to={`/post/${p.id}`}>{p.title}</Link></li>)}</ol>;
    }

    render() {
        return (
            <div>
            {this.renderPostsList()}
            </div>
        );
    }
}

export default Relay.createContainer(PostList, {
    initialVariables: {
        pageSize: 10
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Blog {
                posts(first: $pageSize) {
                    edges {
                        node {
                            id
                            title
                        }
                    }
                }
            }
        `
    }
})
