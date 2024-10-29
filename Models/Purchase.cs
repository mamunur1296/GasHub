namespace GasHub.Models
{
    public class Purchase : BaseModel
    {
        public DateTime PurchaseDate { get; set; }


        public string CompanyId { get; set; }
        public Company Company { get; set; }
        public decimal TotalAmount { get; set; }
        public ICollection<PurchaseDetail> PurchaseDetails { get; set; }

    }
}
