using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    [DataContract]
    public class GetServicesResponse {
        [DataMember(Name = "services")]
        public string[] Services { get; set; } = [];
    }
}
