import TableLoading from "@/components/loading/TableLoading";
import { antdCtx } from "@/context";
import { orderApi } from "@/services/api/order";
import { OrderType } from "@/services/api/type/order";
import {
  ORDER_STATUS,
  ORDER_STATUS_DIST,
  ORDER_STATUS_OPTIONS_BY_CURRENT_STATUS,
} from "@/utils/constants";
import { transformCurrency } from "@/utils/functions";
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
  Tag,
  Typography,
} from "antd";
import { useContext, useEffect, useMemo, useRef, useState } from "react";

const orderProductColumns: TableProps<
  OrderType["orderDetails"][number]
>["columns"] = [
  {
    title: "No.",
    render(_, __, i) {
      return i + 1;
    },
  },
  {
    title: "Tên sản phẩm",
    dataIndex: ["product", "name"],
  },
  {
    title: "Tùy chọn(nếu có)",
    dataIndex: ["variant", "values"],
    render(value) {
      return Array.isArray(value) ? value.join(", ") : value;
    },
  },
  {
    title: "Đơn giá",
    render(_, record) {
      return transformCurrency(
        record.variant ? record.variant.price : record.product.price
      );
    },
  },
  {
    title: "Số lượng",
    dataIndex: "quantity",
  },
  {
    title: "Ưu đãi(%)",
    dataIndex: ["product", "salePercent"],
  },
  {
    title: "Thành tiền",
    dataIndex: "total",
    render(_, record) {
      return transformCurrency(
        (record.variant ? record.variant.price : record.product.price)! *
          record.quantity,
        record.product.salePercent
      );
    },
  },
];

const columns: TableProps<OrderType>["columns"] = [
  {
    title: "No.",
    render(_, __, i) {
      return i + 1;
    },
    width: 60,
  },
  {
    title: "Người đặt",
    dataIndex: ["user", "name"],
  },
  {
    title: "Email",
    dataIndex: ["user", "email"],
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render(_, record) {
      return (
        <Tag color={ORDER_STATUS_DIST[record.status].color}>
          {ORDER_STATUS_DIST[record.status].title}
        </Tag>
      );
    },
    width: 140,
    align: "center",
  },
  {
    title: "Tổng cộng",
    dataIndex: "totalPrice",
    render(value) {
      return transformCurrency(value);
    },
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    render(value) {
      return new Date(value).toLocaleString("vi", {
        timeStyle: "short",
        dateStyle: "short",
      });
    },
  },
];

function Order() {
  const [form] = Form.useForm();
  const statusRef = useRef<ORDER_STATUS>();
  const { notificationApi } = useContext(antdCtx);

  const [modalData, setModalData] = useState<OrderType>();
  const [enableEditStatus, setEnableEditStatus] = useState(false);
  const [items, setItems] = useState<OrderType[]>();
  const orderStatus = Form.useWatch("status", form) as ORDER_STATUS | undefined;
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>();

  const statusOptions = Object.keys(ORDER_STATUS).map((key) => ({
    value: key,
    label: ORDER_STATUS_DIST[key as keyof typeof ORDER_STATUS_DIST].title,
  }));

  const modalStatusOptions = statusRef.current
    ? [
        ...ORDER_STATUS_OPTIONS_BY_CURRENT_STATUS[statusRef.current],
        statusRef.current,
      ]?.map((key) => ({
        value: key,
        label: ORDER_STATUS_DIST[key as keyof typeof ORDER_STATUS_DIST].title,
      }))
    : [];

  const filterItems = useMemo(() => {
    return items?.filter((item) => {
      if (filterStatus) {
        return item.status === filterStatus;
      }
      return true;
    });
  }, [items, filterStatus]);

  const fetchData = () => {
    orderApi
      .getAll()
      .then((res) => {
        setItems(res.data.orders);
      })
      .catch();
  };

  const handleEditStatus = () => {
    if (!enableEditStatus) {
      setEnableEditStatus(true);
    } else {
      setLoading(true);
      orderApi
        .update(modalData!.id, {
          status: orderStatus!,
          reason: form.getFieldValue("reason") ?? undefined,
        })
        .then(() => {
          notificationApi?.success({
            message: "Cập nhật trạng thái đơn hàng thành công",
          });
          fetchData();
          setModalData(undefined);
        })
        .catch(() => {
          notificationApi?.error({
            message: "Cập nhật trạng thái đơn hàng thất bại",
          });
        })
        .finally(() => {
          setLoading(false);
          setEnableEditStatus(false);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!items) {
    return <TableLoading />;
  }

  return (
    <div>
      <Typography.Title level={3}>Quản lý đơn hàng</Typography.Title>
      <Table
        columns={columns}
        dataSource={filterItems}
        rowKey="id"
        bordered
        pagination={{ pageSize: 20 }}
        scroll={{ y: "calc(100vh - 326px)", x: 1400 }}
        onRow={(record) => ({
          onClick() {
            setModalData(record);
            statusRef.current = record.status;
          },
        })}
        title={() => (
          <Row gutter={[16, 16]}>
            <Col span={24} md={12} lg={6}>
              <Select
                style={{ width: "100%" }}
                placeholder="Trạng thái đơn hàng"
                options={statusOptions}
                value={filterStatus}
                onChange={setFilterStatus}
                allowClear
              />
            </Col>
          </Row>
        )}
      />
      <Modal
        open={!!modalData}
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
        destroyOnClose
        onCancel={() => setModalData(undefined)}
      >
        <Form
          layout="vertical"
          initialValues={modalData}
          preserve={false}
          form={form}
        >
          <Typography.Title level={5}>Trạng thái đơn hàng</Typography.Title>
          <Row>
            <Col span={24} lg={8}>
              <Flex gap={8}>
                <Form.Item<OrderType> name="status">
                  <Select
                    disabled={!enableEditStatus}
                    options={modalStatusOptions}
                    style={{ minWidth: 180 }}
                  />
                </Form.Item>
                <Button
                  onClick={handleEditStatus}
                  type={enableEditStatus ? "primary" : "default"}
                  disabled={!modalStatusOptions.length}
                  loading={loading}
                >
                  {enableEditStatus ? "Xác nhận" : "Chỉnh sửa"}
                </Button>
              </Flex>
            </Col>
            {orderStatus &&
              [ORDER_STATUS.NOT_EXECUTE, ORDER_STATUS.FAIL].includes(
                orderStatus
              ) && (
                <Col span={24}>
                  <Form.Item<OrderType> label="Lý do" name="reason">
                    <Input.TextArea rows={3} style={{ resize: "none" }} />
                  </Form.Item>
                </Col>
              )}
          </Row>
          <Typography.Title level={5}>Thông tin khách hàng</Typography.Title>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={8}>
              <Form.Item<OrderType> label="Họ và tên" name={["user", "name"]}>
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item<OrderType> label="Email" name={["user", "email"]}>
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Typography.Title level={5}>Thông tin đơn hàng</Typography.Title>
        <Table
          columns={orderProductColumns}
          dataSource={modalData?.orderDetails}
          bordered
          pagination={false}
          rowKey="id"
          footer={() => (
            <>
              <Row align="middle" justify="space-between">
                <Typography.Title style={{ margin: 0 }} level={5}>
                  Tổng cộng
                </Typography.Title>
                <Typography.Title style={{ margin: 0 }} level={4}>
                  {transformCurrency(modalData?.totalPrice)}
                </Typography.Title>
              </Row>
              <Typography.Text>
                Ngày đặt:{" "}
                {new Date(modalData?.createdAt ?? "").toLocaleString("vi", {
                  timeStyle: "short",
                  dateStyle: "short",
                })}
              </Typography.Text>
            </>
          )}
        ></Table>
        <Typography.Title style={{ marginTop: 16 }} level={5}>
          Thông tin giao hàng
        </Typography.Title>
        <Form layout="vertical" initialValues={modalData}>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={8}>
              <Form.Item<OrderType>
                label="Họ và tên"
                name={["address", "name"]}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item<OrderType>
                label="Số điện thoại"
                name={["address", "phone"]}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={24} lg={8}>
              <Form.Item<OrderType>
                label="Loại địa chỉ"
                name={["address", "type"]}
              >
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} lg={12}>
              <Form.Item label="Địa chỉ giao hàng">
                <Input.TextArea
                  style={{ resize: "none" }}
                  rows={3}
                  readOnly
                  value={`${modalData?.address?.address}, ${modalData?.address?.ward}, ${modalData?.address?.district}, ${modalData?.address?.province}`}
                />
              </Form.Item>
            </Col>
            <Col span={24} lg={12}>
              <Form.Item<OrderType> label="Ghi chú" name="note">
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
