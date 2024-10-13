using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class RegisterTerminalRequest {
        [DataMember(Name = "terminalId")]
        public string TerminalId { get; set; }

        [DataMember(Name = "motherboardId")]
        public string MotherboardId { get; set; }

        [DataMember(Name = "cpuId")]
        public string CpuId { get; set; }
    }
}
