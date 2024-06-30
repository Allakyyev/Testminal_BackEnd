import { FieldName } from '../names';
import { FieldCodeParserClientUpdatingBase } from './field-code-parser-client-updating-base';
export class FieldCodeParserNumPages extends FieldCodeParserClientUpdatingBase {
    get name() { return FieldName.NumPages; }
    fillResult() {
        this.setInputPositionState();
        if (this.subDocument.isMain()) {
            const numPagesText = this.layoutFormatterManager.layout.lastMaxNumPages.toString();
            this.replaceTextByInterval(this.getTopField().getResultInterval(), numPagesText);
        }
        else
            this.replaceTextByLayoutDependentRun(this.getTopField().getResultInterval());
        return true;
    }
}
