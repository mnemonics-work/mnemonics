import React, { Component } from "react";
import { Layout, Typography } from "antd";
import { Form, Input, Button } from "antd";
import { Link } from "react-router-dom";

import "./styles.scss";
import history from "../../history";
import AuthService from "../../services/auth.service";
import { CustomHeader } from "../Header";
import { MnemonicsAppApi } from "global/api";
import { ApiAuthLoginRequest, ApiAuthGoogleRequest } from "global/generated-api";
import { GOOGLE_REDIRECT_URI, GOOGLE_LINK } from "global/constants";

const { Title } = Typography;
const { Content } = Layout;

interface LoginProps {
    location: { search: string };
}

export class LoginPage extends Component<LoginProps> {
    state = {
        username: "",
        password: "",
    };

    constructor(props: LoginProps) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(): void {
        const queryParams = new URLSearchParams(this.props.location.search);
        const code = queryParams.get("code");
        if (code) {
            const requestData = { code: code, redirectUri: GOOGLE_REDIRECT_URI };
            const request: ApiAuthGoogleRequest = { data: requestData };
            MnemonicsAppApi.apiAuthGoogle(request).then(
                (data: { key: string }) => {
                    const token = data.key;
                    AuthService.setAuthToken(token);
                    history.push("/");
                },
                (error: unknown) => {
                    alert("Check your credentials");
                    console.error(error);
                },
            );
        }
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
        const requestData = { username: this.state.username, password: this.state.password };
        const request: ApiAuthLoginRequest = { data: requestData };
        MnemonicsAppApi.apiAuthLogin(request).then(
            (data: { key: string }) => {
                const token = data.key;
                AuthService.setAuthToken(token);
                history.push("/");
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
                        <Content className="layout-content login-container">
                            <div className="center-content">
                                <Form onFinish={this.handleSubmit}>
                                    <Title>Log in</Title>
                                    <div className="site-background center-content inputs">
                                        <Form.Item
                                            label="Username"
                                            name="username"
                                            rules={[{ required: true, message: "Please input your username" }]}
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
                                            rules={[{ required: true, message: "Please input your password" }]}
                                        >
                                            <Input
                                                type="password"
                                                name="password"
                                                value={this.state.password}
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Item>
                                    </div>
                                    <Button type="primary" block className="login-button" htmlType="submit">
                                        Enter
                                    </Button>
                                    <a href={GOOGLE_LINK}>
                                        <Button block className="login-button google-button">
                                            <div>
                                                <img src="public/static/img/GoogleIcon.png" />
                                                <span>Enter with Google</span>
                                            </div>
                                        </Button>
                                    </a>
                                    <div className="sign-up-link">
                                        Don&apos;t have an account?{" "}
                                        <Link to="/sign-up">
                                            <b>Sign up</b>
                                        </Link>
                                    </div>
                                </Form>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        );
    }
}
