import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { ProductList } from "./components/products/ProductList";
import { ProductDetail } from "./components/products/ProductDetail";
import { ProductForm } from "./components/products/ProductForm";
import { UserList } from "./components/users/UserList";
import { UserDetail } from "./components/users/UserDetail";
import { UserForm } from "./components/users/UserForm";
import { NotFound } from "./components/NotFound";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/add" element={<ProductForm />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/products/edit/:id" element={<ProductForm />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/users/add" element={<UserForm />} />
      <Route path="/users/:id" element={<UserDetail />} />
      <Route path="/users/edit/:id" element={<UserForm />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
