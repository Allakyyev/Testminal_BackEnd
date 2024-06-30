import { AnchorInfo } from '../../../core/model/floating-objects/anchor-info';
import { AnchorObjectHorizontalPositionAlignment, AnchorObjectTextWrapType, AnchorObjectVerticalPositionAlignment, RelativeHeightType, RelativeWidthType } from '../../../core/model/floating-objects/enums';
import { AnchorTextBoxSize } from '../../../core/model/floating-objects/sizes';
import { TextBoxProperties } from '../../../core/model/floating-objects/text-box-properties';
import { RichUtils } from '../../../core/model/rich-utils';
import { AnchoredTextBoxRun } from '../../../core/model/runs/anchored-text-box-run';
import { Shape } from '../../../core/model/shapes/shape';
import { MaskedCharacterPropertiesBundle } from '../../../core/rich-utils/properties-bundle';
import { Constants } from '@devexpress/utils/lib/constants';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { RtfDrawingKeywords } from '../../translation-table/rtf-drawing-keywords';
import { RtfTopmostShapeBoundsCalculator } from '../model/shape/calculators/rtf-topmost-shape-bounds-calculator';
import { RtfShapeImportHelper } from '../model/shape/rtf-shape-helpers/rtf-shape-import-helper';
import { RtfBaseImporter } from './importer-base';
export class RtfShapeImporter extends RtfBaseImporter {
    pushState() {
    }
    popState() {
    }
    startImportSubDocument() {
    }
    finalizeSubDocument() {
    }
    insertShape(importer, shapeProperties) {
        const subDocId = shapeProperties.getPropertyOrNull(RtfDrawingKeywords.ShapeText);
        if (!subDocId)
            return;
        const pos = importer.importers.character.logPosition;
        const paragraph = importer.importers.paragraph.paragraph;
        const characterStyle = importer.importers.style.character.style;
        const maskedCharacterProperties = importer.importers.character.characterFormatting.coreProperties;
        const anchorInfo = new AnchorInfo();
        anchorInfo.wrapType = AnchorObjectTextWrapType.None;
        anchorInfo.horizontalPositionAlignment = AnchorObjectHorizontalPositionAlignment.None;
        anchorInfo.verticalPositionAlignment = AnchorObjectVerticalPositionAlignment.None;
        const run = new AnchoredTextBoxRun(pos, paragraph, new MaskedCharacterPropertiesBundle(maskedCharacterProperties, characterStyle), new Shape(), subDocId, new AnchorTextBoxSize(true, 0, new Size(Constants.MIN_SAFE_INTEGER, Constants.MIN_SAFE_INTEGER), new Size(0, 0), RelativeWidthType.Margin, RelativeHeightType.Margin, true, true), anchorInfo, -1, new TextBoxProperties(new Margins(144, 144, 72, 72)));
        importer.importers.character.addRun(run, RichUtils.specialCharacters.ObjectMark);
        new RtfShapeImportHelper(shapeProperties).applyAnchoredTextBoxRunProperties(run);
        run.size.absoluteSize = new RtfTopmostShapeBoundsCalculator(shapeProperties).applyTransform2DAndGetActualSize(run.anchorInfo, run.size);
    }
}
