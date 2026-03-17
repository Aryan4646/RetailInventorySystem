using RetailMartBackend.Interfaces;
using RetailMartBackend.Models;
using Microsoft.Data.SqlClient;

namespace RetailMartBackend.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly string _connectionString;

        public OrderRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public Order CreateOrder(Order order)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Orders (CustomerID, ProductID, Quantity, OrderDate, LastStatus, TotalAmount)
                                 VALUES (@CustomerID, @ProductID, @Quantity, @OrderDate, @LastStatus, @TotalAmount)";

                SqlCommand command = new SqlCommand(query, connection);

                command.Parameters.AddWithValue("@CustomerID", order.CustomerID);
                command.Parameters.AddWithValue("@ProductID", order.ProductID);
                command.Parameters.AddWithValue("@Quantity", order.Quantity);
                command.Parameters.AddWithValue("@OrderDate", order.OrderDate);
                command.Parameters.AddWithValue("@LastStatus", order.LastStatus);
                command.Parameters.AddWithValue("@TotalAmount", order.TotalAmount);

                connection.Open();
                command.ExecuteNonQuery();
            }

            return order;
        }

        public Order GetOrderByID(int orderID)
        {
            Order order = null;

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                string query = @"SELECT OrderID, CustomerID, ProductID, Quantity, OrderDate, LastStatus, TotalAmount
                                 FROM Orders
                                 WHERE OrderID = @OrderID";

                SqlCommand command = new SqlCommand(query, connection);
                command.Parameters.AddWithValue("@OrderID", orderID);

                connection.Open();

                SqlDataReader reader = command.ExecuteReader();

                if (reader.Read())
                {
                    order = new Order
                    {
                        OrderID = Convert.ToInt32(reader["OrderID"]),
                        CustomerID = Convert.ToInt32(reader["CustomerID"]),
                        ProductID = Convert.ToInt32(reader["ProductID"]),
                        Quantity = Convert.ToInt32(reader["Quantity"]),
                        OrderDate = Convert.ToDateTime(reader["OrderDate"]),
                        LastStatus = reader["LastStatus"].ToString(),
                        TotalAmount = Convert.ToDecimal(reader["TotalAmount"])
                    };
                }
            }

            return order;
        }
    }
}