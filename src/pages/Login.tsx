import { Button, Card, Form, Input, Layout, Space, Typography } from "antd";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { useState } from "react";
import { InputOTP } from "antd-input-otp";
import { RULES } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { path } from "../routes/path";

function Login() {
  const navigate = useNavigate();
  const [inLastStep, setInLastStep] = useState(false);

  const handleSubmitOTP = (value: string[]) => {
    console.log(value);
    setInLastStep(false);
    navigate(path.home);
  };

  const handleSubmitEmail = (data: { email: string }) => {
    console.log(data);

    setInLastStep(!inLastStep);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Layout.Content
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          styles={{
            body: {
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            },
          }}
        >
          <Space>
            <img src="/logo.png" alt="" width={80} height={80} />
            <Typography.Title level={2}>Administrator login</Typography.Title>
          </Space>
          <Form layout="vertical" onFinish={handleSubmitEmail}>
            {inLastStep ? (
              <>
                <Form.Item label="Nhập mã OTP">
                  <InputOTP
                    styles={{ input: { height: 44 } }}
                    autoSubmit={handleSubmitOTP}
                  />
                </Form.Item>
                <div style={{ maxWidth: 360, marginBottom: 16 }}>
                  <Typography.Text>
                    Mã OTP vừa được gửi đến email của bạn, có hiệu lực trong
                    vòng 1 phút
                  </Typography.Text>
                  <Button type="link">Gửi lại OTP</Button>
                </div>
              </>
            ) : (
              <Form.Item
                label="Email admin"
                name="email"
                rules={[
                  RULES.REQUIRED,
                  { type: "email", message: "Định dạng email không đúng" },
                ]}
              >
                <Input placeholder="admin@new3t.com" />
              </Form.Item>
            )}
            {!inLastStep ? (
              <Form.Item>
                <Button
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                  type="primary"
                  htmlType="submit"
                >
                  <span>Continue</span>
                  <ArrowRight size={20} />
                </Button>
              </Form.Item>
            ) : (
              <Button
                style={{ width: "100%" }}
                icon={<ArrowLeft size={20} />}
                onClick={() => setInLastStep(false)}
              ></Button>
            )}
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  );
}

export default Login;
