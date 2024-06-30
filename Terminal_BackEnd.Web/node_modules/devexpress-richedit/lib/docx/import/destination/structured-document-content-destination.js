import { TransparentDestination } from './destination';
import { StructuredDocumentDestination } from './structured-document-destination';
export class StructuredDocumentContentDestination extends TransparentDestination {
    processCurrentElement(reader) {
        return reader.localName == 'sdt' ? new StructuredDocumentDestination(this.data) : super.processCurrentElement(reader);
    }
}
