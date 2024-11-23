namespace Terminal_BackEnd.Infrastructure.Entities {

    public enum LogType {
        Info = 0,
        Warning = 1,
        Error = 2,
        Repaired = 3
    }
    public class TerminalLog :BaseEntity {
        public string LogInfo { get; set; } = string.Empty;
        public DateTime LogDate { get; set; }
        public LogType Type { get; set; }
        public required long TerminalId { get; set; }
        public Terminal? Terminal { get; set; }
    }
}
