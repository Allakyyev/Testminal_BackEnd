import { HistoryItemIntervalState } from '../../history/states/history-item-state';
import { HistoryItemIntervalStateObject } from '../../history/states/history-item-state-object';
import { BaseManipulator } from '../base-manipulator';
import { InlinePicturesUpdatedSubDocumentChange } from '../../changes/sub-document/picture/inline-pictures-updated';
import { UpdatedImageInfo } from '../picture-manipulator/loader/updated-image-info';
export class ImageManipulator extends BaseManipulator {
    setValue(subDocument, interval, newValue) {
        const oldState = new HistoryItemIntervalState();
        const newState = new HistoryItemIntervalState();
        const pictureRun = subDocument.getRunByPosition(interval.start);
        oldState.register(new HistoryItemIntervalStateObject(interval, [pictureRun.info.cacheInfo.base64, pictureRun.size.actualSize]));
        newState.register(new HistoryItemIntervalStateObject(interval, [newValue[0], newValue[1]]));
        this.setPropertyValue(subDocument, newState, pictureRun, true);
        return oldState;
    }
    restoreValue(subDocument, state) {
        if (state.isEmpty())
            return;
        const pictureRun = subDocument.getRunByPosition(state.interval.start);
        this.setPropertyValue(subDocument, state, pictureRun, false);
    }
    setPropertyValue(subDocument, state, pictureRun, loaded) {
        const imageCache = this.modelManipulator.model.cache.imageCache;
        const newValue = state.lastObject.value;
        const newInfo = imageCache.createUnloadedInfoByBase64(newValue[0], newValue[1]);
        newInfo.isLoaded = loaded;
        pictureRun.size.cacheInfo = newInfo;
        this.notifyModelChanged(state.interval.start, newInfo, pictureRun.size, subDocument);
    }
    notifyModelChanged(position, imageInfo, size, subDocument) {
        this.modelManipulator.notifyModelChanged(new InlinePicturesUpdatedSubDocumentChange(subDocument.id, new UpdatedImageInfo(position, imageInfo, size)));
    }
}
