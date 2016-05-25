import Relay from "react-relay";
import React from "react";
import AddCommentMutation from "../mutations/AddCommentMutation";

class CommentForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { comment: "" };
    }

    onUpdate(comment) {
        this.setState({ comment });
    }

    onSubmit(e) {
        const { onSubmit } = this.props;

        e.preventDefault();

        const maybeWait = onSubmit(this.state.comment);

        if (maybeWait && "function" === typeof maybeWait.then) {
            maybeWait.then(
                () => this.reset(),
                (err) => console.error(err)
            );
        } else {
            this.reset();
        }
    }

    reset() {
        this.setState({ comment: "" });
    }

    render() {
        const { comment } = this.state;

        return <form onSubmit={(e) => this.onSubmit(e)}>
            <textarea onChange={(e) => this.onUpdate(e.target.value)}
                rows="5" cols="30" placeholder="Type comment here" value={comment} /><br/>
            <button type="submit">Send</button>
        </form>;
    }
}

export default Relay.createContainer(CommentForm, {
    fragments: {
        post: () => Relay.QL`
            fragment on Post {
                id
            }
        `
    }
})
