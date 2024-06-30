import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { NumberMapUtils } from '@devexpress/utils/lib/utils/map/number';
export function findBookmarkByName(documentModel, check) {
    const bkms = [];
    NumberMapUtils.forEach(documentModel.subDocuments, (sd) => {
        ListUtils.forEach(sd.bookmarks, (bkm) => {
            if (check(bkm))
                bkms.push(bkm);
        });
    });
    return bkms;
}
