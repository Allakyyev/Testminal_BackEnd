using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.APIDataContracts {
    [DataContract]
    public class CheckDestinationRequest : APIRequestBase {
        [DataMember(Name = "serviceKey")]
        public required string ServiceKey { get; set; }

        [DataMember(Name = "msisdnEncrypted")]
        public required string MsisdnEncrypted { get; set; }
        
        public required string Msisdn { get; set; }
    }
}
