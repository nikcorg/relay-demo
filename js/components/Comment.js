import Relay from "react-relay";
import React from "react";

class Comment extends React.Component {
    render() {
        return <li>
            {this.props.comment.created &&
                `${new Date(parseInt(this.props.comment.created, 10)).toString()}`}<br/>
            {this.props.comment.content}
        </li>;
    }
}

export default Relay.createContainer(Comment, {
    fragments: {
        comment: () => Relay.QL`
            fragment on Comment {
                content
                created
            }
        `
    }
});
