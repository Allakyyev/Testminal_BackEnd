import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { StringValueDestination } from './base/string-value-destination';
import { DestinationType } from './utils/destination-type';
export class UserTableDestination extends StringValueDestination {
    get destinationType() { return DestinationType.UserTableDestination; }
    nestedGroupFinished(nestedDestination) {
        super.nestedGroupFinished(nestedDestination);
        if (nestedDestination instanceof UserTableDestination) {
            const userName = StringUtils.trim(nestedDestination.value);
            this.importer.importers.rangePermission.userNames.push(userName);
        }
    }
    createEmptyClone() {
        return new UserTableDestination(this.importer);
    }
}
