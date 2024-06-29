using Terminal_BackEnd.Infrastructure.Data;
using Terminal_BackEnd.Infrastructure.Services;

namespace Terminal_BackEnd.Web.Services {
    public interface ISecurityService {
        bool TryValidateTerminalId(string terminalIdEncrypted, out long terminalId);
        bool TryValidateMsisdn(string msisdnEncrypted, out string msisdn);
    }

    public class SecurityService : ISecurityService {
        readonly AppDbContext dbContext;
        public SecurityService(AppDbContext dbContext) {
            this.dbContext = dbContext;
        }
        public bool TryValidateTerminalId(string terminalIdEncrypted, out long terminalId) {
            var tId = AesEncryptionHelper.DecryptString(terminalIdEncrypted);
            var terminal = dbContext.Terminals.Find(tId);
            if(terminal != null) {
                terminalId = terminal.Id;
                return true;
            }
            terminalId = -1;
            return false;
            
        }

        public bool TryValidateMsisdn(string msisdnEncrypted, out string msisdn) {
            string decryptedmsisdn = AesEncryptionHelper.DecryptString(msisdnEncrypted);
            bool correctPattern = decryptedmsisdn.StartsWith("9936") && decryptedmsisdn.Length == "993665000000".Length;
            bool allNumbers = true;
            foreach(var item in decryptedmsisdn) {
                allNumbers = Char.IsDigit(item);
            }
            if(correctPattern && allNumbers) {
                msisdn = decryptedmsisdn;
                return true;
            }else {
                msisdn = String.Empty;
                return false;
            }
        }
    }
}
