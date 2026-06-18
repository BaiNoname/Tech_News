import { Routes, Route } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostDetail from "./pages/PostDetail";

import PostList from "./pages/admin/Post/PostList";

import PostCreate from "./pages/admin/Post/PostCreate";

import PostEdit from "./pages/admin/Post/PostEdit";

import CategoryList from "./pages/admin/Category/CategoryList";
import CategoryCreate from "./pages/admin/Category/CategoryCreate";
import CategoryEdit from "./pages/admin/Category/CategoryEdit";

import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import UserList from "./pages/admin/User/UserList";
import UserCreate from "./pages/admin/User/UserCreate";
import UserEdit from "./pages/admin/User/UserEdit";
import UserTrash from "./pages/admin/User/UserTrash";

import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import EventChat from "./pages/EventChat";

import EventListAdmin from "./pages/admin/Event/EventList";
import EventCreate from "./pages/admin/Event/EventCreate";
import EventEdit from "./pages/admin/Event/EventEdit";
import EventRegistrations from "./pages/admin/Event/EventRegistrations";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProfile from "./pages/admin/AdminProfile";


function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/events/:id/chat" element={<EventChat />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="posts" element={<PostList />} />
        <Route path="posts/create" element={<PostCreate />} />
        <Route path="posts/edit/:id" element={<PostEdit />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="categories/create" element={<CategoryCreate />} />
        <Route path="categories/edit/:id" element={<CategoryEdit />} />
        <Route path="users" element={<UserList />} />
        <Route path="users/trash" element={<UserTrash />} />
        <Route path="users/create" element={<UserCreate />} />
        <Route path="users/edit/:id" element={<UserEdit />} />
        
        <Route path="events" element={<EventListAdmin />} />
        <Route path="events/create" element={<EventCreate />} />
        <Route path="events/edit/:id" element={<EventEdit />} />
        <Route path="events/:id/registrations" element={<EventRegistrations />} />

      </Route>
    </Routes>
  );
}

export default App;