namespace GasHub.Models.ViewModels
{
    public class TraderViewModel
    {
        public TraderViewModel( List<Company> companyList)
        {
            Trader = new Trader();
            CompanyList = companyList;
        }
        public TraderViewModel()
        {
            Trader = new Trader();
            CompanyList = new List<Company>();
        }

        public Trader Trader { get; set; }
        public List<Company> CompanyList { get; set; } 
    }
}
