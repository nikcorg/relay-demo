import React from 'react';
import Relay from 'react-relay';

class Blog extends React.Component {
    render() {
        const { viewer: blog, children } = this.props;

        return (
            <div>
                <h1>{blog.name}</h1>

                <div>{children}</div>
            </div>
        );
    }
}

export default Relay.createContainer(Blog, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Blog {
                id
                name
            }
        `
    }
});
