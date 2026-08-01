import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Input,
  Tag,
  List,
  Button,
} from "antd";

import {
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import "./blog.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Search } = Input;

const blogs = [
  {
    id: 1,
    title: "Top 10 phần mềm quản lý sân tốt nhất",
    category: "Phần mềm",
    image:
      "https://munichgroup.vn/wp-content/uploads/san-bong-ro-dep-9-1.webp",
    desc: "Mẫu sân bóng rổ đẹp – sành điệu được giới trẻ yêu thích.",
    date: "31/07/2026",
  },
  {
    id: 2,
    title: "Kinh nghiệm kinh doanh sân bóng rổ hiệu quả",
    category: "Kinh doanh",
    image:
      "https://bizweb.dktcdn.net/100/180/757/files/kich-thuoc-san-bong-ro-tre-em-la-bao-nhieu.jpg?v=1531377224399",
    desc: "Những kinh nghiệm giúp tăng doanh thu sân bóng.",
    date: "30/07/2026",
  },
  {
    id: 3,
    title: "Xu hướng sân bóng rổ năm 2026",
    category: "Xu hướng",
    image:
      "https://www.myuc.vn/uploads/products/2023/03/24/3.jpg",
    desc: "Những xu hướng nổi bật trong ngành thể thao.",
    date: "29/07/2026",
  },
];

export default function Blog() {
  return (
    <Layout style={{ background: "#f5f5f5" }}>

      <div className="hero">

        <Tag color="green" style={{ padding: "6px 18px" }}>
          Blog
        </Tag>

        <Title level={1} style={{ color: "#fff", marginTop: 20 }}>
          Kiến Thức Quản Lý Sân Thể Thao
        </Title>

        <Paragraph style={{ color: "#fff", fontSize: 17 }}>
          Tổng hợp kiến thức, hướng dẫn và kinh nghiệm kinh doanh sân bóng.
        </Paragraph>

        <Search
          placeholder="Tìm bài viết..."
          size="large"
          style={{ maxWidth: 650 }}
        />
      </div>

      <Content style={{ padding: 40 }}>

        <Row gutter={24}>

          <Col xs={24} lg={17}>

            <Row gutter={[20, 20]}>

              {blogs.map((item) => (
                <Col xs={24} md={12} key={item.id}>

                  <Card
                    hoverable
                    cover={
                      <img
                        alt=""
                        src={item.image}
                        style={{
                          height: 230,
                          objectFit: "cover",
                        }}
                      />
                    }
                  >
                    <Tag color="green">{item.category}</Tag>

                    <Title level={4}>{item.title}</Title>

                    <Paragraph>{item.desc}</Paragraph>

                    <div className="card-bottom">

                      <span>
                        <CalendarOutlined /> {item.date}
                      </span>

                      <Button type="link">
                        Đọc tiếp <ArrowRightOutlined />
                      </Button>

                    </div>
                  </Card>

                </Col>
              ))}

            </Row>

          </Col>


          <Col xs={24} lg={7}>

            <Card title="Chuyên mục">

              <List
                dataSource={[
                  "Tất cả",
                  "Phần mềm",
                  "Kinh doanh",
                  "Xu hướng",
                  "Hướng dẫn",
                ]}
                renderItem={(item) => (
                  <List.Item>{item}</List.Item>
                )}
              />

            </Card>

            <Card
              title="Bài viết mới"
              style={{ marginTop: 20 }}
            >

              <List
                dataSource={blogs}
                renderItem={(item) => (
                  <List.Item>
                    {item.title}
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}