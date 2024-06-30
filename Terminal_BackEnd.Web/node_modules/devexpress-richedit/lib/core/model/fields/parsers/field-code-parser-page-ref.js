import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator } from '../../../layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../layout/document-layout-details-level';
import { FieldName } from '../names';
import { FieldSwitchType } from './field-code-parser';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserPageRef extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.PageRef; }
    fillResult() {
        const pos = this.getPosition();
        if (pos == null)
            return true;
        let resultAsLink = false;
        for (let i = 0, switchInfo; switchInfo = this.switchInfoList[i]; i++)
            if (switchInfo.type == FieldSwitchType.FieldSpecific && switchInfo.name.toUpperCase() == "H")
                resultAsLink = true;
        this.modelManager.history.beginTransaction();
        this.setInputPositionState();
        if (this.subDocument.isMain()) {
            const layoutPosition = LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.layoutFormatterManager, this.subDocument, pos, DocumentLayoutDetailsLevel.Page, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
            const pageText = this.getFormattedResult(layoutPosition.pageIndex + 1);
            this.replaceTextByInterval(this.getTopField().getResultInterval(), pageText);
            if (resultAsLink)
                this.createLocalHyperLink(this.getTopField().getResultInterval(), this.getBookmarkName());
        }
        else
            this.replaceTextByLayoutDependentRun(this.getTopField().getResultInterval());
        this.modelManager.history.endTransaction();
        return true;
    }
    getPosition() {
        const bookmark = this.findBookmark(this.getBookmarkName());
        return bookmark ? bookmark.start : null;
    }
    getBookmarkName() {
        return this.parameterInfoList[0] ? this.parameterInfoList[0].text : "";
    }
    findBookmark(name) {
        name = name.toUpperCase();
        for (let bm of this.subDocument.bookmarks)
            if (bm.name.toUpperCase() == name)
                return bm;
        return null;
    }
}
