using RetailMartBackend.Models;
namespace RetailMartBackend.Interfaces
{
    public interface IOrderService
    {
        Order CreateOrder(Order order);
        Order GetOrderByID(int orderID);
    }
}
