using System.ComponentModel.DataAnnotations;
namespace GasHub.Models
{
    public class PurchaseDetail : BaseModel
    {
        [Required(ErrorMessage = "Purchase ID is required.")]
        public string PurchaseID { get; set; }
        public Purchase Purchase { get; set; }

        [Required(ErrorMessage = "Product ID is required.")]
        public string ProductID { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal TotalPrice => Quantity * UnitPrice - Discount;

    }
}
