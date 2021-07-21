import React, { Component } from "react";
import { Layout, Row, Typography } from "antd";
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

    isLogged = (): boolean => {
        return Boolean(AuthService.getAuthToken());
    };

    render(): JSX.Element {
        return (
            <Header>
                <Link to="/home">
                    <div className="logo"></div>
                </Link>
                {this.isLogged() ? (
                    <Row>
                        <Link to="/expression/create">
                            <Text className="header-text pointer">Create Mnemonics</Text>
                        </Link>
                        <div onClick={this.clearAuthToken}>
                            <Text className="header-text pointer">Log out</Text>
                        </div>
                    </Row>
                ) : (
                    <Link to="/login">
                        <Text className="header-text">Log in</Text>
                    </Link>
                )}
            </Header>
        );
    }
}
