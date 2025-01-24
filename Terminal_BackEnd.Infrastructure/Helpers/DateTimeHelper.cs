namespace Terminal_BackEnd.Infrastructure.Helpers {
    public static class DateTimeHelper {
        public static long GetCurrentEpochTime() {
            DateTimeOffset now = DateTimeOffset.UtcNow;
            return now.ToUnixTimeSeconds();
        }

        public static DateTime ToLocalTimeFromUnixSec(long unixSeconds) {
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(unixSeconds);
            DateTimeOffset localDateTimeOffset = dateTimeOffset.ToLocalTime();
            return localDateTimeOffset.DateTime;
        }
    }
}
