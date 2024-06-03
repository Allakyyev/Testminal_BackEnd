using System.Runtime.Serialization;
using Newtonsoft.Json.Linq;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    [DataContract]
    public class RequestResponse {
        [DataMember(Name = "status")]
        public string? Status { get; set; }

        [DataMember(Name = "error-code")]
        public int ErrorCode { get; set; }

        [DataMember(Name = "error-msg")]
        public string? ErrorMessage { get; set; }

        [DataMember(Name = "result")]
        public JObject? Result { get; set; }

        public HttpResponseMessage? HttpResponseMessage { get; set; }
    }
}
