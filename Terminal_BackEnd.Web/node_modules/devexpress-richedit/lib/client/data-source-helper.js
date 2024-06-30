import dxDataSource from 'devextreme/data/data_source';
export class DataSourceHelper {
    static getDxDataSource(datasource) {
        if (datasource instanceof dxDataSource)
            return datasource;
        return new dxDataSource(datasource);
    }
}
