import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { FieldVisabilityInfo } from '../../../core/model/fields/field';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class ManipulatorHandlerBase {
    constructor(control, defaultStateConstructor, boxVisualizerManager) {
        this.mouseWheelEvent = false;
        this.control = control;
        this.boxVisualizerManager = boxVisualizerManager;
        this.defaultState = new defaultStateConstructor(this);
        this.switchToDefaultState();
    }
    dispose() {
        this.state.dispose();
    }
    switchToDefaultState() {
        this.switchState(this.defaultState);
    }
    switchState(state) {
        if (this.state)
            this.state.finish();
        this.state = state;
        this.state.start();
    }
    getHyperlinkFieldResult(evt) {
        const subDocument = this.control.selection.activeSubDocument;
        const htr = this.control.hitTestManager.calculate(evt.layoutPoint, DocumentLayoutDetailsLevel.Max, subDocument);
        if (htr.exactlyDetailLevel == DocumentLayoutDetailsLevel.None)
            return null;
        const position = htr.floatingObject ? this.control.layout.anchorObjectsPositionInfo.getPosition(htr.floatingObject.objectId) :
            htr.getPosition();
        const fieldInfos = FieldVisabilityInfo.getRelativeVisabilityInfo(position, subDocument.fields);
        const fieldVisabilityInfo = ListUtils.reverseElementBy(fieldInfos, (info) => info.showResult && info.field.getResultInterval().containsWithIntervalEnd(position) && info.field.isHyperlinkField());
        return fieldVisabilityInfo ? fieldVisabilityInfo.field : null;
    }
}
