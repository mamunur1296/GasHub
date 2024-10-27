namespace GasHub.Models.ViewModels
{
    public class StockViewModel
    {
        public StockViewModel( List<Product> productList, List<Trader> traderList)
        {
            Stock = new Stock();
            ProductList = productList;
            TraderList = traderList;
        }
        public StockViewModel()
        {
            Stock = new Stock();
            ProductList = new List<Product>();
            TraderList = new List<Trader>();
        }

        public Stock Stock { get; set; }
        public List<Product> ProductList { get; set; }  
        public List<Trader> TraderList { get; set; }    
    }
}
