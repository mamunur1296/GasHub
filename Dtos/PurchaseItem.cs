using Microsoft.Build.Evaluation;

namespace GasHub.Dtos
{
    public class PurchaseItem
    {
        public string CompanyId { get; set; }
        public List<ProductItem> Products { get; set; }
    }
    public class ProductItem
    {
        public string ProductID { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Discount { get; set; }
    }
}
