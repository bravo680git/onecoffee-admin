import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import { RcFile } from "antd/es/upload";
import { Box, Trash } from "iconsax-react";
import { useCallback, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useParams } from "react-router-dom";
import { BLOG_EDITOR_OPTION } from "../../utils/constants";
import CropImg from "antd-img-crop";

function BlogDetail() {
  const { id } = useParams();
  const reactQuillRef = useRef<ReactQuill>(null);

  const inCreateMode = id === "new";

  const [uploadImgSrc, setUploadImgSrc] = useState<string | undefined>();

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        console.log(file);
        const url = "/logo.png";

        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range && quill.getEditor().insertEmbed(range.index, "image", url);
        }
      }
    };
  }, []);

  const handleUploadCoverImg: UploadProps["onChange"] = ({ file }) => {
    setUploadImgSrc(URL.createObjectURL(file as RcFile));
  };

  return (
    <div>
      <Typography.Title level={3}>
        {inCreateMode ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
      </Typography.Title>
      <Form layout="vertical">
        <Row>
          <Col span={24} md={12} lg={8}>
            <Form.Item label="Ảnh chủ đề">
              <CropImg aspect={4 / 3}>
                <Upload.Dragger
                  beforeUpload={() => false}
                  onChange={handleUploadCoverImg}
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
                          width: 360,
                          height: 270,
                          objectFit: "cover",
                          objectPosition: "center",
                          borderRadius: 8,
                          overflow: "hidden",
                        }}
                      />
                      <Button
                        style={{
                          position: "absolute",
                          right: 8,
                          top: 8,
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
                        Chọn hình ảnh có tỉ lệ 4/3 nhằm đảm bảo hiển thị tốt
                        nhất.
                      </p>
                    </div>
                  )}
                </Upload.Dragger>
              </CropImg>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} md={8}>
            <Form.Item label="Tiêu đề bài viết">
              <Input placeholder="Bạn đã biết cách bảo quản thực phẩm đúng cách?" />
            </Form.Item>
          </Col>
          <Col span={24} md={8}>
            <Form.Item label="Danh mục">
              <Select placeholder="Mẹo vặt" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Nội dung bài viết">
          <ReactQuill
            ref={reactQuillRef}
            theme="snow"
            formats={BLOG_EDITOR_OPTION.format}
            modules={{
              toolbar: {
                container: BLOG_EDITOR_OPTION.toolbar.container,
                handlers: {
                  image: imageHandler,
                },
              },
            }}
            placeholder="Bạn đã biết cách bảo quản thực phẩm đúng cách?"
          />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Form.Item label="Từ khóa SEO">
              <Input.TextArea
                placeholder="bảo quản thực phẩm, bao quan thuc pham"
                rows={3}
                style={{ resize: "none" }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item label="Mô tả SEO">
              <Input.TextArea
                placeholder="Để bảo quản thực phẩm đúng cách có các cách ..."
                rows={3}
                style={{ resize: "none" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Button type="primary">
            {inCreateMode ? "Tạo bài viết" : "Cập nhật bài viết"}
          </Button>
        </Row>
      </Form>
    </div>
  );
}

export default BlogDetail;
