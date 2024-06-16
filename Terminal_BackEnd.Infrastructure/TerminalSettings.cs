namespace Terminal_BackEnd.Infrastructure {
    public class TerminalSettings {
        public required string ServerName { get; set; }
        public required string UserName { get; set; }
        public required string DealerKey { get; set; }
        public required string CallBackTransaction { get; set; }
        public required string CallBackCheckDestination { get; set; }
    }
}
