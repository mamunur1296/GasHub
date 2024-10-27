namespace GasHub.Models.ViewModels
{
    public class OrderViewModel
    {
        public OrderViewModel(List<User> users, List<Product> products)
        {
            UserList = users;
            ProductList = products;
            Order = new Order();
        }

        public OrderViewModel()
        {
            Order = new Order();
            UserList = new List<User>();
            ProductList = new List<Product>();
        }

        public Order Order { get; set; }
        public List<User> UserList { get; set; }
        public List<Product> ProductList { get; set; }
    }
}
