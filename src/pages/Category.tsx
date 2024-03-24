import {
  Button,
  Form,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
  TreeSelect,
  Typography,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useState } from "react";
import TableLoading from "../components/loading/TableLoading";

const columns: TableProps["columns"] = [
  {
    key: "index",
    title: "No.",
    render(value, record, index) {
      return index + 1;
    },
    width: 60,
  },
  {
    key: "name",
    dataIndex: "name",
    title: "Tiêu đề",
  },
];

function Category() {
  const [modalState, setModalState] = useState<ModalState>({});
  const [data, setData] = useState();

  const handleSubmit = (data: unknown) => {
    console.log(data);
  };

  if (!data) {
    return <TableLoading />;
  }

  return (
    <>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Typography.Title level={3}>Danh mục</Typography.Title>
        <Button type="primary" onClick={() => setModalState({ open: true })}>
          Thêm mới
        </Button>
      </Row>
      <Table bordered columns={columns}></Table>

      <Modal
        open={modalState.open}
        title="Danh mục"
        centered
        onCancel={() => setModalState({ open: false })}
        destroyOnClose
        okButtonProps={{ form: "form", htmlType: "submit" }}
      >
        <Form layout="vertical" onFinish={handleSubmit} id="form">
          <FormItem label="Danh mục cha">
            <TreeSelect
              style={{ width: "100%" }}
              placeholder="Chọn danh mục cha(nếu có)"
            />
          </FormItem>
          <FormItem
            label="Tên danh mục"
            required
            rules={[{ required: true, message: "Tên danh mục là bắt buộc" }]}
            name="name"
          >
            <Input placeholder="Nhập tên danh mục" />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
}

export default Category;
