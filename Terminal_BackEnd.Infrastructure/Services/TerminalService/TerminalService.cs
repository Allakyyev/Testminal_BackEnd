﻿using System.Security.Cryptography;
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
        Terminal? GetAllTerminalById(long terminalId);
        long GetTerminalCurrenTotal(long terminalId);
        void UpdateTerminal(Terminal terminal);
        void CreateTerminal(CreateTerminalModel terminalModel);
        void DeleteTerminalById(long terminalId);
        (byte[], string) GetPasswordEncrypt(long terminalId);
    }
    public class TerminalService : ITerminalService {
        private readonly AppDbContext _dbContex;
        private readonly IMapper mapper;
        public TerminalService(AppDbContext dbContext, IMapper mapper) {
            this._dbContex = dbContext;
            this.mapper = mapper;
        }
        public void CreateTerminal(CreateTerminalModel terminalModel) {
            Terminal newTerminal = mapper.Map<Terminal>(terminalModel);
            string password = String.Empty;
            using(Aes aes = Aes.Create()) {
                aes.GenerateKey();
                password = Convert.ToBase64String(aes.Key);
            }
            newTerminal.Password = AesEncryptionHelper.EncryptString(password);
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

        public Terminal? GetAllTerminalById(long terminalId) {
            return _dbContex.Terminals.Find(terminalId);
        }

        public List<Terminal> GetAllTerminals() {
            return _dbContex.Terminals.Include(i => i.ApplicationUser).ToList();
        }

        public List<Terminal> GetAllTerminalsByUser(string userName) {
            throw new NotImplementedException();
        }

        public (byte[], string) GetPasswordEncrypt(long terminalId) {
            var terminal = _dbContex.Terminals.Include(p => p.ApplicationUser).FirstOrDefault(t => t.Id == terminalId);
            if(terminal != null) {
                string password = terminal.Password;
                string terminalSecrets = $"TerminalId: {terminal.TerminalId}\nTerminalKey: {password}";
                return (Encoding.UTF8.GetBytes(terminalSecrets), $"{terminal.Name} {terminal.ApplicationUser?.FamilyName}.txt");
            }
            return (new byte[0], "NotAuthorized.txt");
        }

        public long GetTerminalCurrenTotal(long terminalId) {
            var result = _dbContex.Terminals.Where(t => t.Id == terminalId).Include(p => p.Transactions).ToList();
            if(result.Any()) {
                long sum = result.First().Transactions?.Where(t => t.EncharchmentId <= 0).Sum(p => p.Amount) ?? 0;
                return sum;
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

    }
}
