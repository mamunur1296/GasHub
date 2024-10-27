using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GasHub.Models
{
    public class ProdReturn : BaseModel
    {
        [Required(ErrorMessage = "Product Name is  Required ")]
        [DisplayName("Product Name")]
        public Guid ProductId { get; set; }
        [DisplayName("Name")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Product Size is  Required ")]
        [DisplayName("Product Size")]
        public string ProdSizeId { get; set; }
        [Required(ErrorMessage = "Product Valve is  Required ")]
        [DisplayName("Product Valve")]
        public string ProdValveId { get; set; }


        // Navigation property
        public virtual Product Product { get; set; }
    }
}
