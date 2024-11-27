using GasHub.Models;
using Microsoft.EntityFrameworkCore;

namespace GasHub.Dtos
{
    public class PurchaseReportDTO : BaseModel
    {
        public DateTime PurchaseDate { get; set; }
        public Guid? CompanyId { get; set; }
        public Company Company { get; set; }

        [Precision(18, 2)]
        public decimal TotalAmount { get; set; }

        public ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }
}
