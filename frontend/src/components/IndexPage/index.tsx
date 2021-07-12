import React, { Component } from "react";
import { Layout, Typography } from "antd";
import { Input, Space } from "antd";

import { CardList } from "../CardList";
import history from "../../history";
import "./styles.scss";
import { NavigationMenu } from "../NavigationMenu";
import { CustomHeader } from "../Header";
import { CustomFooter } from "../Footer";

const { Title, Paragraph } = Typography;
const { Content, Sider } = Layout;
const { Search } = Input;

export class IndexPage extends Component<unknown> {
    goToSearchPage = (searchText: string): void => {
        history.push("/search/" + searchText);
    };

    render(): JSX.Element {
        return (
            <Layout>
                <CustomHeader />
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
                <CustomFooter />
            </Layout>
        );
    }
}
