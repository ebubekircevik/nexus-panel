import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Result, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";

export function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          icon={<HomeOutlined />}
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      }
    />
  );
}
