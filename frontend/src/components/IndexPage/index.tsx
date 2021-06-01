import React, { Component } from "react";
import { Layout, Typography } from "antd";
import { Input, Space } from "antd";

import { CardList } from "../CardList";
import history from "../../history";
import "./styles.scss";
import { NavigationMenu } from "../NavigationMenu";

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Sider, Footer } = Layout;
const { Search } = Input;

export class IndexPage extends Component<unknown> {
    goToSearchPage = (searchText: string): void => {
        history.push("/search/" + searchText);
    };

    render(): JSX.Element {
        return (
            <Layout>
                <Header>
                    <div className="logo" />
                    <Text className="logo-text">Mnemonics work!</Text>
                </Header>
                <Layout>
                    <Sider theme="light" width={200} className="navigation-sider">
                        <h3> Categories </h3>
                        <NavigationMenu />
                    </Sider>
                    <Layout>
                        <Content className="site-background layout-content">
                            <div className="site-background center-content">
                                <Space direction="vertical" size="large">
                                    <div>
                                        <Title>Mnemonics Work</Title>
                                        <Paragraph className="content-description">
                                            Mnemonics Work is a page Lorem ipsum dolor sit amet, consectetur adipiscing
                                            elit, elit, elit, elit, sed do eiusmod tempor incididunt ut labore et dolore
                                            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                            laboris laboris nisi ut aliquot ex ea commodo consequat. Duis aute irure
                                            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                            pariatur
                                        </Paragraph>
                                    </div>
                                    <div>
                                        <Title level={3}> Search on our mnemonics knowledge base</Title>
                                        <Search
                                            placeholder="Search by title or description"
                                            enterButton="Search"
                                            size="large"
                                            className="search-input"
                                            onSearch={this.goToSearchPage}
                                        />
                                    </div>
                                    <div>
                                        <Title level={3}> Or check all of our mnemonics </Title>
                                        <CardList />
                                    </div>
                                </Space>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                <Footer className="center-content">
                    <Space direction="vertical">
                        <div>Mnemonics work ©2021 Created by Mnemonics work</div>
                        <a href="#"> Terms of service </a>
                    </Space>
                </Footer>
            </Layout>
        );
    }
}
