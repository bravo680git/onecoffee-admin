import { antdCtx } from "@/context";
import { authApi } from "@/services/api/auth";
import { authStorage } from "@/services/storage";
import { Button, Card, Form, Input, Layout, Space, Typography } from "antd";
import { InputOTP } from "antd-input-otp";
import { ArrowLeft, ArrowRight } from "iconsax-react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../routes/path";
import { RULES } from "../utils/constants";

const MSG: Record<string, string> = {
  TOKEN_INCORRECT: "Mã xác thực không đúng",
};

function Login() {
  const navigate = useNavigate();
  const { notificationApi } = useContext(antdCtx);

  const [inLastStep, setInLastStep] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitOTP = (value: string[]) => {
    setLoading(true);
    authApi
      .confirm(value.join(""))
      .then(() => {
        notificationApi?.success({
          message: "Đăng nhập thành công",
        });
        authStorage.setIsLoggedIn(true);
        navigate(path.home);
      })
      .catch((err: BaseResponse) => {
        notificationApi?.error({
          message: MSG[err.message] ?? "Có lỗi xảy ra",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmitEmail = (data: { email: string; password: string }) => {
    setLoading(true);
    authApi
      .login(data)
      .then((res) => {
        authStorage.setAccessToken(res.data.accessToken);
        authStorage.setRefreshToken(res.data.refreshToken);
        setInLastStep(true);
      })
      .catch(() => {
        notificationApi?.error({
          message: "Tài khoản không đúng",
        });
      })
      .finally(() => {
        setLoading(false);
      });
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
            <img src="/one-logo-dark.png" alt="" height={60} />
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
                  {/* <Button type="link">Gửi lại OTP</Button> */}
                </div>
              </>
            ) : (
              <>
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
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[RULES.REQUIRED]}
                >
                  <Input.Password />
                </Form.Item>
              </>
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
                  loading={loading}
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
                loading={loading}
              ></Button>
            )}
          </Form>
        </Card>
      </Layout.Content>
    </Layout>
  );
}

export default Login;
