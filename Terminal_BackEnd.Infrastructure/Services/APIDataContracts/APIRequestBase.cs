using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class APIRequestBase {
        [DataMember(Name = "terminalId")]
        public int TerminalId {  get; set; }

        [DataMember(Name = "passwordHash")]
        public int PasswordHash { get; set; }
    }
}
