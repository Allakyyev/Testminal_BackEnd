import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator } from '../../../layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../layout/document-layout-details-level';
import { FieldName } from '../names';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserPage extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.Page; }
    fillResult() {
        const pos = this.getPosition();
        if (pos == null)
            return true;
        this.setInputPositionState();
        if (this.subDocument.isMain()) {
            let layoutPosition = LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.layoutFormatterManager, this.subDocument, pos, DocumentLayoutDetailsLevel.Page, new LayoutPositionCreatorConflictFlags().setDefault(false), new LayoutPositionCreatorConflictFlags().setDefault(true));
            let pageText = this.getFormattedResult(layoutPosition.pageIndex + 1);
            this.replaceTextByInterval(this.getTopField().getResultInterval(), pageText);
        }
        else
            this.replaceTextByLayoutDependentRun(this.getTopField().getResultInterval());
        return true;
    }
    getPosition() {
        let field = this.getTopField();
        return field.showCode ? field.getCodeStartPosition() : field.getResultStartPosition();
    }
}
