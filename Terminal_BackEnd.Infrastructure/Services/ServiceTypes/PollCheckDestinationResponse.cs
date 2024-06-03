using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    public class PollCheckDestinationResponse {
        /// <summary>
        /// 'DECLINED | SUCCESS'
        /// </summary>
        [DataMember(Name = "status")]
        public required string Status { get; set; }

        /// <summary>
        /// 'NOT-AVAILABLE|OK|NOT-ALLOWED|RETRY-LATER|GW-PROCESSING'
        /// </summary>
        [DataMember(Name = "state")]
        public required string State { get; set; }

        /// <summary>
        /// service_key of check destinaiton
        /// </summary>
        [DataMember(Name = "service")]
        public required string Service { get; set; }

        /// <summary>
        /// msisdn | phone number
        /// </summary>
        [DataMember(Name = "destination")]
        public required string Destination { get; set; }
    }
}
