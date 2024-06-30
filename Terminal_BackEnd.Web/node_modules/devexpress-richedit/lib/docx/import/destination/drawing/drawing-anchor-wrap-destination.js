import { __awaiter } from "tslib";
import { AnchorObjectTextWrapSide, AnchorObjectTextWrapType } from '../../../../core/model/floating-objects/enums';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { LeafElementDestination } from '../destination';
export class DrawingAnchorWrapNoneDestination extends LeafElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.anchorDestination = anchorDestination;
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.anchorDestination.floatingObject.wrapType = AnchorObjectTextWrapType.None;
        });
    }
}
export class DrawingAnchorWrapTopAndBottomDestination extends LeafElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.anchorDestination = anchorDestination;
    }
    processElementOpen(_reader) {
        return __awaiter(this, void 0, void 0, function* () {
            this.anchorDestination.floatingObject.wrapType = AnchorObjectTextWrapType.TopAndBottom;
        });
    }
}
export class DrawingAnchorPolygonDestinationBase extends LeafElementDestination {
    constructor(data, anchorDestination) {
        super(data);
        this.anchorDestination = anchorDestination;
    }
    processElementOpen(reader) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = reader.getAttribute('wrapText');
            if (!StringUtils.isNullOrEmpty(value)) {
                this.anchorDestination.floatingObject.wrapSide = this.data.readerHelper.getWpEnumValueCore(value, TranslationTables.floatingObjectTextWrapSideTable.importMap, AnchorObjectTextWrapSide.Both);
            }
        });
    }
}
export class DrawingAnchorWrapSquareDestination extends DrawingAnchorPolygonDestinationBase {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    processElementOpen(reader) {
        const _super = Object.create(null, {
            processElementOpen: { get: () => super.processElementOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.processElementOpen.call(this, reader);
            this.anchorDestination.floatingObject.wrapType = AnchorObjectTextWrapType.Square;
        });
    }
}
export class DrawingAnchorWrapThroughDestination extends DrawingAnchorPolygonDestinationBase {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    processElementOpen(reader) {
        const _super = Object.create(null, {
            processElementOpen: { get: () => super.processElementOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.processElementOpen.call(this, reader);
            this.anchorDestination.floatingObject.wrapType = AnchorObjectTextWrapType.Through;
        });
    }
}
export class DrawingAnchorWrapTightDestination extends DrawingAnchorPolygonDestinationBase {
    constructor(data, anchorDestination) {
        super(data, anchorDestination);
    }
    processElementOpen(reader) {
        const _super = Object.create(null, {
            processElementOpen: { get: () => super.processElementOpen }
        });
        return __awaiter(this, void 0, void 0, function* () {
            _super.processElementOpen.call(this, reader);
            this.anchorDestination.floatingObject.wrapType = AnchorObjectTextWrapType.Tight;
        });
    }
}
