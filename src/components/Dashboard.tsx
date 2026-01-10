import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Button,
  Space,
  theme,
} from "antd";
import {
  ShoppingOutlined,
  UserOutlined,
  HeartOutlined,
  PlusOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { productApi, userApi } from "../services/mockApi";
import { queryKeys } from "../services/queryClient";
import { useAppSelector } from "../store/hooks";

const { Title, Paragraph } = Typography;

export function Dashboard() {
  const favoriteIds = useAppSelector((state) => state.favorites.productIds);
  const { token } = theme.useToken();

  const { data: products } = useQuery({
    queryKey: queryKeys.products.list(),
    queryFn: () => productApi.getAll(),
  });

  const { data: users } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => userApi.getAll(),
  });

  const totalProducts = products?.length || 0;
  const totalUsers = users?.length || 0;
  const totalFavorites = favoriteIds.length;
  const totalValue = useMemo(
    () => products?.reduce((sum, p) => sum + p.price, 0) || 0,
    [products]
  );

  return (
    <div>
      <div style={{ marginBottom: token.sizeXL }}>
        <Title level={2}>Dashboard</Title>
        <Paragraph type="secondary">
          Welcome to the Admin Panel. Manage your products and users
          efficiently.
        </Paragraph>
      </div>

      <Row
        gutter={[token.size, token.size]}
        align="stretch"
        style={{ marginBottom: token.sizeXL }}
      >
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
          >
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingOutlined />}
              formatter={(value) => (
                <span style={{ color: token.colorSuccess }}>{value}</span>
              )}
            />
            <Link to="/products">
              <Button
                type="link"
                style={{ padding: 0, marginTop: token.sizeXS }}
              >
                View Products <ArrowRightOutlined />
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
          >
            <Statistic
              title="Total Users"
              value={totalUsers}
              prefix={<UserOutlined />}
              formatter={(value) => (
                <span style={{ color: token.colorPrimary }}>{value}</span>
              )}
            />
            <Link to="/users">
              <Button
                type="link"
                style={{ padding: 0, marginTop: token.sizeXS }}
              >
                View Users <ArrowRightOutlined />
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
          >
            <Statistic
              title="Favorite Products"
              value={totalFavorites}
              prefix={<HeartOutlined />}
              formatter={(value) => (
                <span style={{ color: token.colorWarning }}>{value}</span>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ height: "100%" }}
          >
            <Statistic
              title="Total Value"
              value={totalValue}
              prefix="₺"
              precision={2}
              formatter={(value) => (
                <span style={{ color: token.colorInfo }}>{value}</span>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Quick Actions" style={{ marginBottom: token.sizeXL }}>
        <Space size="middle" wrap>
          <Link to="/products/add">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Add New Product
            </Button>
          </Link>
          <Link to="/products">
            <Button icon={<ShoppingOutlined />} size="large">
              Manage Products
            </Button>
          </Link>
          <Link to="/users">
            <Button icon={<UserOutlined />} size="large">
              Manage Users
            </Button>
          </Link>
          <Link to="/users/add">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Add User
            </Button>
          </Link>
        </Space>
      </Card>

      <Row gutter={[token.size, token.size]}>
        <Col xs={24} md={12}>
          <Card
            title="Product Management"
            extra={<ShoppingOutlined />}
            hoverable
          >
            <Paragraph>
              Add, edit, and delete products. Search and filter products by
              category. Mark products as favorites for quick access.
            </Paragraph>
            <Link to="/products">
              <Button type="link" style={{ padding: 0 }}>
                Go to Products <ArrowRightOutlined />
              </Button>
            </Link>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="User Management" extra={<UserOutlined />} hoverable>
            <Paragraph>
              View and manage user accounts. Edit user profiles, roles, and
              contact information. Delete users when necessary.
            </Paragraph>
            <Link to="/users">
              <Button type="link" style={{ padding: 0 }}>
                Go to Users <ArrowRightOutlined />
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
