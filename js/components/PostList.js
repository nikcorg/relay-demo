import Relay from "react-relay";
import React from "react";

import { Link } from "react-router";

const first = (arr) => arr[0];
const last = (arr) => arr[arr.length - 1];

class PostList extends React.Component {
    rewindPageCursor() {
        const { relay, viewer: { posts } } = this.props;

        const beforeCursor = first(posts.edges).cursor;
        const afterCursor = null;

        relay.setVariables({ afterCursor, beforeCursor });
    }

    advancePageCursor() {
        const { relay, viewer: { posts } } = this.props;

        const beforeCursor = null;
        const afterCursor = last(posts.edges).cursor;

        relay.setVariables({ afterCursor, beforeCursor });
    }

    increasePageSize() {
        const { relay } = this.props;
        const pageSize = relay.variables.pageSize + 10;

        relay.setVariables({ pageSize }, (args) => console.log("ORSC", args));
    }

    renderPostsList() {
        const { viewer: { posts } } = this.props;

        if (!posts || 0 === posts.edges.length) {
            return <p>Sorry, no posts</p>;
        }

        return <ol>{posts.edges.map(
            ({ node: p }) => <li key={p.id}>
                <Link to={`/post/${p.id}`}>{p.title}</Link></li>)}</ol>;
    }

    renderPager() {
        const { viewer: { posts: { pageInfo } } } = this.props;

        if (!pageInfo.hasNextPage && !pageInfo.hasPreviousPage) {
            return null;
        }

        // return (
        //     <div>
        //         <button onClick={() => this.increasePageSize()}>Show more</button>
        //     </div>
        // );

        return (
            <div>
            {pageInfo.hasPreviousPage && <button onClick={() => this.rewindPageCursor()}>Previous page</button>}
            {pageInfo.hasNextPage && <button onClick={() => this.advancePageCursor()}>Next page</button>}
            </div>
        );
    }

    render() {
        return (
            <div>
            {this.renderPostsList()}
            {this.renderPager()}
            </div>
        );
    }
}

export default Relay.createContainer(PostList, {
    initialVariables: {
        pageSize: 10,
        afterCursor: null,
        beforeCursor: null
    },
    fragments: {
        viewer: () => Relay.QL`
            fragment on Blog {
                posts(first: $pageSize, after: $afterCursor) {
                    pageInfo {
                        hasPreviousPage
                        hasNextPage
                    }
                    edges {
                        cursor
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
