using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class ForceAddRequest {
        [DataMember(Name = "serviceKey")]
        public required string ServiceKey { get; set; }

        [DataMember(Name = "amount")]
        public int Amount { get; set; }

        [DataMember(Name = "msisdn")]
        public required string Msisdn { get; set; }

        [DataMember(Name = "terminalId")]
        public long TerminalId { get; set; }

    }
}
