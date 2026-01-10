import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Card,
  Button,
  Typography,
  Space,
  Spin,
  Empty,
  Tag,
  Descriptions,
  Avatar,
  Modal,
  message,
  Divider,
  Row,
  Col,
  theme,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { userApi } from "../../services/mockApi";
import { queryKeys, queryClient } from "../../services/queryClient";
import { getRoleColor } from "../../utils/roleUtils";
import { formatDateTime } from "../../utils/formatUtils";

const { Title, Text } = Typography;
const { confirm } = Modal;

export function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userApi.delete(userId),
    onSuccess: () => {
      message.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      navigate("/users");
    },
    onError: () => {
      message.error("Failed to delete user");
    },
  });

  const handleDelete = () => {
    confirm({
      title: "Delete User",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this user? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        if (id) {
          deleteMutation.mutate(id);
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Spin size="large" />
        <Text
          type="secondary"
          style={{ display: "block", marginTop: token.size }}
        >
          Loading user details...
        </Text>
      </div>
    );
  }

  if (error || !user) {
    return (
      <Card>
        <Empty description="User not found">
          <Space>
            <Link to="/users">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Back to Users
              </Button>
            </Link>
          </Space>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: token.sizeLG }}>
        <Space>
          <Link to="/users">
            <Button icon={<ArrowLeftOutlined />}>Back to Users</Button>
          </Link>
        </Space>
      </div>

      <Card>
        <Row gutter={[token.sizeXL, token.sizeXL]}>
          <Col xs={24} lg={8}>
            <div style={{ textAlign: "center" }}>
              <Avatar
                src={user.avatar}
                icon={<UserOutlined />}
                size={200}
                style={{ marginBottom: token.size }}
              />
              <Title level={3}>{user.name}</Title>
              <Tag
                color={getRoleColor(user.role)}
                style={{ marginBottom: token.size }}
              >
                {user.role}
              </Tag>
              <div>
                <Text type="secondary">{user.email}</Text>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={16}>
            <Title level={4} style={{ marginBottom: token.size }}>
              User Information
            </Title>

            <Descriptions column={1} bordered>
              <Descriptions.Item label="User ID">{user.id}</Descriptions.Item>
              <Descriptions.Item label="Full Name">
                {user.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
              <Descriptions.Item label="Role">
                <Tag color={getRoleColor(user.role)}>{user.role}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {user.address}
              </Descriptions.Item>
              <Descriptions.Item label="Joined">
                {formatDateTime(user.createdAt)}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Space wrap size="middle">
              <Link to={`/users/edit/${user.id}`}>
                <Button type="primary" icon={<EditOutlined />} size="large">
                  Edit User
                </Button>
              </Link>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={deleteMutation.isPending}
                size="large"
              >
                Delete User
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
