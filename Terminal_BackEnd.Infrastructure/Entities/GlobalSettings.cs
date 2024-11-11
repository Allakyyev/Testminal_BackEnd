namespace Terminal_BackEnd.Infrastructure.Entities {
    public enum GlobalSettingKey {
        LimitAmountOfOneTransaction = 0,
        LimitDaySumAmountOfPnone = 1
    }
    public class GlobalSetting : BaseEntity {
        public required GlobalSettingKey Key { get; set; }
        public required string Value { get; set; }
    }
}
