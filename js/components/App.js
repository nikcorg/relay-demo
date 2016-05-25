import React from 'react';
import Relay from 'react-relay';

class App extends React.Component {
    render() {
        return <div id={this.props.viewer.id}>{this.props.children}</div>;
    }
}

export default Relay.createContainer(App, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on Blog {
                id
            }
        `
    }
});
