import Relay from 'react-relay';
import { postQuery, commentsQuery } from "../queries";

export default class BlogHomeRoute extends Relay.Route {
    static queries = {
        post: postQuery
    };

    static routeName = 'SinglePostRoute';
}
