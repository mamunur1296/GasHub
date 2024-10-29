using System.ComponentModel;

namespace GasHub.Models
{
    public class OrderDetail : BaseModel
    {
        [DisplayName("Order")]
        public string OrderID { get; set; }
        [DisplayName("Order")]
        public Order Order { get; set; }
        [DisplayName("Product")]
        public string ProductID { get; set; }
        [DisplayName("Product")]
        public Product Product { get; set; }
        [DisplayName("Price")]
        public decimal UnitPrice { get; set; }
        [DisplayName("Quantity")]
        public int Quantity { get; set; }
        [DisplayName("Discount")]
        public decimal Discount { get; set; }
    }
}
