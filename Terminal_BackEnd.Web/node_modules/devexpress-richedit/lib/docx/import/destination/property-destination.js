import { __awaiter } from "tslib";
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { LeafElementDestination } from './destination';
export class PropertyDestination extends LeafElementDestination {
    constructor(data, setter) {
        super(data);
        this.setter = setter;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = reader.getAttributeNS('val', reader.namespaceURI);
            if (value == null)
                value = reader.getAttribute('val');
            if (StringUtils.isNullOrEmpty(value))
                return;
            this.setter(value);
        });
    }
}
