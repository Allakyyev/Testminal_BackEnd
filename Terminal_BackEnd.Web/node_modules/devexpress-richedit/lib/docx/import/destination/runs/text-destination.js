import { StringHelper } from '../../../../core/formats/utils/string-helper';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ElementDestination } from '../destination';
export class TextDestination extends ElementDestination {
    get elementHandlerTable() {
        return {};
    }
    processText(reader) {
        let text = reader.value;
        text = this.replaceLineBreakOnSpace(text);
        if (!StringUtils.isNullOrEmpty(text)) {
            const plainText = StringHelper.replaceParagraphMarksWithLineBreaks(text);
            if (!StringUtils.isNullOrEmpty(plainText))
                this.data.subDocumentInfo.characterImporter.insertText(plainText);
        }
        return true;
    }
    replaceLineBreakOnSpace(text) {
        return text.replace('\n', ' ');
    }
}
