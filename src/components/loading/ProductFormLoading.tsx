import { Col, Row, Skeleton } from "antd";

function ProductFormLoading() {
  return (
    <div>
      <Skeleton.Input style={{ height: 20, width: 240 }} />
      <div>
        <Skeleton.Input style={{ height: 20, width: 240, marginTop: 16 }} />
      </div>
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col span={24} md={6}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
        <Col span={24} md={6}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
        <Col span={24} md={6}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
        <Col span={24} md={6}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
      </Row>
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col span={24} md={8}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
        <Col span={24} md={8}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
        <Col span={24} md={8}>
          <Skeleton.Input active block style={{ height: 80 }} />
        </Col>
      </Row>
      <div>
        <Skeleton.Input style={{ height: 20, width: 240, marginTop: 16 }} />
      </div>
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col>
          <Skeleton.Input active style={{ width: 160, height: 160 }} />
        </Col>
        <Col>
          <Skeleton.Input active style={{ width: 160, height: 160 }} />
        </Col>
        <Col>
          <Skeleton.Input active style={{ width: 160, height: 160 }} />
        </Col>
      </Row>
      <div>
        <Skeleton.Input style={{ height: 20, width: 240, marginTop: 16 }} />
      </div>
      <Skeleton.Input active block style={{ height: 100, marginTop: 16 }} />
      <Row style={{ marginTop: 16 }} gutter={[16, 16]}>
        <Col span={24} md={12}>
          <Skeleton.Input active block style={{ height: 150 }} />
        </Col>
        <Col span={24} md={12}>
          <Skeleton.Input active block style={{ height: 150 }} />
        </Col>
      </Row>
      <Skeleton.Button active style={{ marginTop: 16 }} />
    </div>
  );
}

export default ProductFormLoading;
