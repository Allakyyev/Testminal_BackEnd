using System.Runtime.Serialization;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class TerminalLogRequest : APIRequestBase {
        [DataMember(Name = "logInfo")]
        public string LogInfo { get; set; } = String.Empty;

        [DataMember(Name = "type")]
        public LogType Type { get; set; }
    }
}
