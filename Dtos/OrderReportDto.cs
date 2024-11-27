namespace GasHub.Dtos
{
    public class OrderReportDto
    {
        public Guid OrderID { get; set; }
        public Guid ProductID { get; set; }
        public string ProductName { get; set; }
        public decimal UnitPrice { get; set; }
        public Decimal Discount { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
