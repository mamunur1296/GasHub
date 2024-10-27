namespace GasHub.Models.ViewModels
{
    public class ProductReturnViewModel
    {
        public ProductReturnViewModel( List<Product> product, List<Valve> valve, List<ProductSize> productSize)
        {
            ProdReturn = new ProdReturn();
            Product = product;
            Valve = valve;
            ProductSize = productSize;
        }

        public ProductReturnViewModel()
        {
            ProdReturn = new ProdReturn();
            Product = new List<Product>();
            Valve = new List<Valve>();
            ProductSize = new List<ProductSize>();
        }

        public ProdReturn ProdReturn { get; set; }
        public List<Product> Product { get; set; }
        public List<Valve>  Valve { get; set; }
        public List<ProductSize>  ProductSize { get; set; }
    }
}
