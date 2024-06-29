using AutoMapper;
using Terminal_BackEnd.Infrastructure.Entities;
using Terminal_BackEnd.Infrastructure.Services.TerminalService.Models;
namespace Terminal_BackEnd.Web {
    public class MapperProfile : Profile {
        public MapperProfile() {
            CreateMap<Terminal, CreateTerminalModel>().ReverseMap();
        }
    }
}
