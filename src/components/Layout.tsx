import React from "react";
import { Layout as AntLayout, Menu, Typography, Space, theme } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingOutlined,
  UserOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

const { Header, Content, Footer } = AntLayout;
const { Text } = Typography;

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const menuItems: MenuProps["items"] = [
    {
      key: "/",
      icon: <AppstoreOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: <Link to="/products">Products</Link>,
    },
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
  ];

  const getSelectedKey = () => {
    if (location.pathname.startsWith("/products")) return "/products";
    if (location.pathname.startsWith("/users")) return "/users";
    return location.pathname;
  };

  return (
    <AntLayout style={{ minHeight: "100vh", width: "100%" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          zIndex: 1000,
          width: "100%",
          padding: `0 ${token.sizeLG}px`,
        }}
      >
        <Space
          size="middle"
          style={{ marginRight: token.sizeXL, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <SettingOutlined style={{ fontSize: 20, color: "#ffffff" }} />
          <Text strong style={{ color: "#ffffff", fontSize: token.fontSizeLG }}>
            Admin Panel
          </Text>
        </Space>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{
            flex: 1,
            minWidth: 0,
            borderBottom: "none",
          }}
        />
      </Header>
      <Content
        style={{
          padding: token.sizeLG,
          backgroundColor: token.colorBgLayout,
          width: "100%",
          marginTop: 64,
          minHeight: "calc(100vh - 64px - 70px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
          }}
        >
          {children}
        </div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Admin Panel © {new Date().getFullYear()} - All Rights Reserved
      </Footer>
    </AntLayout>
  );
}
