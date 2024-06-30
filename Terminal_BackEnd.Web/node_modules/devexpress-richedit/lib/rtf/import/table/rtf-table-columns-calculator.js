import { RtfTableGrid } from './table-grid';
export class RtfTableColumnsCalculator {
    calculate(table, tableIndent) {
        if (!table)
            throw Error("table is Null!");
        let result = new RtfTableGrid();
        result.collection.push(tableIndent);
        table.rows.forEach((row) => {
            const rowColumns = this.getRowColumns(row);
            result = this.merge(rowColumns.collection, result.collection);
        });
        return result;
    }
    merge(source, destination) {
        const result = new RtfTableGrid();
        let sourceIndex = 0;
        let destinationIndex = 0;
        while (sourceIndex < source.length && destinationIndex < destination.length) {
            if (source[sourceIndex] <= destination[destinationIndex]) {
                result.collection.push(source[sourceIndex]);
                if (source[sourceIndex] == destination[destinationIndex])
                    destinationIndex++;
                sourceIndex++;
            }
            else {
                result.collection.push(destination[destinationIndex]);
                destinationIndex++;
            }
        }
        if (destinationIndex < destination.length) {
            for (; destinationIndex < destination.length; destinationIndex++)
                result.collection.push(destination[destinationIndex]);
        }
        else if (sourceIndex < source.length) {
            for (; sourceIndex < source.length; sourceIndex++)
                result.collection.push(source[sourceIndex]);
        }
        return result;
    }
    getRowColumns(row) {
        const result = new RtfTableGrid();
        let left = row.properties.left;
        result.collection.push(left);
        row.cells.forEach((cell) => {
            const right = cell.properties.right;
            if (right <= left)
                result.collection.push(left);
            else {
                result.collection.push(right);
                left = right;
            }
        });
        return result;
    }
}
