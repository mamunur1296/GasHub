namespace GasHub.Models.ViewModels
{
    public class ProductViewModel
    {
        public IEnumerable<Product> ProductList { get; set; }
        public IEnumerable<Company> companiList { get; set; }
        public IEnumerable<Valve> ValveList { get; set; }
        public IEnumerable<ProductSize> productSizeList { get; set; }
        public IEnumerable<ProductDiscunt> productDiscunts { get; set; }
    }
}
