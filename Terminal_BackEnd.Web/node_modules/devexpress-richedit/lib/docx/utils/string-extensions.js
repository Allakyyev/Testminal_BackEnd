import { Comparers } from '@devexpress/utils/lib/utils/comparers';
export class StringExtensions {
    static compareInvariantCultureIgnoreCase(str1, str2) {
        return Comparers.stringIgnoreCase(str1, str2);
    }
}
