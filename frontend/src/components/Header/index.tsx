import React, { Component } from "react";
import { Layout, Typography } from "antd";
import { Link } from "react-router-dom";
import history from "../../history";
import AuthService from "../../services/auth.service";

import "./styles.scss";

const { Text } = Typography;
const { Header } = Layout;

export class CustomHeader extends Component<unknown> {
    clearAuthToken = (): void => {
        AuthService.removeAuthToken();
        history.push("/login");
    };

    login(): JSX.Element | null {
        if (localStorage.getItem("authToken")) return null;
        return (
            <Link to="/login">
                <Text className="header-text">Log in</Text>
            </Link>
        );
    }

    logout(): JSX.Element | null {
        if (!localStorage.getItem("authToken")) return null;
        return (
            <div onClick={this.clearAuthToken}>
                <Text className="header-text pointer">Log out</Text>
            </div>
        );
    }

    render(): JSX.Element {
        return (
            <Header>
                <Link to="/home">
                    <div className="logo"></div>
                </Link>
                {this.login()}
                {this.logout()}
            </Header>
        );
    }
}
