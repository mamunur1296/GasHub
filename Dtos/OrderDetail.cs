using GasHub.Models;

namespace GasHub.Dtos
{
    public class OrderDetail : BaseModel
    {
        public Guid? OrderID { get; set; }
        public Order? Order { get; set; }
        public Guid? ReturnProductId { get; set; }
        public Guid? ProductID { get; set; }
        public Product? Product { get; set; }
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal? Discount { get; set; }
    }
}
