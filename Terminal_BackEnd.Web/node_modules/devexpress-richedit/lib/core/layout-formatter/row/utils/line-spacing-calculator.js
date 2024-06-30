import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Errors } from '@devexpress/utils/lib/errors';
import { ParagraphLineSpacingType } from '../../../model/paragraph/paragraph-properties';
export class LineSpacingCalculator {
    static create(lineSpacing, lineSpacingType) {
        switch (lineSpacingType) {
            case ParagraphLineSpacingType.AtLeast:
                return new AtLeastSpacingCalculator(Math.max(1, UnitConverter.twipsToPixelsF(lineSpacing)));
            case ParagraphLineSpacingType.Double:
                return new DoubleSpacingCalculator();
            case ParagraphLineSpacingType.Exactly:
                return new ExactlySpacingCalculator(Math.max(1, UnitConverter.twipsToPixelsF(lineSpacing)));
            case ParagraphLineSpacingType.Multiple:
                return new MultipleSpacingCalculator(lineSpacing !== 0 ? lineSpacing : 1);
            case ParagraphLineSpacingType.Sesquialteral:
                return new SesquialteralSpacingCalculator();
            case ParagraphLineSpacingType.Single:
            default:
                return new SingleSpacingCalculator();
        }
    }
    calculate(rowHeight, maxAscent, maxDescent, maxPictureHeight) {
        const maxTextHeight = maxAscent + maxDescent;
        if (maxTextHeight == 0)
            return rowHeight;
        const rowTextSpacing = this.calculateSpacing(maxTextHeight);
        if (!maxPictureHeight || maxAscent > maxPictureHeight)
            return rowTextSpacing;
        else {
            if (maxDescent == 0)
                return rowHeight;
            else
                return this.calculateSpacingInlineObjectCase(maxTextHeight, rowTextSpacing, maxPictureHeight, maxDescent);
        }
    }
}
export class MultipleSpacingCalculator extends LineSpacingCalculator {
    constructor(multiplier) {
        super();
        if (multiplier <= 0)
            throw new Error(argumentException("multiplier", multiplier));
        this.multiplier = multiplier;
    }
    calculateSpacing(maxTextHeight) {
        return maxTextHeight * this.multiplier;
    }
    calculateSpacingInlineObjectCase(maxTextHeight, rowTextSpacing, maxPictureHeight, maxDescent) {
        return maxPictureHeight + maxDescent + (rowTextSpacing - maxTextHeight);
    }
}
export class SingleSpacingCalculator extends LineSpacingCalculator {
    calculateSpacing(maxTextHeight) {
        return maxTextHeight;
    }
    calculateSpacingInlineObjectCase(_maxTextHeight, _rowTextSpacing, maxPictureHeight, maxDescent) {
        return maxPictureHeight + maxDescent;
    }
}
export class DoubleSpacingCalculator extends LineSpacingCalculator {
    calculateSpacing(maxTextHeight) {
        return 2 * maxTextHeight;
    }
    calculateSpacingInlineObjectCase(maxTextHeight, rowTextSpacing, maxPictureHeight, maxDescent) {
        return maxPictureHeight + maxDescent + (rowTextSpacing - maxTextHeight);
    }
}
export class SesquialteralSpacingCalculator extends LineSpacingCalculator {
    calculateSpacing(maxTextHeight) {
        return 3 * maxTextHeight / 2;
    }
    calculateSpacingInlineObjectCase(maxTextHeight, rowTextSpacing, maxPictureHeight, maxDescent) {
        return maxPictureHeight + maxDescent + (rowTextSpacing - maxTextHeight);
    }
}
export class ExactlySpacingCalculator extends LineSpacingCalculator {
    constructor(lineSpacing) {
        super();
        this.lineSpacing = lineSpacing;
    }
    calculateSpacing(_maxTextHeight) {
        throw new Error(Errors.NotImplemented);
    }
    calculateSpacingInlineObjectCase(_maxTextHeight, _rowTextSpacing, _maxPictureHeight, _maxDescent) {
        throw new Error(Errors.NotImplemented);
    }
    calculate(_rowHeight, _maxAscent, _maxDescent, _maxPictureHeight) {
        return this.lineSpacing;
    }
}
export class AtLeastSpacingCalculator extends SingleSpacingCalculator {
    constructor(lineSpacing) {
        super();
        if (lineSpacing <= 0)
            throw new Error(argumentException("lineSpacing", lineSpacing));
        this.lineSpacing = lineSpacing;
    }
    calculate(rowHeight, maxAscent, maxDescent, maxPictureHeight) {
        var result = super.calculate(rowHeight, maxAscent, maxDescent, maxPictureHeight);
        return Math.max(result, this.lineSpacing);
    }
}
function argumentException(argument, value) {
    return argument + ' is not a valid value for ' + (value ? value.toString() : typeof (value));
}
