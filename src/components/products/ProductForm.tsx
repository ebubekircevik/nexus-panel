import { useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Typography,
  message,
  Spin,
  theme,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { productApi } from "../../services/mockApi";
import { queryKeys, queryClient } from "../../services/queryClient";
import type { ProductFormData } from "../../types/index";
import { PRODUCT_CATEGORIES } from "../../utils/categoryUtils";

const { Title } = Typography;
const { TextArea } = Input;

export function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const { token } = theme.useToken();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      category: "electronics",
    },
  });

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.products.detail(id!),
    queryFn: () => productApi.getById(id!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (product && isEditMode) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        category: product.category,
      });
    }
  }, [product, isEditMode, reset]);

  const categoryOptions = useMemo(
    () => PRODUCT_CATEGORIES.filter((cat) => cat.value !== "all"),
    []
  );

  const createMutation = useMutation({
    mutationFn: (data: ProductFormData) => productApi.create(data),
    onSuccess: () => {
      message.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      navigate("/products");
    },
    onError: () => {
      message.error("Failed to create product");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormData) => productApi.update(id!, data),
    onSuccess: () => {
      message.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(id!),
      });
      navigate(`/products/${id}`);
    },
    onError: () => {
      message.error("Failed to update product");
    },
  });

  const onSubmit = (data: ProductFormData) => {
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
          <Link to={isEditMode ? `/products/${id}` : "/products"}>
            <Button icon={<ArrowLeftOutlined />}>Back</Button>
          </Link>
        </Space>
      </div>

      <Card>
        <Title level={2} style={{ marginBottom: token.sizeLG }}>
          {isEditMode ? "Edit Product" : "Add New Product"}
        </Title>

        <Form
          layout="horizontal"
          labelCol={{ span: 4 }}
          labelAlign="left"
          onFinish={handleSubmit(onSubmit)}
        >
          <div style={{ maxWidth: 768 }}>
            <Form.Item
              label="Product Name"
              validateStatus={errors.name ? "error" : ""}
              help={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Product name is required",
                  minLength: {
                    value: 3,
                    message: "Product name must be at least 3 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Enter product name"
                    size="large"
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Price"
              validateStatus={errors.price ? "error" : ""}
              help={errors.price?.message}
              required
            >
              <Controller
                name="price"
                control={control}
                rules={{
                  required: "Price is required",
                  min: {
                    value: 0.01,
                    message: "Price must be greater than 0",
                  },
                }}
                render={({ field }) => (
                  <InputNumber
                    {...field}
                    placeholder="Enter price"
                    size="large"
                    style={{ width: "100%" }}
                    prefix="₺"
                    min={0}
                    step={0.01}
                    precision={2}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Category"
              validateStatus={errors.category ? "error" : ""}
              help={errors.category?.message}
              required
            >
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Select category"
                    size="large"
                    options={categoryOptions}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Description"
              validateStatus={errors.description ? "error" : ""}
              help={errors.description?.message}
              required
            >
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                }}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    placeholder="Enter product description"
                    rows={4}
                    showCount
                    maxLength={500}
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
                  {isEditMode ? "Update Product" : "Create Product"}
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
