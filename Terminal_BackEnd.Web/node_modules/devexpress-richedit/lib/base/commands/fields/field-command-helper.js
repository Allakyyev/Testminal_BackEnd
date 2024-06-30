import { Field } from '../../../core/model/fields/field';
import { FieldsWaitingForUpdate } from '../../../core/model/fields/tree-creator';
import { ModelIterator } from '../../../core/model/model-iterator';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
export class FieldCommandHelper {
    static findTocFieldBySelection(subDocument, selection) {
        const fields = subDocument.fields;
        if (!fields.length)
            return null;
        let field;
        let isToc = false;
        let currentInterval = selection.intervals[0].clone();
        if (selection.isCollapsed()) {
            currentInterval.length++;
            const fieldIndex = Field.normedBinaryIndexOf(fields, currentInterval.start);
            if (fieldIndex < 0)
                return null;
            field = fields[fieldIndex];
            do
                isToc = this.isTocField(subDocument, field);
            while (!isToc && (field = field.parent));
        }
        else {
            let fieldIndex = Math.max(0, Field.normedBinaryIndexOf(fields, currentInterval.start));
            field = fields[fieldIndex].getAbsolutelyTopLevelField();
            for (fieldIndex = field.index; field = fields[fieldIndex]; fieldIndex++)
                if (isToc = this.isTocField(subDocument, field) || field.getFieldStartPosition() >= currentInterval.end)
                    break;
        }
        if (!isToc || !IntervalAlgorithms.getIntersectionNonNullLength(field.getAllFieldInterval(), currentInterval))
            return null;
        return field;
    }
    static isTocField(subDocument, field) {
        const iterator = new ModelIterator(subDocument, true);
        iterator.setPosition(field.getCodeStartPosition());
        return FieldsWaitingForUpdate.findName(iterator).fieldName == FieldsWaitingForUpdate.TOC_NAME;
    }
}
