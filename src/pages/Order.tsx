import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
  TableProps,
  Typography,
} from "antd";
import ActionMenu from "../components/Actionmenu";
import { useState } from "react";

const columns: TableProps["columns"] = [
  {
    title: "No.",
  },
  {
    title: "Khách hàng",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
  },
  {
    title: "Giá",
    dataIndex: "price",
  },
  {
    title: "Địa chỉ giao hàng",
    dataIndex: "address",
  },
  {
    title: "Tùy chọn",
    dataIndex: "action",
    width: 120,
    render() {
      return <ActionMenu actions={["view", "create", "edit"]} />;
    },
  },
];

const orderProductColumns: TableProps["columns"] = [
  {
    title: "No.",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
  },
  {
    title: "Tùy chọn(nếu có)",
    dataIndex: "options",
  },
  {
    title: "Đơn giá",
    dataIndex: "price",
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Ưu đãi",
    dataIndex: "sale",
  },
  {
    title: "Thành tiền",
    dataIndex: "total",
  },
];

function Order() {
  const [enableEditStatus, setEnableEditStatus] = useState(false);

  const handleEditStatus = () => {
    if (!enableEditStatus) {
      setEnableEditStatus(true);
    }
  };
  return (
    <div>
      <Typography.Title level={3}>Quản lý đơn hàng</Typography.Title>
      <Table columns={columns} dataSource={[{}]} bordered />
      <Modal
        title={<Typography.Title level={4}>Chi tiết đơn hàng</Typography.Title>}
        centered
        styles={{
          content: {
            width: "80vw",
            maxWidth: 800,
          },
        }}
        okButtonProps={{ style: { display: "none" } }}
        cancelText="Đóng"
      >
        <Form layout="vertical">
          <Typography.Title level={5}>Trạng thái đơn hàng</Typography.Title>
          <Row>
            <Col span={24} lg={8}>
              <Form.Item>
                <Flex gap={8}>
                  <Select disabled={!enableEditStatus} />
                  <Button
                    onClick={handleEditStatus}
                    type={enableEditStatus ? "primary" : "default"}
                  >
                    {enableEditStatus ? "Xác nhận" : "Chỉnh sửa"}
                  </Button>
                </Flex>
              </Form.Item>
            </Col>
          </Row>
          <Typography.Title level={5}>Thông tin khách hàng</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={8}>
              <Form.Item label="Họ và tên">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item label="Số điện thoại">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item label="Email">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Typography.Title level={5}>Thông tin đơn hàng</Typography.Title>
        <Table
          columns={orderProductColumns}
          dataSource={[]}
          bordered
          footer={() => (
            <>
              <Row align="middle" justify="space-between">
                <Typography.Title style={{ margin: 0 }} level={5}>
                  Tổng cộng
                </Typography.Title>
                <Typography.Title style={{ margin: 0 }} level={4}>
                  2 củ
                </Typography.Title>
              </Row>
              <Typography.Text>
                Ngày đặt: {new Date().toLocaleString("vi")}
              </Typography.Text>
            </>
          )}
        ></Table>
        <Typography.Title style={{ marginTop: 16 }} level={5}>
          Thông tin giao hàng
        </Typography.Title>
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            <Col span={24} lg={12}>
              <Form.Item label="Địa chỉ giao hàng">
                <Input.TextArea style={{ resize: "none" }} rows={3} readOnly />
              </Form.Item>
            </Col>
            <Col span={24} lg={12}>
              <Form.Item label="Ghi chú">
                <Input.TextArea style={{ resize: "none" }} rows={3} readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}

export default Order;
