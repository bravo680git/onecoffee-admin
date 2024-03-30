import { Col, Row, Skeleton } from "antd";

function BlogFormLoading() {
  return (
    <div>
      <Skeleton.Input active style={{ height: 20, width: 240 }} />
      <Row style={{ marginTop: 16 }}>
        <Skeleton.Input active style={{ height: 150, width: 400 }} />
      </Row>
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col span={24} md={6}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
        <Col span={24} md={6}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col span={24}>
          <Skeleton.Input active block style={{ height: 300 }} />
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Skeleton.Input block active style={{ height: 120 }} />
        </Col>
        <Col span={24} md={12}>
          <Skeleton.Input block active style={{ height: 120 }} />
        </Col>
      </Row>
      <Skeleton.Button active style={{ marginTop: 16 }} />
    </div>
  );
}

export default BlogFormLoading;
