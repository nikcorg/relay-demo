import React from 'react';
import Relay from 'react-relay';
import SinglePostRoute from '../routes/SinglePostRoute';
import Post from "./Post";

class Blog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedPost: null };
    }

    selectPost(id) {
        this.setState({ selectedPost: id });
    }

    renderPosts(posts) {
        const { selectedPost } = this.state;

        return <ol>{posts.map(
            ({ node: p }) => <li key={p.id} className={p.id === selectedPost ? "selected" : null}>
                <a href="#" onClick={() => this.selectPost(p.id)}>{p.title}</a></li>)}</ol>;
    }

    render() {
        const { selectedPost } = this.state;
        const { blog } = this.props;
        return (
            <div>
                <h1>{blog.name}</h1>

                {blog.posts
                    ? this.renderPosts(blog.posts.edges)
                    : <p>Sorry, no posts found.</p>
                }

                {selectedPost
                    ? <Relay.RootContainer
                        Component={Post}
                        route={new SinglePostRoute({ postId: selectedPost })}
                    />
                    : null}
            </div>
        );
    }
}

export default Relay.createContainer(Blog, {
    initialVariables: {
        pageSize: 10
    },
    fragments: {
        blog: () => Relay.QL`
            fragment on Blog {
                id
                name
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
});
