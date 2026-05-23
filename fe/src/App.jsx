import { Routes, Route } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";

import PostList from "./pages/admin/PostList";

import PostCreate from "./pages/admin/PostCreate";

import PostEdit from "./pages/admin/PostEdit";

import CategoryList from "./pages/admin/CategoryList";
import CategoryCreate from "./pages/admin/CategoryCreate";
import CategoryEdit from "./pages/admin/CategoryEdit";

import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserList from "./pages/admin/UserList";
import UserCreate from "./pages/admin/UserCreate";
import UserEdit from "./pages/admin/UserEdit";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route path="posts" element={<PostList />} />
        <Route path="posts/create" element={<PostCreate />} />
        <Route path="posts/edit/:id" element={<PostEdit />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/edit/:id" element={<CategoryEdit />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/edit/:id" element={<UserEdit />} />

      </Route>
    </Routes>
  );
}

export default App;