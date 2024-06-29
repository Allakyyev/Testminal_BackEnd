using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class APIRequestBase {
        [DataMember(Name = "terminalIdEncrypted")]
        public string? TerminalIdEncrypted { get; set; }
    }

    [DataContract]
    public class APIResponseBase {
        [DataMember(Name = "success")]
        public bool Success { get; set; }
    }
}
