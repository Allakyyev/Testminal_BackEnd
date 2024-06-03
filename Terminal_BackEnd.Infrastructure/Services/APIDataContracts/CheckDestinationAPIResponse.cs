using System.Runtime.Serialization;
using Terminal_BackEnd.Infrastructure.Services.APIDataContracts;

namespace Terminal_BackEnd.Infrastructure.Services.DataContracts {
    [DataContract]
    public class CheckDestinationAPIResponse : APIRequestBase {
        [DataMember]
        public bool Success { get; set; }
    }
}
