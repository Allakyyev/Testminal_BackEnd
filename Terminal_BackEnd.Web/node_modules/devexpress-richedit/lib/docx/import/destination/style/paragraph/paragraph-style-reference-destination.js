import { ParagraphStyleReferenceBaseDestination } from './paragraph-style-reference-base-destination';
export class ParagraphStyleReferenceDestination extends ParagraphStyleReferenceBaseDestination {
    assignParagraphStyle(style) {
        this.data.subDocumentInfo.paragraphImporter.style = style;
    }
}
