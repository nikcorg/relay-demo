import Relay from 'react-relay';
import { viewerQuery } from "../queries";

export default class extends Relay.Route {
    static queries = {
        viewer: viewerQuery
    };

    static routeName = 'AppHomeRoute';
}
