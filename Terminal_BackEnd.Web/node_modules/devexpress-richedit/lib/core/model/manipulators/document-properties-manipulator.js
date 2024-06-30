import { DefaultTabWidthModelChange } from '../changes/model/default-tab-width';
import { DifferentOddAndEvenPagesModelChange } from '../changes/model/different-odd-and-even-pages';
import { PageColorModelChange } from '../changes/model/page-color';
import { BaseManipulator } from './base-manipulator';
export class DocumentPropertiesManipulator extends BaseManipulator {
    setDefaultTabWidth(documentModel, newDefaultTabWidth) {
        var oldValue = documentModel.defaultTabWidth;
        documentModel.defaultTabWidth = newDefaultTabWidth;
        this.modelManipulator.notifyModelChanged(new DefaultTabWidthModelChange(newDefaultTabWidth));
        return oldValue;
    }
    changePageColor(documentModel, newPageColor) {
        var oldValue = documentModel.pageBackColor;
        documentModel.setPageColor(newPageColor);
        this.modelManipulator.notifyModelChanged(new PageColorModelChange(newPageColor));
        return oldValue;
    }
    changeDifferentOddAndEvenPages(documentModel, newValue) {
        let oldValue = documentModel.differentOddAndEvenPages;
        documentModel.differentOddAndEvenPages = newValue;
        this.modelManipulator.notifyModelChanged(new DifferentOddAndEvenPagesModelChange(newValue));
        return oldValue;
    }
}
