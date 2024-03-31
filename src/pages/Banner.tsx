import {
  Button,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Table,
  TableProps,
  Typography,
  Upload,
} from "antd";
import ActionMenu from "../components/Actionmenu";
import { Box, Trash } from "iconsax-react";
import { RcFile } from "antd/es/upload";
import { useState } from "react";
import ImgCrop from "antd-img-crop";

const columns: TableProps["columns"] = [
  {
    title: "No.",
  },
  {
    title: "Hình ảnh",
    dataIndex: "image",
    render(v) {
      return <Image src={v} width={80} />;
    },
  },
  {
    title: "URL",
    dataIndex: "url",
  },
  {
    title: "Tùy chọn",
    render() {
      return <ActionMenu actions={["edit", "delete"]} />;
    },
  },
];

function Banner() {
  const [uploadImgSrc, setUploadImgSrc] = useState<string | undefined>();

  return (
    <div>
      <Row align="middle" justify="space-between">
        <Typography.Title level={3}> Quản lý banner </Typography.Title>
        <Button type="primary">Tạo mới</Button>
      </Row>
      <Table columns={columns} dataSource={[]} />
      <Modal centered title={"Thêm banner"}>
        <Form layout="vertical">
          <Form.Item label="Banner">
            <ImgCrop aspect={4}>
              <Upload.Dragger
                beforeUpload={() => false}
                onChange={({ file }) =>
                  setUploadImgSrc(URL.createObjectURL(file as RcFile))
                }
                multiple={false}
                maxCount={1}
                showUploadList={false}
                accept="image/*"
                style={{ position: "relative" }}
              >
                {uploadImgSrc ? (
                  <>
                    <img
                      src={uploadImgSrc}
                      alt=""
                      style={{
                        width: "100%",
                        aspectRatio: "4/1",
                        objectFit: "cover",
                        objectPosition: "center",
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    />
                    <Button
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 0,
                        zIndex: 10,
                      }}
                      danger
                      type="text"
                      icon={<Trash size={20} />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUploadImgSrc(undefined);
                      }}
                    ></Button>
                  </>
                ) : (
                  <div>
                    <p className="ant-upload-drag-icon">
                      <Box />
                    </p>
                    <p className="ant-upload-text">
                      Chọn hoặc kéo thả hình ảnh
                    </p>
                    <p className="ant-upload-hint">
                      Chọn hình ảnh có tỉ lệ 4/1 nhằm đảm bảo hiển thị tốt nhất.
                    </p>
                  </div>
                )}
              </Upload.Dragger>
            </ImgCrop>
          </Form.Item>
          <Form.Item label="URL">
            <Input placeholder="Nhập URL bài viết" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Banner;
