import { RunStyleReferenceBaseDestination } from '../style/run-style-reference-base-destination';
export class RunStyleReferenceDestination extends RunStyleReferenceBaseDestination {
    assignCharacterStyle(style) {
        this.data.subDocumentInfo.characterImporter.style = style;
    }
}
