import React from 'react';
import Relay from 'react-relay';
import Blog from "./blog";
import BlogHomeRoute from "../routes/BlogHomeRoute";

class App extends React.Component {
    render() {
        const { viewer: blog, viewer: { edges: posts } } = this.props;

        return <Relay.RootContainer
            Component={Blog}
            route={new BlogHomeRoute({ blogId: blog.id })}
        />
    }
}

export default Relay.createContainer(App, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Blog {
                id
                name
                posts(first: 10) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        `
    }
});
