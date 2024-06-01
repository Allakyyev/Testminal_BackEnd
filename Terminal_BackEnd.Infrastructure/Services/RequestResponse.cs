using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services {
    [DataContract]
    public class RequestResponse {
        [DataMember(Name = "status")]
        public string? Status { get; set; }

        [DataMember(Name = "error-code")]
        public int ErrorCode { get; set; }

        [DataMember(Name = "error-msg")]
        public string? ErrorMessage { get; set; }

        [DataMember(Name = "result")]
        public object? Result { get; set; }
    }
}
