import { TransparentDestination } from './destination';
import { StructuredDocumentContentDestination } from './structured-document-content-destination';
export class StructuredDocumentDestination extends TransparentDestination {
    processCurrentElement(reader) {
        return reader.localName == 'sdtContent' ? new StructuredDocumentContentDestination(this.data) : super.processCurrentElement(reader);
    }
}
