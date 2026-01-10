import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  message,
  Spin,
  theme,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { userApi } from "../../services/mockApi";
import { queryKeys, queryClient } from "../../services/queryClient";
import type { UserFormData } from "../../types";
import { USER_ROLES } from "../../utils/roleUtils";

const { Title } = Typography;
const { TextArea } = Input;

export function UserForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { token } = theme.useToken();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      phone: "",
      address: "",
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userApi.getById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (user && isEditMode) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      });
    }
  }, [user, isEditMode, reset]);

  const createMutation = useMutation({
    mutationFn: (data: UserFormData) => userApi.create(data),
    onSuccess: () => {
      message.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      navigate("/users");
    },
    onError: () => {
      message.error("Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => userApi.update(id!, data),
    onSuccess: () => {
      message.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id!) });
      navigate(`/users/${id}`);
    },
    onError: () => {
      message.error("Failed to update user");
    },
  });

  const onSubmit = (data: UserFormData) => {
    if (isEditMode) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading && isEditMode) {
    return (
      <div style={{ textAlign: "center", padding: token.sizeXL * 2 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: token.sizeLG }}>
        <Space>
          <Link to={isEditMode ? `/users/${id}` : "/users"}>
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
        </Space>
      </div>

      <Card>
        <Title level={2} style={{ marginBottom: token.sizeLG }}>
          {isEditMode ? "Edit User Profile" : "Add New User"}
        </Title>

        <Form
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          labelAlign="left"
          onFinish={handleSubmit(onSubmit)}
        >
          <div style={{ maxWidth: 768 }}>
            <Form.Item
              label="Full Name"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Full name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter full name"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              validateStatus={errors.email ? "error" : ""}
              help={errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter email address"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Role"
              validateStatus={errors.role ? "error" : ""}
              help={errors.role?.message}
              required
            >
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select role"
                    size="large"
                    options={USER_ROLES}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Phone"
              validateStatus={errors.phone ? "error" : ""}
              help={errors.phone?.message}
              required
            >
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^[+]?[\d\s()-]+$/,
                    message: "Invalid phone number",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter phone number"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Address"
              validateStatus={errors.address ? "error" : ""}
              help={errors.address?.message}
              required
            >
              <Controller
                name="address"
                control={control}
                rules={{
                  required: "Address is required",
                  minLength: {
                    value: 10,
                    message: "Address must be at least 10 characters",
                  },
                }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Enter full address"
                    rows={3}
                    showCount
                    maxLength={200}
                  />
                )}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                  loading={createMutation.isPending || updateMutation.isPending}
                >
                  {isEditMode ? "Update User" : "Create User"}
                </Button>
                <Button size="large" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Card>
    </div>
  );
}
