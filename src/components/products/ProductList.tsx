import { useState, useMemo, useDeferredValue } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Select,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Spin,
  Empty,
  Tag,
  theme,
} from "antd";
import { SearchOutlined, PlusOutlined, HeartFilled } from "@ant-design/icons";
import { productApi } from "../../services/mockApi";
import { queryKeys } from "../../services/queryClient";
import { useAppSelector } from "../../store/hooks";
import type { ProductCategory } from "../../types/index";
import {
  PRODUCT_CATEGORIES,
  getCategoryColor,
} from "../../utils/categoryUtils";
import { formatPrice } from "../../utils/formatUtils";

const { Title, Text } = Typography;
const { Search } = Input;

export function ProductList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory>("all");
  const favoriteIds = useAppSelector((state) => state.favorites.productIds);
  const { token } = theme.useToken();

  const deferredSearch = useDeferredValue(search);

  const favoriteIdsSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.products.list(deferredSearch, category),
    queryFn: () =>
      productApi.getAll(
        deferredSearch,
        category !== "all" ? category : undefined
      ),
  });

  return (
    <div>
      <div style={{ marginBottom: token.sizeLG }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: token.size,
          }}
        >
          <Title level={2}>All Products</Title>
          <Link to="/products/add">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Add Product
            </Button>
          </Link>
        </div>

        <Card>
          <Row gutter={[token.size, token.size]}>
            <Col xs={24} md={8}>
              <Select
                value={category}
                onChange={setCategory}
                options={PRODUCT_CATEGORIES}
                size="large"
                style={{ width: "100%" }}
              />
            </Col>
            <Col xs={24} md={16}>
              <Search
                placeholder="Search products by name or description..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                onSearch={setSearch}
                onChange={(e) => !e.target.value && setSearch("")}
                style={{ width: "100%" }}
              />
            </Col>
          </Row>
        </Card>
      </div>

      {isLoading && (
        <div style={{ textAlign: "center" }}>
          <Spin size="large" />
          <Text
            type="secondary"
            style={{ display: "block", marginTop: token.size }}
          >
            Loading products...
          </Text>
        </div>
      )}

      {error && (
        <Card>
          <Empty
            description={
              <Text type="danger">
                Failed to load products. Please try again later.
              </Text>
            }
          />
        </Card>
      )}

      {!isLoading && !error && products && (
        <>
          {products.length == 0 ? (
            <Card>
              <Empty description="No products found" />
            </Card>
          ) : (
            <>
              <div style={{ marginBottom: token.size }}>
                <Text type="secondary">Found {products.length}</Text>
              </div>
              <Row gutter={[token.size, token.size]}>
                {products.map((product) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={product.id}>
                    <Card
                      hoverable
                      onClick={() => navigate(`/products/${product.id}`)}
                      style={{ cursor: "pointer" }}
                      cover={
                        <div
                          style={{
                            height: 192,
                            overflow: "hidden",
                          }}
                        >
                          <img
                            alt={product.name}
                            src={product.image}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      }
                      actions={[
                        <Link
                          to={`/products/${product.id}`}
                          key="view"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button type="link">View Details</Button>
                        </Link>,
                      ]}
                    >
                      <Space vertical size="small" style={{ width: "100%" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: token.sizeXS,
                          }}
                        >
                          <Tag color={getCategoryColor(product.category)}>
                            {product.category}
                          </Tag>
                          {favoriteIdsSet.has(product.id) && (
                            <HeartFilled
                              style={{
                                color: token.colorError,
                                fontSize: token.sizeLG,
                              }}
                            />
                          )}
                        </div>
                        <Card.Meta
                          title={
                            <div className="truncate" title={product.name}>
                              {product.name}
                            </div>
                          }
                          description={
                            <div
                              className="line-clamp-2"
                              style={{
                                minHeight: "2.8em",
                                lineHeight: "1.4em",
                              }}
                            >
                              {product.description}
                            </div>
                          }
                        />
                        <div style={{ marginTop: 12 }}>
                          <Text
                            strong
                            style={{
                              fontSize: token.fontSizeLG,
                              color: token.colorPrimary,
                            }}
                          >
                            {formatPrice(product.price, "₺")}
                          </Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </>
      )}
    </div>
  );
}
