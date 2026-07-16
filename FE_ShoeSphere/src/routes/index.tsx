import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { ShoeStorePage } from "../pages/ShoeStorePage";
import { AdminProductPage } from "../pages/AdminProductPage";
import { AdminLayout } from "../layout/AdminLayout";
import { AdminAccountPage } from "../pages/AdminAccountPage";
import { AdminOrderPage } from "../pages/AdminOrderPage";
import { DeliveryProfilePage } from "../pages/DeliveryProfilePage";
import { CartPage } from "../pages/CartPage";
import { MyOrdersPage } from "../pages/MyOrdersPage";

export const index = createBrowserRouter([
    {path:"/register", element:<Register/>},
    {path: "/login", element: <Login /> },
    {path: "/", element: <ShoeStorePage/>},
    {path: "/shoes", element: <ShoeStorePage/>},
    {path: "/delivery-profile", element: <DeliveryProfilePage />},
    {path: "/cart", element: <CartPage />},
    {path: "/my-orders", element: <MyOrdersPage />},

    {
    element: <AdminLayout />, // Khung Layout chứa Sidebar bên trái và tự động check Token
    children: [
      {
        path: "/admin",
        element: <Navigate to="/admin/products" replace /> // Nếu vào thẳng /admin thì tự điều hướng sang quản lý sản phẩm
      },
      {
        path: "/admin/products",
        element: <AdminProductPage /> // Trang quản lý sản phẩm
      },
      {
        path: "/admin/accounts",
        element: <AdminAccountPage />
      },
      {
        path: "/admin/orders",
        element: <AdminOrderPage />
      }
    ]
  },

  // ================= 3. CATCH ALL ROUTE (XỬ LÝ ĐƯỜNG DẪN SAI) =================
  { 
    path: "*", 
    element: <Navigate to="/" replace /> 
  }
])
