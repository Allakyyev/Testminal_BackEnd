using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services {
    public class SettingsService : ISettingsService {
        private readonly AppDbContext _dbContex;
        public SettingsService(AppDbContext dbContext) {
            this._dbContex = dbContext;
        }
        IEnumerable<GlobalSetting> ISettingsService.GetGlobalSettings() {
            var resulst = _dbContex.GlobalSettings.ToList();
            return resulst;
        }

        void ISettingsService.UpdateGlobalSetting(int id, string value) {
            var setting = _dbContex.GlobalSettings.FirstOrDefault(s => s.Id == id);
            if(setting != null) {
                setting.Value = value;
                _dbContex.Update<GlobalSetting>(setting);
                _dbContex.SaveChanges();
            }
        }

        public static string GetLocalizationString(GlobalSettingKey key) {
            switch(key) {
                case GlobalSettingKey.LimitDaySumAmountOfPnone:
                    return "Дневной лимит на телефонный номер";
                case GlobalSettingKey.LimitAmountOfOneTransaction:
                    return "Лимит на транзакцию";
                default: return string.Empty;
            }
        }
    }
}
