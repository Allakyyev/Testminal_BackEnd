import { TabAlign } from '../../../../../core/model/paragraph/paragraph';
import { RulerTemplateManager } from '../template-manager';
export class RulerTabUtils {
    static getTabTitlePropertyName(align) {
        let alignString = "";
        switch (align) {
            case TabAlign.Left:
                alignString = "Left";
                break;
            case TabAlign.Right:
                alignString = "Right";
                break;
            case TabAlign.Center:
                alignString = "Center";
                break;
            case TabAlign.Decimal:
                alignString = "Decimal";
                break;
        }
        return "tab" + alignString;
    }
    static getSpriteClassName(tabAlign, settings) {
        switch (tabAlign) {
            case TabAlign.Left:
                return settings.styles.tabImages.left.spriteCssClass;
            case TabAlign.Right:
                return settings.styles.tabImages.right.spriteCssClass;
            case TabAlign.Center:
                return settings.styles.tabImages.center.spriteCssClass;
            case TabAlign.Decimal:
                return settings.styles.tabImages.decimal.spriteCssClass;
        }
        return "";
    }
    static getTemplate(tabAlign) {
        switch (tabAlign) {
            case TabAlign.Left:
                return RulerTemplateManager.getLeftTabElementTemplate();
            case TabAlign.Right:
                return RulerTemplateManager.getRightTabElementTemplate();
            case TabAlign.Center:
                return RulerTemplateManager.getCenterTabElementTemplate();
            case TabAlign.Decimal:
                return RulerTemplateManager.getDecimalTabElementTemplate();
        }
    }
}
