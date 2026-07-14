import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import { ShoeStorePage } from "../pages/ShoeStorePage";


export const index = createBrowserRouter([
    {path:"/register", element:<Register/>},
    {path: "/login", element: <Login /> },
    {path: "/", element: <ShoeStorePage/>},
    {path: "*", element: <Navigate to = "/" replace/>},
    {path: "/shoes", element: <ShoeStorePage/>}
])