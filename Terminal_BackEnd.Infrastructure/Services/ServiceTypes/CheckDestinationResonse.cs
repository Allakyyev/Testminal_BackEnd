using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    [DataContract]
    public class CheckDestinationResonse {
        /// <summary>
        /// 'DECLINED | SUCCESS'
        /// </summary>
        [DataMember(Name="status")]
        public required string Status { get; set; }

        /// <summary>
        /// 'DECLINED-BY-SEVICE'
        /// </summary>
        [DataMember(Name = "reason")]
        public string? Reason { get; set; }

        /// <summary>
        /// 'NOT-AVAILABLE|OK|NOT-ALLOWED|RETRY-LATER|GW-PROCESSING'
        /// </summary>
        [DataMember(Name = "state")]
        public string? State { get; set; }

        /// <summary>
        /// service_key of check destinaiton
        /// </summary>
        [DataMember(Name = "service")]
        public string? Service { get; set; }

        /// <summary>
        /// msisdn | phone number
        /// </summary>
        [DataMember(Name = "destination")]
        public string? Destination { get; set; }
    }
}
