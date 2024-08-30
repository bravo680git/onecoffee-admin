import { antdCtx } from "@/context";
import { path } from "@/routes/path";
import { blogApi } from "@/services/api/blog";
import { categoryApi } from "@/services/api/category";
import { CreateBlogPayload } from "@/services/api/type/blog";
import { upload } from "@/services/api/upload";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  SelectProps,
  Typography,
  Upload,
  UploadProps,
} from "antd";
import CropImg from "antd-img-crop";
import { Box, Trash } from "iconsax-react";
import QuillBlotFormatter from "quill-blot-formatter/dist/BlotFormatter";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  BLOG_EDITOR_OPTION,
  CATEGORY_TYPE,
  FAKE_UPLOAD_URL,
  MSG_DIST,
  RULES,
} from "../../utils/constants";

ReactQuill.Quill.register("modules/blotFormatter", QuillBlotFormatter);

type BlogFormType = Omit<CreateBlogPayload, "thumbnail"> & {
  thumbnail: File;
};

function BlogDetail() {
  const { id } = useParams();
  const reactQuillRef = useRef<ReactQuill>(null);
  const [form] = Form.useForm<BlogFormType>();
  const { notificationApi, modalApi } = useContext(antdCtx);
  const navigate = useNavigate();

  const inCreateMode = id === "new";

  const [uploadImgSrc, setUploadImgSrc] = useState<string | undefined>();
  const [categoryOptions, setCategoryOptions] = useState<
    SelectProps["options"]
  >([]);
  const [loading, setLoading] = useState(false);

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        const name = form.getFieldValue("title");

        upload(name, file)
          .then((res) => {
            const url = res.data.image.url;
            const quill = reactQuillRef.current;
            if (quill) {
              const range = quill.getEditorSelection();
              range && quill.getEditor().insertEmbed(range.index, "image", url);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }, [form]);

  const handleUploadCoverImg: UploadProps["onChange"] = ({ file }) => {
    setUploadImgSrc(URL.createObjectURL(file.originFileObj!));
    form.setFieldValue("thumbnail", file.originFileObj);
  };

  const handleSubmit = async (data: BlogFormType) => {
    setLoading(true);
    let thumbnail = uploadImgSrc;
    if (data.thumbnail instanceof File) {
      await upload(data.title ?? "", data.thumbnail)
        .then((res) => {
          thumbnail = res.data.image.url;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    const api = inCreateMode
      ? blogApi.create({ ...data, thumbnail })
      : blogApi.update(Number(id), { ...data, thumbnail });

    api
      .then(() => {
        notificationApi?.success({ message: "Thành công" });
        navigate(path.blogs);
      })
      .catch((err: BaseResponse) => {
        notificationApi?.error({
          message: MSG_DIST[err.message] ?? "Có lỗi xảy ra",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePreview = () => {
    const title = form.getFieldValue("title");
    const content = form.getFieldValue("content");
    modalApi?.info({
      title: (
        <Typography.Title level={4}>{title || "Preview"}</Typography.Title>
      ),
      closable: true,
      icon: null,
      content: (
        <div
          style={{
            backgroundColor: "white",
            color: "black",
            maxWidth: "1200px",
            margin: "0 auto",
            maxHeight: window.innerHeight - 180,
            overflow: "auto",
          }}
          className="ql-editor"
        >
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
      ),
      style: { width: "100%" },
      width: "90%",
      centered: true,
    });
  };

  useEffect(() => {
    categoryApi
      .getAll()
      .then((res) => {
        setCategoryOptions(
          res.data
            .filter((item) => item.parentId === CATEGORY_TYPE.BLOG)
            .map((item) => ({
              label: item.name,
              value: item.id,
            }))
        );
      })
      .catch();

    if (Number(id)) {
      blogApi
        .getById(Number(id))
        .then((res) => {
          form.setFieldsValue(res.data);
          setUploadImgSrc(res.data.thumbnail);
        })
        .catch();
    }
  }, [id, form]);

  return (
    <div>
      <Typography.Title level={3}>
        {inCreateMode ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
      </Typography.Title>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Row>
          <Col flex={"300px"}>
            <Form.Item<BlogFormType> label="Ảnh chủ đề" name="thumbnail">
              <CropImg aspect={16 / 9}>
                <Upload.Dragger
                  onChange={handleUploadCoverImg}
                  multiple={false}
                  maxCount={1}
                  showUploadList={false}
                  accept="image/*"
                  style={{ position: "relative" }}
                  action={FAKE_UPLOAD_URL}
                >
                  {uploadImgSrc ? (
                    <>
                      <img
                        src={uploadImgSrc}
                        alt=""
                        style={{
                          width: 360,
                          height: 180,
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
                          form.setFieldValue("thumbnail", undefined);
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
                        Chọn hình ảnh có tỉ lệ 16/9 nhằm đảm bảo hiển thị tốt
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
            <Form.Item<BlogFormType>
              name="title"
              label="Tiêu đề bài viết"
              rules={[RULES.REQUIRED]}
            >
              <Input placeholder="Bạn đã biết cách bảo quản thực phẩm đúng cách?" />
            </Form.Item>
          </Col>
          {(inCreateMode || form.getFieldValue("createdAt")) && (
            <Col span={24} md={8}>
              <Form.Item<BlogFormType>
                label="Danh mục"
                name="categoryId"
                rules={[RULES.REQUIRED]}
              >
                <Select placeholder="Mẹo vặt" options={categoryOptions} />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Form.Item<BlogFormType>
          label="Nội dung bài viết"
          name="content"
          rules={[RULES.REQUIRED]}
        >
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
              blotFormatter: {},
            }}
            placeholder="Bạn đã biết cách bảo quản thực phẩm đúng cách?"
          />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col span={24} md={12}>
            <Form.Item<BlogFormType> label="Từ khóa SEO" name="seoKeyword">
              <Input.TextArea
                placeholder="bảo quản thực phẩm, bao quan thuc pham"
                rows={3}
                style={{ resize: "none" }}
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item<BlogFormType> label="Mô tả SEO" name="seoDescription">
              <Input.TextArea
                placeholder="Để bảo quản thực phẩm đúng cách có các cách ..."
                rows={3}
                style={{ resize: "none" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                {inCreateMode ? "Tạo bài viết" : "Cập nhật bài viết"}
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Button onClick={handlePreview}>Preview</Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default BlogDetail;
