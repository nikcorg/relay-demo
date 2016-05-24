import Relay from 'react-relay';
import { blogQuery } from "../queries";

export default class BlogHomeRoute extends Relay.Route {
    static queries = {
        blog: blogQuery
    };

    static routeName = 'BlogHomeRoute';
}
