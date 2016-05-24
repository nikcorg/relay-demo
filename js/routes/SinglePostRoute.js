import Relay from 'react-relay';
import { postQuery, commentsQuery } from "../queries";

export default class SinglePostRoute extends Relay.Route {
    static queries = {
        post: postQuery
    };

    static routeName = 'SinglePostRoute';
}
