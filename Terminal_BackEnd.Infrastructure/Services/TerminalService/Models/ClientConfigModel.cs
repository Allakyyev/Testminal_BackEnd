namespace Terminal_BackEnd.Infrastructure.Services.TerminalService.Models {
    public class ClientConfigModel {
        public string TerminalId { get; set; }
        public string TerminalKey { get; set; }
        public string BackendBaseUri { get; set; }
        public string ComPort { get; set; }
        public string PhoneNumber { get; set; }
        public string TerminalNumber { get; set; }
    }
}
