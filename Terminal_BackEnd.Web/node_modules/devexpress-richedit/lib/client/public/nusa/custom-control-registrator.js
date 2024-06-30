import { SubDocumentInterval } from '../../../core/model/sub-document';
import { insertTextThroughApi } from '../../../model-api/api-utils/insert-text';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { Characters } from '../characters';
import { WRE_NUSA_registerCustomControlType } from './external-types';
export function registerRichEditCustomControlType(controlTypeName, richEditsHolder) {
    if (richEditsHolder.isControlTypeRegistered(controlTypeName))
        return;
    richEditsHolder.registerControlType(controlTypeName);
    WRE_NUSA_registerCustomControlType(controlTypeName, customControlType => {
        customControlType.newlineFormat = Characters.LineBreak;
        customControlType.paragraphFormat = Characters.ParagraphBreak;
        customControlType.replaceText = (element, text, fromPos, length) => {
            const rich = richEditsHolder.getRichEditByElement(element);
            const subDocument = rich.core.selection.activeSubDocument;
            const prevActPos = rich.core.selection.getState().activePostion;
            rich.core.beginUpdate();
            rich.core.modelManager.history.beginTransaction();
            if (length > 0) {
                rich.core.modelManager.modelManipulator.range.removeInterval(new SubDocumentInterval(subDocument, new FixedInterval(fromPos, length)), true, true);
            }
            const newTextInterval = insertTextThroughApi(fromPos, text, subDocument, rich.core, {
                wrapIntoBeginUpdate: false,
                inputPosition: rich.core.inputPosition
            });
            if (prevActPos >= fromPos && prevActPos < fromPos + length)
                rich.core.selection.changeState(newState => newState.setPosition(newTextInterval.end));
            rich.core.modelManager.history.endTransaction();
            rich.core.endUpdate();
        };
        customControlType.getText = (element) => {
            const rich = richEditsHolder.getRichEditByElement(element);
            return rich.core.selection.activeSubDocument.getText();
        };
        customControlType.getSelectionText = (element) => {
            const rich = richEditsHolder.getRichEditByElement(element);
            return rich.core.selection.activeSubDocument.getText(rich.core.selection.intervals[0]);
        };
        customControlType.getSelection = (element) => {
            const rich = richEditsHolder.getRichEditByElement(element);
            return rich.core.selection.intervals[0];
        };
        customControlType.setSelection = (element, start, length) => {
            const rich = richEditsHolder.getRichEditByElement(element);
            rich.core.selection.changeState(newState => newState.setInterval(new FixedInterval(start, length)));
        };
        richEditsHolder.registerControlTypeObject(controlTypeName, customControlType);
    });
}
