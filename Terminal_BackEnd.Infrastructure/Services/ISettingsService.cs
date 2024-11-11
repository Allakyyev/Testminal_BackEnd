using Terminal_BackEnd.Infrastructure.Entities;

namespace Terminal_BackEnd.Infrastructure.Services {
    public interface ISettingsService {
        public IEnumerable<GlobalSetting> GetGlobalSettings();
        public void UpdateGlobalSetting(int id, string value);
    }
}
