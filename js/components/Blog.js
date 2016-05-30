import React from 'react';
import Relay from 'react-relay';
import SinglePostRoute from '../routes/SinglePostRoute';
import Post from "./Post";

const last = arr => arr[arr.length - 1];

class Blog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedPost: null };
    }

    selectPost(id) {
        this.setState({ selectedPost: id });
    }

    advancePageCursor() {
        const { relay, blog: { posts } } = this.props;
        const pageSize = relay.variables.pageSize + 3;

        relay.setVariables({ pageSize });
    }

    renderPagination() {
        const { blog: { posts: { pageInfo } } } = this.props;

        if (!pageInfo.hasNextPage) {
            return null;
        }

        return <div><button onClick={() => this.advancePageCursor()}>Next page</button></div>;
    }

    renderPosts() {
        const { blog: { posts } } = this.props;
        const { selectedPost } = this.state;

        if (!posts || 0 === posts.edges.length) {
            return <p>Sorry, no posts found.</p>;
        }

        return <ol>{posts.edges.map(
            ({ node: p }) => <li key={p.id} className={p.id === selectedPost ? "selected" : null}>
                <a href="#" onClick={() => this.selectPost(p.id)}>{p.title}</a></li>)}</ol>;
    }

    renderSelectedPost() {
        const { selectedPost } = this.state;

        if (!selectedPost) {
            return null;
        }

        return <Relay.RootContainer
            Component={Post}
            route={new SinglePostRoute({ postId: selectedPost })}
        />
    }

    render() {
        const { blog: { name } } = this.props;

        return (
            <div>
                <h1>{name}</h1>

                {this.renderPosts()}
                {this.renderPagination()}
                {this.renderSelectedPost()}
            </div>
        );
    }
}

export default Relay.createContainer(Blog, {
    initialVariables: {
        pageSize: 3
    },
    fragments: {
        blog: () => Relay.QL`
            fragment on Blog {
                id
                name
                posts(first: $pageSize) {
                    pageInfo {
                        hasNextPage
                    }
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
});
