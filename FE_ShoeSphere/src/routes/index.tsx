import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { ShoeStorePage } from "../pages/ShoeStorePage";
import { AdminProductPage } from "../pages/AdminProductPage";
import { AdminLayout } from "../layout/AdminLayout";
import { AdminAccountPage } from "../pages/AdminAccountPage";


export const index = createBrowserRouter([
    {path:"/register", element:<Register/>},
    {path: "/login", element: <Login /> },
    {path: "/", element: <ShoeStorePage/>},
    {path: "*", element: <Navigate to = "/" replace/>},
    {path: "/shoes", element: <ShoeStorePage/>},

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
      }
    ]
  },

  // ================= 3. CATCH ALL ROUTE (XỬ LÝ ĐƯỜNG DẪN SAI) =================
  { 
    path: "*", 
    element: <Navigate to="/" replace /> 
  }


])
