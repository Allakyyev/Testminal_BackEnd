using System.Runtime.Serialization;

namespace Terminal_BackEnd.Web.Models {
    [DataContract]
    public class ListItem {
        [DataMember(Name = "id")]
        public long Id { get; set; }
        [DataMember(Name = "name")]
        public string Name { get; set; }
    }
}
