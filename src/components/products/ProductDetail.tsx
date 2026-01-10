import { useMemo, useCallback } from "react";
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
  HeartOutlined,
  HeartFilled,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { productApi } from "../../services/mockApi";
import { queryKeys, queryClient } from "../../services/queryClient";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite } from "../../store/favoritesSlice";
import { getCategoryColor } from "../../utils/categoryUtils";
import { formatDate, formatPrice } from "../../utils/formatUtils";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.productIds);
  const { token } = theme.useToken();

  const isFavorite = useMemo(
    () => (id ? favoriteIds.includes(id) : false),
    [id, favoriteIds]
  );

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products.detail(id!),
    queryFn: () => productApi.getById(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productApi.delete(productId),
    onSuccess: () => {
      message.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      navigate("/products");
    },
    onError: () => {
      message.error("Failed to delete product");
    },
  });

  const handleFavoriteToggle = useCallback(() => {
    if (id) {
      dispatch(toggleFavorite(id));
      message.success(
        isFavorite ? "Removed from favorites" : "Added to favorites"
      );
    }
  }, [id, dispatch, isFavorite]);

  const handleDelete = useCallback(() => {
    confirm({
      title: "Delete Product",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to delete this product? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        if (id) {
          deleteMutation.mutate(id);
        }
      },
    });
  }, [id, deleteMutation]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: token.sizeXL * 2 }}>
        <Spin size="large" />
        <Text
          type="secondary"
          style={{ display: "block", marginTop: token.size }}
        >
          Loading product details...
        </Text>
      </div>
    );
  }

  if (error || !product) {
    return (
      <Card>
        <Empty description="Product not found">
          <Link to="/products">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Back to Products
            </Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: token.sizeLG }}>
        <Space>
          <Link to="/products">
            <Button icon={<ArrowLeftOutlined />}>Back to Products</Button>
          </Link>
        </Space>
      </div>

      <Card>
        <Row gutter={[token.sizeXL, token.sizeXL]}>
          <Col xs={24} lg={12}>
            <div
              style={{
                borderRadius: token.borderRadiusLG,
                overflow: "hidden",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: 384,
                }}
              />
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <Space vertical size="middle" style={{ width: "100%" }}>
              <div>
                <Tag
                  color={getCategoryColor(product.category)}
                  style={{ marginBottom: token.sizeXS }}
                >
                  {product.category.toUpperCase()}
                </Tag>
                <Title level={2}>{product.name}</Title>
              </div>

              <div>
                <Text
                  strong
                  style={{ fontSize: 30, color: token.colorPrimary }}
                >
                  {formatPrice(product.price)}
                </Text>
              </div>

              <Divider />

              <div>
                <Title level={5}>Description</Title>
                <Paragraph>{product.description}</Paragraph>
              </div>

              <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Product ID">
                  {product.id}
                </Descriptions.Item>
                <Descriptions.Item label="Category">
                  {product.category}
                </Descriptions.Item>
                <Descriptions.Item label="Created">
                  {formatDate(product.createdAt)}
                </Descriptions.Item>
              </Descriptions>

              <Divider />

              <Space wrap size="middle" style={{ width: "100%" }}>
                <Button
                  type={isFavorite ? "primary" : "default"}
                  icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleFavoriteToggle}
                  size="large"
                  danger={isFavorite}
                >
                  {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
                <Link to={`/products/edit/${product.id}`}>
                  <Button icon={<EditOutlined />} size="large">
                    Edit Product
                  </Button>
                </Link>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                  loading={deleteMutation.isPending}
                  size="large"
                >
                  Delete Product
                </Button>
              </Space>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
