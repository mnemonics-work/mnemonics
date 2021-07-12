import React, { Component } from "react";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import { Button, Col, Input, Form, Layout, Row, Space, Typography } from "antd";

import "./styles.scss";
import logo from "../../assets/img/logo.jpg";
import { CustomFooter } from "../Footer";
import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from "global/constants";

const { Text } = Typography;

export class ComingSoonPage extends Component<unknown> {
    sendEmail = (data: { email: string }): void => {
        if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_USER_ID) {
            emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data, EMAILJS_USER_ID).then(
                (result) => {
                    if (result.text === "OK") {
                        alert("Your email was sent successfully.");
                    } else {
                        alert("There was a problem sending your email, please try again.");
                        console.error(result);
                    }
                },
                (error) => {
                    alert("There was a problem sending your email, please try again.");
                    console.error(error);
                },
            );
        }
    };

    render(): JSX.Element {
        return (
            <Layout className="body-coming-soon">
                <div className="logo-mnemonics">
                    <img src={logo} alt="Logo" />
                    <span> Mnemonics Work </span>
                </div>
                <div className="flex-row content-coming-soon">
                    <div className="row-content">
                        <div>
                            <Space direction="vertical" size="large">
                                <Row>
                                    <Col span={24}>
                                        <div className="title-coming-soon"> Coming Soon </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Text>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed malesuada,
                                            metus ut condimentum pretium, nibh felis eleifend eros, a consectetur sem
                                            arcu nec sem. Suspendisse elementum, nunc efficitur bibendum auctor, massa
                                            lorem lobortis orci, sit amet egestas nisi ex a mauris. Sed congue gravida
                                            enim vitae laoreet. Morbi risus erat, mattis eu ex at, rutrum eleifend
                                            turpis. Donec suscipit vitae ipsum nec mollis.
                                        </Text>
                                        <div className="mnemonics-email">
                                            Write us to <a href="mailto:info@mnemonics.work"> info@mnemonics.work </a>{" "}
                                            or send us your email to be in contact with you:
                                        </div>
                                        <Form className="contact-form" onFinish={this.sendEmail}>
                                            <Form.Item name="email" className="email-input">
                                                <Input placeholder="Email" name="email" type="email" required />
                                            </Form.Item>
                                            <Button htmlType="submit">Send</Button>
                                        </Form>
                                        <div className="mnemonics-check-staging">
                                            You can check Mnemonics Work progress with the next button:
                                        </div>
                                        <Link to="/home" className="home-button">
                                            <Button type="primary">Enter Mnemonics Staging</Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </Space>
                        </div>
                    </div>
                </div>
                <CustomFooter />
            </Layout>
        );
    }
}
