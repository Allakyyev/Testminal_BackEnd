using DevExpress.Utils;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Web.DataSources.Dashboards;
using Terminal_BackEnd.Web.ReportDataSources;

namespace Terminal_BackEnd.Web {
    public class RegisterTrustedTypes {
        public static void Register() {
            DeserializationSettings.RegisterTrustedClass(typeof(TransactionsByDayDataSource));
            DeserializationSettings.RegisterTrustedClass(typeof(AppDbContext));
            DeserializationSettings.RegisterTrustedClass(typeof(TerminalActivitiesDataSource));
            DeserializationSettings.RegisterTrustedClass(typeof(TerminalActivityPeriod));
        }
    }
}
