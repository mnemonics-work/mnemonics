import React, { Component } from "react";
import { Layout, Typography } from "antd";
import { Form, Input, Button } from "antd";

import "./styles.scss";
import history from "../../history";
import AuthService from "../../services/auth.service";
import { GOOGLE_LINK } from "global/constants";
import { CustomHeader } from "../Header";
import { MnemonicsAppApi } from "global/api";
import { ApiAuthRegisterRequest } from "global/generated-api";

const { Title } = Typography;
const { Content } = Layout;

export class SignUpPage extends Component<unknown> {
    state = {
        fullname: "",
        email: "",
        username: "",
        password: "",
    };

    constructor(props: unknown) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
        const {
            target: { value, name },
        } = event;

        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event: React.ChangeEvent): void {
        const { fullname, email, username, password } = this.state;
        const requestData = {
            fullname,
            email,
            username,
            password,
        };
        const request: ApiAuthRegisterRequest = { data: requestData };
        MnemonicsAppApi.apiAuthRegister(request).then(
            (data: { key: string }) => {
                const token = data.key;
                AuthService.setAuthToken(token);
                history.push("/home");
            },
            (error: unknown) => {
                alert("Check your credentials");
                console.error(error);
            },
        );
        event.preventDefault();
    }
    render(): JSX.Element {
        return (
            <Layout>
                <CustomHeader />
                <Layout>
                    <Layout>
                        <Content className="layout-content register-container">
                            <div className="center-content">
                                <Form onFinish={this.handleSubmit}>
                                    <Title>Sign up</Title>
                                    <div className="site-background center-content">
                                        <Form.Item
                                            label="Fullname"
                                            name="fullname"
                                            rules={[{ required: true, message: "Please input your fullname" }]}
                                        >
                                            <Input
                                                name="fullname"
                                                value={this.state.fullname}
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                            rules={[
                                                {
                                                    required: true,
                                                    type: "email",
                                                    message: "Please input your first name",
                                                },
                                            ]}
                                        >
                                            <Input
                                                name="email"
                                                value={this.state.email}
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Username"
                                            name="username"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input your username",
                                                },
                                            ]}
                                        >
                                            <Input
                                                name="username"
                                                value={this.state.username}
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            label="Password"
                                            name="password"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Please input your password",
                                                },
                                            ]}
                                        >
                                            <Input
                                                type="password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                    </div>
                                    <Button type="primary" block className="register-button" htmlType="submit">
                                        Register
                                    </Button>
                                    <a href={GOOGLE_LINK}>
                                        <Button block className="register-button google-button">
                                            <div>
                                                <img src="public/static/img/GoogleIcon.png" />
                                                <span>Register with Google</span>
                                            </div>
                                        </Button>
                                    </a>
                                </Form>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
