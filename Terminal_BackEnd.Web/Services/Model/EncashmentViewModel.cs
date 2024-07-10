using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Web.Services.Model {
    public class EncashmentViewModel : Encashment {
        public string? TerminalName { get; set; }
        public string? TerminalOwner { get; set; }
    }
}
