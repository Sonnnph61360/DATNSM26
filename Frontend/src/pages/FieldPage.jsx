import {
  Layout,
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  List,
  Tag,
  Typography,
  Pagination,
  Radio,
} from "antd";

import {
  SearchOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import "./field.css";

const { Content } = Layout;
const { Title, Text } = Typography;

const stadiums = [
  {
    id: 1,
    name: "002 PB Club",
    location: "Thủ Đức, Hồ Chí Minh",
    sport: "Bóng đá",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1552667466-07770ae110d0?w=600",
  },
  {
    id: 2,
    name: "3T PB Club",
    location: "Quận 8, Hồ Chí Minh",
    sport: "Pickleball",
    count: 4,
    image:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600",
  },
  {
    id: 3,
    name: "Green Stadium",
    location: "Hà Nội",
    sport: "Bóng đá",
    count: 5,
    image:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600",
  },
];

export default function FieldPage() {
  return (
    <Layout style={{ background: "#f6f7fb" }}>
      {/* HERO */}

      <div className="hero">

        <Content className="hero-content">

          <Text style={{ color: "#fff" }}>
            Trang chủ / Tìm sân
          </Text>

          <Title style={{ color: "#fff", marginTop: 10 }}>
            🔍 Tìm sân thể thao
          </Title>

          <Text style={{ color: "#d9f7be", fontSize: 18 }}>
            Tìm thấy 438 cơ sở phù hợp
          </Text>

          <Row gutter={16} style={{ marginTop: 30 }}>
            <Col span={8}>
              <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Tên sân..."
              />
            </Col>

            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                size="large"
                defaultValue="Tất cả loại sân"
                options={[
                  { value: "all", label: "Tất cả loại sân" },
                  { value: "football", label: "Bóng đá" },
                  { value: "pickle", label: "Pickleball" },
                ]}
              />
            </Col>

            <Col span={6}>
              <Select
                style={{ width: "100%" }}
                size="large"
                defaultValue="Tất cả tỉnh"
                options={[
                  { value: "hn", label: "Hà Nội" },
                  { value: "hcm", label: "Hồ Chí Minh" },
                ]}
              />
            </Col>

            <Col span={4}>
              <Button
                type="primary"
                size="large"
                block
              >
                Tìm ngay
              </Button>
            </Col>
          </Row>

        </Content>

      </div>

      <Content style={{ padding: 30 }}>

        <Row gutter={20}>

          <Col span={6}>

            <Card title="Loại sân">

              <List
                dataSource={[
                  "Tất cả",
                  "Bóng đá",
                  "Bóng chuyền",
                  "Bóng rổ",
                  "Pickleball",
                  "Tennis",
                ]}
                renderItem={(item) => (
                  <List.Item>{item}</List.Item>
                )}
              />

            </Card>

          </Col>


          <Col span={18}>

            <Card
              title="438 cơ sở"
              extra={
                <Radio.Group defaultValue="list">
                  <Radio.Button value="list">
                    <BarsOutlined />
                  </Radio.Button>

                  <Radio.Button value="grid">
                    <AppstoreOutlined />
                  </Radio.Button>
                </Radio.Group>
              }
            >

              {stadiums.map((item) => (

                <Card
                  key={item.id}
                  style={{ marginBottom: 20 }}
                >

                  <Row gutter={20} align="middle">

                    <Col span={5}>

                      <img
                        src={item.image}
                        alt=""
                        style={{
                          width: "100%",
                          height: 130,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />

                    </Col>

                    <Col span={15}>

                      <Title level={4}>
                        {item.name}
                      </Title>

                      <p>
                        <EnvironmentOutlined />{" "}
                        {item.location}
                      </p>

                      <Tag color="green">
                        {item.sport}
                      </Tag>

                    </Col>

                    <Col span={4}>

                      <Button
                        type="primary"
                        style={{ marginBottom: 10 }}
                        block
                      >
                        Đặt sân
                      </Button>

                      <Button block>
                        Chi tiết
                      </Button>

                    </Col>

                  </Row>

                </Card>

              ))}

              <Pagination
                current={1}
                total={438}
                pageSize={20}
                style={{
                  textAlign: "center",
                  marginTop: 20,
                }}
              />

            </Card>

          </Col>

        </Row>

      </Content>
    </Layout>
  );
}