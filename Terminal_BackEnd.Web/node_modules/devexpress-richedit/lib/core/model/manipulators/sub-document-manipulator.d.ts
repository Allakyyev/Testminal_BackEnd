import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { SubDocumentInterval, SubDocumentPosition, SubDocument } from '../sub-document';
import { BaseManipulator } from './base-manipulator';
import { SubDocumentInserterOptions } from './document/sub-document-inserter';
export declare class SubDocumentManipulator extends BaseManipulator {
    insertSubDocument(targetSubDocPos: SubDocumentPosition, sourceInfo: SubDocumentInterval, options?: SubDocumentInserterOptions): IInsertSubDocumentResult;
}
export interface IInsertSubDocumentResult {
    insetedInterval: FixedInterval;
    newSubDocuments: SubDocument[];
}
//# sourceMappingURL=sub-document-manipulator.d.ts.map