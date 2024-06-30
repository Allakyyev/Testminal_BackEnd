import { LeafElementDestination } from '../destination';
export class TabsLeafElementDestination extends LeafElementDestination {
    constructor(data, tabs) {
        super(data);
        this.tabs = tabs;
    }
}
