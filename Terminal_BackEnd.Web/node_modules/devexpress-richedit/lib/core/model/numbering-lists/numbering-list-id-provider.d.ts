import { DocumentModel } from '../document-model';
import { AbstractNumberingList, NumberingList, NumberingListBase } from './numbering-list';
import { IListLevel, IOverrideListLevel, ListLevel } from './list-level';
export declare abstract class ListIdProviderBase<T extends NumberingListBase<TListLevel>, TListLevel extends IListLevel> {
    documentModel: DocumentModel;
    lastId: number;
    protected map: Record<number, boolean>;
    constructor(documentModel: DocumentModel);
    private getMap;
    getNextId(): number;
    protected abstract getLists(): T[];
}
export declare class NumberingListIdProvider extends ListIdProviderBase<NumberingList, IOverrideListLevel> {
    getLists(): NumberingList[];
    clone(model: DocumentModel): NumberingListIdProvider;
}
export declare class AbstractNumberingListIdProvider extends ListIdProviderBase<AbstractNumberingList, ListLevel> {
    getLists(): AbstractNumberingList[];
    clone(model: DocumentModel): AbstractNumberingListIdProvider;
}
//# sourceMappingURL=numbering-list-id-provider.d.ts.map