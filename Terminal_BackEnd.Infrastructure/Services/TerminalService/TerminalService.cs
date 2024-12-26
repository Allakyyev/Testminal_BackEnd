using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.TerminalService.Models;

namespace Terminal_BackEnd.Infrastructure.Services.TerminalService {
    public interface ITerminalService {
        List<Terminal> GetAllTerminals();
        List<Terminal> GetAllTerminalsByUser(string userName);
        Terminal? GetTerminalById(long terminalId);
        long GetTerminalCurrenTotal(long terminalId);
        void UpdateTerminal(Terminal terminal);
        void CreateTerminal(CreateTerminalModel terminalModel);
        void DeleteTerminalById(long terminalId);
        (byte[], string) GetPasswordEncrypt(long terminalId);
        bool RegisterTerminal(string terminalId, string motherboardId, string cpuId);
        bool LogTerminal(long terminalId, string info, LogType type, DateTime date);
        List<TerminalLogViewModel> TerminalLogs(long terminalId);
        ClientConfigModel? GetClientConfigModel(long terminalId, string baseUri);
        void UpdateTerminalPing(long terminalId);
    }

    public class TerminalService : ITerminalService {
        private readonly AppDbContext _dbContex;
        private readonly IMapper mapper;

        static int GetRandomInt() {
            byte[] randomNumber = new byte[4];
            RandomNumberGenerator.Fill(randomNumber);
            return BitConverter.ToInt32(randomNumber, 0) & int.MaxValue;
        }

        public TerminalService(AppDbContext dbContext, IMapper mapper) {
            this._dbContex = dbContext;
            this.mapper = mapper;
        }

        public bool RegisterTerminal(string terminalId, string motherboardId, string cpuId) {
            try {
                var terminal = _dbContex.Terminals.FirstOrDefault(t => t.TerminalId == terminalId);
                if(terminal == null) return false;
                if(!string.IsNullOrEmpty(terminal.DeviceCPUId) && terminal.DeviceCPUId != cpuId) return false;
                if(!string.IsNullOrEmpty(terminal.DeviceMotherBoardId) && terminal.DeviceMotherBoardId != motherboardId) return false;

                terminal.DeviceCPUId = cpuId;
                terminal.DeviceMotherBoardId = motherboardId;
                _dbContex.Update(terminal);
                _dbContex.SaveChanges();
                return true;
            } catch(Exception ex) {
                return false;
            }
        }

        public void CreateTerminal(CreateTerminalModel terminalModel) {
            Terminal newTerminal = mapper.Map<Terminal>(terminalModel);
            string password = String.Empty;
            using(Aes aes = Aes.Create()) {
                aes.GenerateKey();
                password = Convert.ToBase64String(aes.Key);
            }
            newTerminal.Password = AesEncryptionHelper.EncryptString(password);
            newTerminal.EncashmenPassCode = GetRandomInt();
            newTerminal.CreatedDate = DateTime.Now;
            _dbContex.Terminals.Add(newTerminal);
            _dbContex.SaveChanges();
        }

        public void DeleteTerminalById(long key) {
            var terminal = _dbContex.Terminals.Find(key);
            if(terminal != null) {
                _dbContex.Terminals.Remove(terminal);
                _dbContex.SaveChanges();
            }
        }

        public Terminal? GetTerminalById(long terminalId) {
            return _dbContex.Terminals.Find(terminalId);
        }

        public List<Terminal> GetAllTerminals() {
            return _dbContex.Terminals.Include(i => i.ApplicationUser).Include(t => t.TerminalLogs).Include(t => t.Transactions).ToList();
        }

        public List<Terminal> GetAllTerminalsByUser(string userName) {
            return _dbContex.Terminals.Include(i => i.ApplicationUser).Include(t => t.Transactions).Where(t => t.ApplicationUser != null && t.ApplicationUser.UserName == userName).ToList();
        }

        public (byte[], string) GetPasswordEncrypt(long terminalId) {
            var terminal = _dbContex.Terminals.Include(p => p.ApplicationUser).FirstOrDefault(t => t.Id == terminalId);
            if(terminal != null) {
                string password = terminal.Password;
                string terminalSecrets = $"TerminalId: {terminal.TerminalId}\nTerminalKey: {password}\nEncashment Code: {terminal.EncashmenPassCode}";
                return (Encoding.UTF8.GetBytes(terminalSecrets), $"{terminal.Name} {terminal.ApplicationUser?.FamilyName}.txt");
            }
            return (new byte[0], "NotAuthorized.txt");
        }

        public ClientConfigModel? GetClientConfigModel(long terminalId, string baseUri) {
            var terminal = _dbContex.Terminals.Include(p => p.ApplicationUser).FirstOrDefault(t => t.Id == terminalId);
            ClientConfigModel? model = null;
            if(terminal != null) {
                model = new ClientConfigModel() {
                    BackendBaseUri = $"{baseUri}/api/AltynAsyrTerminalAPI",
                    ComPort = "COM1",
                    TerminalId = terminal.TerminalId,
                    TerminalKey = terminal.Password,
                    PhoneNumber = terminal.ContactPhoneNumber,
                    TerminalNumber = terminal.Id.ToString("D4")
                };                
            }
            return model;
        }

        public long GetTerminalCurrenTotal(long terminalId) {
            var result = _dbContex.Terminals.Where(t => t.Id == terminalId).Include(p => p.Transactions).ToList();
            if(result.Any()) {
                long sum = result.First().Transactions?.Where(t => t.EncargementId == null || t.EncargementId <= 0).Sum(p => p.Amount) ?? 0;
                return sum / 100;
            }
            return 0;
        }

        public void UpdateTerminal(Terminal terminal) {
            var dbterminal = _dbContex.Terminals.AsNoTracking().FirstOrDefault(p => p.Id == terminal.Id);
            if(dbterminal != null) {
                terminal.Password = dbterminal.Password;
                terminal.CreatedDate = dbterminal.CreatedDate;
                terminal.TerminalId = dbterminal.TerminalId;
                _dbContex.Terminals.Update(terminal);
                _dbContex.SaveChanges();
            }
        }

        public bool LogTerminal(long terminalId, string info, LogType type, DateTime date) {
            try {
                TerminalLog newLog = new TerminalLog() { TerminalId = terminalId, LogInfo = info, Type = type, LogDate = date };
                _dbContex.TerminalLogs.Add(newLog);
                _dbContex.SaveChanges();
                return true;
            } catch(Exception ex) {
                return false;
            }
        }

        public List<TerminalLogViewModel> TerminalLogs(long terminalId) {
            var terminalLogs = _dbContex.TerminalLogs.Where(t => t.TerminalId == terminalId).ToList();
            List<TerminalLogViewModel> result = new List<TerminalLogViewModel>();
            if(terminalLogs.Count() > 0) {
                terminalLogs.ForEach(t => {
                    result.Add(
                        new TerminalLogViewModel() {
                            TerminalId = terminalId,
                            LogInfo = t.LogInfo,
                            Type = t.Type,
                            LogDate = t.LogDate,
                            Id = t.Id,
                            Status = t.Type == LogType.Error ? "Ошибка" : "Востановлено"
                        });
                });
            }
            return result;
        }

        public void UpdateTerminalPing(long terminalId) {
            var terminal = _dbContex.Terminals.Find(terminalId);
            if(terminal != null) {
                terminal.LastPing = DateTime.Now;
                _dbContex.Update(terminal);
                _dbContex.SaveChanges();
            }
        }
    }
}
