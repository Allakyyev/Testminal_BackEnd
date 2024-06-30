import { GridCalculatorAuto } from './calculators/grid-calculator-auto';
import { GridCalculatorFixed } from './calculators/grid-calculator-fixed';
import { TablePropertiesCache } from './calculators/table-properties-cache';
import { Grid } from './grid';
export function createGrid(table, boxIterator, avaliableSpacing, innerClientProperties) {
    const subDocument = boxIterator.subDocument;
    const grid = new Grid(table);
    const cache = {};
    cache[table.index] = new TablePropertiesCache(subDocument.documentModel, table, grid, innerClientProperties);
    const endPos = table.getEndPosition();
    for (let i = table.index + 1, innerTable; (innerTable = subDocument.tables[i]) && innerTable.getStartPosition() < endPos; i++)
        cache[innerTable.index] = new TablePropertiesCache(subDocument.documentModel, innerTable, new Grid(innerTable), innerClientProperties);
    const currentCache = cache[table.index];
    grid.columns = new (currentCache.isFixedAlgoritm ? GridCalculatorFixed : GridCalculatorAuto)(grid, cache, boxIterator, avaliableSpacing)
        .getColumns();
    return grid;
}
