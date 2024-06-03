using System.Runtime.Serialization;

namespace Terminal_BackEnd.Infrastructure.Services.ServiceTypes {
    [DataContract]
    public class AddTransactionResponse {
        /// <summary>
        /// 'DUPLICATE'
        /// </summary>
        [DataMember(Name = "status")]
        public required string Status { get; set; }

        /// <summary>
        /// long: transaction reference number of initial transaction
        /// </summary>
        [DataMember(Name = "ref-num")]
        public required long RefNum { get; set; }

        /// <summary>
        /// service_key of initial transaction
        /// </summary>
        [DataMember(Name = "service")]
        public string? Service { get; set; }

        /// <summary>
        /// msisdn | phone number of initial transaction
        /// </summary>
        [DataMember(Name = "destination")]
        public string? Destination { get; set; }

        /// <summary>
        /// amount of initial transaction
        /// </summary>
        [DataMember(Name = "amount")]
        public int? Amount { get; set; }

        /// <summary>
        ///  state of initial transaction
        /// </summary>
        [DataMember(Name = "state")]
        public string? State { get; set; }

        // <summary>
        /// DECLINED-BY-[SERVICE|BALANCE]
        /// </summary>
        [DataMember(Name = "reason")]
        public string? Reason { get; set; }
    }
}