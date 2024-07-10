using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class CreateEncashementRequest : APIRequestBase {
        [DataMember(Name = "checkSum")]
        public required string CheckSum { get;set; }
        [DataMember(Name = "checkSumEncrypted")]
        public required string CheckSumEncrypted { get; set; }
        [DataMember(Name = "encashmentPasscode")]
        public int EncashmentPasscode { get; set; }
    }
}
