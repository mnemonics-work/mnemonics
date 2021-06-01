import React, { Component } from "react";
import { Col, Layout, List, PageHeader, Row, Typography } from "antd";

import { ApiCategoriesReadRequest, Expression, Category } from "global/generated-api";
import { MnemonicsAppApi } from "global/api";
import { RouteComponentProps } from "react-router-dom";

import "./styles.scss";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface CategoryState {
    expressions: Expression[];
    category: Category | undefined;
}

interface RouteParams {
    categoryId: string;
}

export class CategoryPage extends Component<RouteComponentProps<RouteParams>> {
    state: CategoryState = {
        expressions: [],
        category: undefined,
    };

    async getRelatedExpressions(categoryId: number): Promise<void> {
        const requestParams: ApiCategoriesReadRequest = { id: categoryId };
        const expressions: Expression[] = await MnemonicsAppApi.apiCategoriesRelatedExpressions(requestParams);
        this.setState({ expressions });
    }

    async getCategory(categoryId: number): Promise<void> {
        const requestParams: ApiCategoriesReadRequest = { id: categoryId };
        const category: Category = await MnemonicsAppApi.apiCategoriesRead(requestParams);
        this.setState({ category });
    }

    componentDidMount(): void {
        const categoryId: number = +this.props.match.params.categoryId;
        this.getRelatedExpressions(categoryId);
        this.getCategory(categoryId);
    }

    buildExpressionLink(expressionId: number | undefined): string {
        if (expressionId) {
            return "/expression/" + expressionId;
        }
        return "#"; // default returns to the same page
    }

    renderExpressions(expressions: Expression[]): JSX.Element {
        return (
            <List
                dataSource={expressions}
                size="large"
                renderItem={(item) => (
                    <List.Item>
                        <a href={this.buildExpressionLink(item.id)}>{item.title}</a>
                    </List.Item>
                )}
            />
        );
    }

    render(): JSX.Element {
        const { expressions, category } = this.state;
        return (
            <Layout className="layout">
                <Content className="category-content">
                    <Row>
                        <Col span={12} offset={6}>
                            <Typography>
                                <PageHeader className="category-header" title={category?.title} />
                                <div className="category-content">
                                    <Title level={3}>Expressions</Title>
                                    <Paragraph>{this.renderExpressions(expressions)}</Paragraph>
                                </div>
                            </Typography>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
