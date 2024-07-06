using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Web.Services.Model {
    public class TransactionViewModel : Transaction {
        public string TermianlName { get; set; }
        public string OwnerName { get; set; }
    }
}
