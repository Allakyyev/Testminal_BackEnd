import { LayoutBoxType } from './layout-box';
import { LayoutFieldCodeStartBox } from './layout-field-code-start-box';
export class LayoutFieldCodeEndBox extends LayoutFieldCodeStartBox {
    clone() {
        const newObj = new LayoutFieldCodeEndBox(this.characterProperties, this.colorInfo);
        newObj.copyFrom(this);
        return newObj;
    }
    getType() {
        return LayoutBoxType.FieldCodeEnd;
    }
    getBoxChar() {
        return "}";
    }
}
