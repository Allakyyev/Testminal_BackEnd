using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.TerminalService.Models {
    public class TerminalViewModel {
        public long Id { get; set; }
        public required string TerminalId { get; set; }
        public required string Name { get; set; }
        public required string Status { get; set; }
        public required string Owner { get; set; }
        public long CurrentTotal { get;set; }
        public string? DeviceMotherBoardId { get; set; }
        public string? DeviceCPUId { get; set; }
        public string? Healthy { get; set; }
        public LogType LogType { get; set; }
    }
}
