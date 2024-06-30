import { AnchorObjectsPositionInfo } from '../../layout/document-layout';
import { PageAnchoredObjectHolder } from './page-anchored-object-holder';
import { CompatibilityMode } from '../../model/document-model';
export declare class RenderLevelCalculator {
    private static subGroupTypes;
    private static reduceRenderOrder;
    maxRenderLevels: number;
    get mainPageAreaLevel(): number;
    get headerFooterPageAreasLevel(): number;
    get renderMainPageAreaLevel(): number;
    get renderHeaderFooterPageAreasLevel(): number;
    private realGroupLevelsBounds;
    private renderGroupLevelsBounds;
    getRenderLevel(realLevel: number): number;
    calcLevels(pageAnchoredObjectHolder: PageAnchoredObjectHolder, anchorObjectsPositionInfo: AnchorObjectsPositionInfo, compatibilityMode: CompatibilityMode): void;
    equals(other: RenderLevelCalculator): boolean;
    private getObjects;
    private getGroups;
    private fillGroupsBounds;
    private translateToBounds;
    private reduceLevels;
}
//# sourceMappingURL=render-level-calculator.d.ts.map