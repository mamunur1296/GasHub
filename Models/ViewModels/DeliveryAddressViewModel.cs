using System.ComponentModel;

namespace GasHub.Models.ViewModels
{
    public class DeliveryAddressViewModel
    {
        public DeliveryAddressViewModel()
        {
            // Set default values
            DeliveryAddress = new DeliveryAddress();
            UserList = new List<User>();
        }

        public DeliveryAddressViewModel(List<User> userList)
        {
            UserList = userList;
            DeliveryAddress = new DeliveryAddress();
        }

        public DeliveryAddress DeliveryAddress { get; set; }
        [DisplayName("Select User")]
        public List<User> UserList { get; set; }
    }


}
