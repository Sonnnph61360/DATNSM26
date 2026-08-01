// tim kiem
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
    name: "Sân TVB",
    location: "Phương Canh - Nam Từ Liêm - Hà Nội",
    sport: "Bóng rổ",
    count: 2,
    image:
      "https://www.decathlon.vn/blog/wp-content/uploads/2025/04/1-san-bong-ro-sai-gon.png",
  },
  {
    id: 2,
    name: "Sân Liên Mạc",
    location: "Hoàng Liên - Bắc Từ Liêm - Hà Nội",
    sport: "Bóng rổ",
    count: 4,
    image:
      "https://sonsanepoxy.vn/storage/news/thi-cong-san-bong-ro-11.jpg",
  },
  {
    id: 3,
    name: "Green Stadium",
    location: "Phú Thượng - Tây HỒ - Hà Nội",
    sport: "Bóng rổ",
    count: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7K8JLwJB8BB5jd5kVpEdOgshG3Qum9SaxY3l0Kgok_cqnuqFIlC3VzbG8&s=10",
  },
];

export default function FieldPage() {
  return (
    <Layout style={{ background: "#f6f7fb" }}>

      <div className="hero">

        <Content className="hero-content">

          <Text style={{ color: "#fff" }}>
            Trang chủ / Tìm sân
          </Text>

          <Title style={{ color: "#fff", marginTop: 10 }}>
            🔍 Tìm sân bóng rổ thể thao
          </Title>

          <Row gutter={16} style={{ marginTop: 30 }}>
            <Col span={8}>
              <Input
                size="large"
                prefix={<SearchOutlined />}
                placeholder="Tên sân..."
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

          </Col>


          <Col span={18}>

            <Card
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