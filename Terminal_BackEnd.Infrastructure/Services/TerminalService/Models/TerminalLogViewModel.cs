using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.TerminalService.Models {
    public class TerminalLogViewModel : TerminalLog {
        public string Status { get; set; } = string.Empty;
    }
}
