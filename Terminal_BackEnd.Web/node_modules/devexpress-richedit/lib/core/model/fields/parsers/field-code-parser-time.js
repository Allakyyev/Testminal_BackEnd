import { FieldName } from '../names';
import { FieldCodeParserDate } from './field-code-parser-date';
export class FieldCodeParserTime extends FieldCodeParserDate {
    get name() { return FieldName.Time; }
    getDefaultFormat() {
        return this.modelManager.richOptions.fields.defaultTimeFormat;
    }
}
