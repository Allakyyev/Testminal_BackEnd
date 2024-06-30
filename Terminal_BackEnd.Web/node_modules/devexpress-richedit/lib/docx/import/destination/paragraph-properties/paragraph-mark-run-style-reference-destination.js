import { RunStyleReferenceBaseDestination } from '../style/run-style-reference-base-destination';
export class ParagraphMarkRunStyleReferenceDestination extends RunStyleReferenceBaseDestination {
    assignCharacterStyle(style) {
        this.data.subDocumentInfo.paragraphImporter.parMarkCharacterStyle = style;
    }
}
