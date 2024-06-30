import type { SubDocument } from './sub-document';
import type { DocumentModel } from './document-model';
export declare class SubDocumentCollection {
    private _collection;
    private _filteredCollection?;
    get filteredCollection(): Record<number, SubDocument>;
    get collection(): Record<number, SubDocument>;
    add(subDocument: SubDocument): void;
    delete(subDocumentId: number): void;
    replace(subDocumentId: number, replacedWithSubDocId?: number): void;
    restore(subDocumentId: number): void;
    clone(model: DocumentModel): SubDocumentCollection;
}
//# sourceMappingURL=sub-document-collection.d.ts.map