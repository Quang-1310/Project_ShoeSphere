import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { ShoeStorePage } from "../pages/ShoeStorePage";
import { AdminProductPage } from "../pages/AdminProductPage";
import { AdminLayout } from "../layout/AdminLayout";
import { AdminAccountPage } from "../pages/AdminAccountPage";
import { AdminOrderPage } from "../pages/AdminOrderPage";
import { AdminStatisticsPage } from "../pages/AdminStatisticsPage";
import { DeliveryProfilePage } from "../pages/DeliveryProfilePage";
import { CartPage } from "../pages/CartPage";
import { MyOrdersPage } from "../pages/MyOrdersPage";
import { StaffLayout } from "../layout/StaffLayout";
import { WarehousePage } from "../pages/WarehousePage";
import { ShipperPage } from "../pages/ShipperPage";

export const index = createBrowserRouter([
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },
    { path: "/", element: <ShoeStorePage /> },
    { path: "/shoes", element: <ShoeStorePage /> },
    { path: "/delivery-profile", element: <DeliveryProfilePage /> },
    { path: "/cart", element: <CartPage /> },
    { path: "/my-orders", element: <MyOrdersPage /> },

    // ============ Admin routes ============
    {
        element: <AdminLayout />,
        children: [
            { path: "/admin", element: <Navigate to="/admin/statistics" replace /> },
            { path: "/admin/statistics", element: <AdminStatisticsPage /> },
            { path: "/admin/products", element: <AdminProductPage /> },
            { path: "/admin/accounts", element: <AdminAccountPage /> },
            { path: "/admin/orders", element: <AdminOrderPage /> },
        ],
    },


    // ============ Warehouse routes ============
    {
        element: <StaffLayout />,
        children: [
            { path: "/warehouse", element: <WarehousePage /> },
        ],
    },

    // ============ Shipper routes ============
    {
        element: <StaffLayout />,
        children: [
            { path: "/shipper", element: <ShipperPage /> },
        ],
    },

    // ============ Catch-all ============
    { path: "*", element: <Navigate to="/" replace /> },
]);
