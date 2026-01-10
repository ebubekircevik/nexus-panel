import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Card,
  Table,
  Button,
  Typography,
  Space,
  Tag,
  Avatar,
  theme,
} from "antd";
import { UserOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { userApi } from "../../services/mockApi";
import { queryKeys } from "../../services/queryClient";
import type { User } from "../../types/index";
import type { ColumnsType } from "antd/es/table";
import { getRoleColor } from "../../utils/roleUtils";
import { formatDateShort } from "../../utils/formatUtils";

const { Title, Text } = Typography;

export function UserList() {
  const { token } = theme.useToken();
  const [pageSize, setPageSize] = useState(5);
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.users.list(),
    queryFn: () => userApi.getAll(),
  });

  const columns: ColumnsType<User> = [
    {
      title: "User",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: User) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </Space>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color={getRoleColor(role)}>{role}</Tag>,
      responsive: ["sm", "md", "lg", "xl"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["md", "lg", "xl"],
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDateShort(date),
      responsive: ["lg", "xl"],
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: User) => (
        <Link to={`/users/${record.id}`}>
          <Button type="link" icon={<EyeOutlined />}>
            View
          </Button>
        </Link>
      ),
      responsive: ["xs", "sm", "md", "lg", "xl"],
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: token.sizeLG }}>
        <Title level={2} style={{ marginBottom: token.size }}>
          Users Management
        </Title>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text type="secondary">Manage user accounts and profiles</Text>
          <Link to="/users/add">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Add User
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        {error && (
          <div style={{ textAlign: "center", padding: token.sizeXL }}>
            <Text type="danger">
              Failed to load users. Please try again later.
            </Text>
          </div>
        )}

        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            showTotal: (total) => `Total ${total} users`,
            onShowSizeChange: (_, size) => {
              setPageSize(size);
            },
          }}
          scroll={{ x: "max-content" }}
        />
      </Card>
    </div>
  );
}
