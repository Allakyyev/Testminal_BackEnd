using DevExpress.DataAccess.Web;
using Terminal_BackEnd.Web.ReportDataSources;

namespace Terminal_BackEnd.Web.DataSources.Reports {
    public class CustomObjectDataSource : IObjectDataSourceWizardTypeProvider {
        public IEnumerable<Type> GetAvailableTypes(string context) {
            return new[] {
                typeof(TransactionsByDayDataSource),
            };
        }
    }
}
