import { AnchoredObjectLevelType } from '../../../layout/main-structures/layout-boxes/layout-anchored-object-box';
export function posAndAncInfoOneSubDocComparer(a, b) {
    const aAncInfo = a.anchorInfo;
    const bAncInfo = b.anchorInfo;
    switch (aAncInfo.levelType) {
        case AnchoredObjectLevelType.BehindText:
            if (bAncInfo.levelType != AnchoredObjectLevelType.BehindText)
                return -1;
            break;
        case AnchoredObjectLevelType.BeforeText:
        case AnchoredObjectLevelType.InText:
            if (bAncInfo.levelType == AnchoredObjectLevelType.BehindText)
                return 1;
            break;
    }
    const cmpZOrder = aAncInfo.zOrder - bAncInfo.zOrder;
    return cmpZOrder ? cmpZOrder : b.position - a.position;
}
export function getLayoutAnchoredObjectBoxInitialComparer(anchorObjectsPositionInfo) {
    const getPos = (obj) => anchorObjectsPositionInfo.getPosition(obj.objectId);
    return (a, b) => {
        const zOrderDiff = a.anchorInfo.zOrder - b.anchorInfo.zOrder;
        return zOrderDiff ? zOrderDiff : getPos(a) - getPos(b);
    };
}
export function getLayoutAnchoredObjectBoxComparer(anchorObjectsPositionInfo) {
    const getPos = (obj) => anchorObjectsPositionInfo.getPosition(obj.objectId);
    return (a, b) => {
        const cmpLevel = a.rendererLevel - b.rendererLevel;
        return cmpLevel ? cmpLevel : (a.anchorInfo.zOrder != b.anchorInfo.zOrder ? a.anchorInfo.zOrder - b.anchorInfo.zOrder : getPos(a) - getPos(b));
    };
}
