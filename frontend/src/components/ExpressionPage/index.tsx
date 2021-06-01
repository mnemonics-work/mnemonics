import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Col, Layout, List, PageHeader, Pagination, Row, Spin, Typography } from "antd";

import { MnemonicsAppApi } from "global/api";
import {
    ApiExpressionsReadRequest,
    ApiExpressionsRelatedCategoriesRequest,
    ApiMnemonicsListRequest,
    Category,
    Expression,
    Mnemonic,
} from "global/generated-api";

import { MnemonicsCard } from "../MnemonicCard";
import { Labels, LabelType } from "../Labels";
import "./styles.scss";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface MnemonicPageState {
    expression: Expression | undefined;
    loaded: boolean;
    mnemonics: Mnemonic[];
    categories: Category[];
    current: number;
}

interface RouteParams {
    expressionId: string;
}

export class ExpressionPage extends Component<RouteComponentProps<RouteParams>> {
    PAGE_SIZE = 4;
    total_cards = 1;
    state: MnemonicPageState = {
        expression: undefined,
        loaded: false,
        mnemonics: [],
        categories: [],
        current: 1,
    };

    async getExpressionDataFromApi(expressionId: number): Promise<Expression> {
        const requestParams: ApiExpressionsReadRequest = { id: expressionId };
        return await MnemonicsAppApi.apiExpressionsRead(requestParams);
    }

    getOffset(currentPage: number): number {
        return (currentPage - 1) * this.PAGE_SIZE;
    }

    async getRelatedMnemonics(page: number, mnemonicsIds: number[]): Promise<Mnemonic[]> {
        // Get Paginated List of Mnemonics
        const requestParams: ApiMnemonicsListRequest = {
            limit: this.PAGE_SIZE,
            offset: this.getOffset(page),
            ids: mnemonicsIds,
        };
        const data = await MnemonicsAppApi.apiMnemonicsList(requestParams);
        this.total_cards = data.count;
        this.setState({ current: page });
        return data.results;
    }

    async getRelatedCategories(): Promise<Category[]> {
        const requestParams: ApiExpressionsRelatedCategoriesRequest = { id: +this.props.match.params.expressionId };
        return await MnemonicsAppApi.apiExpressionsRelatedCategories(requestParams);
    }

    onPageChange = async (page: number): Promise<void> => {
        if (this.state.expression?.mnemonics) {
            const mnemonics = await this.getRelatedMnemonics(page, Array.from(this.state.expression.mnemonics));
            this.setState({ mnemonics });
        }
    };

    async componentDidMount(): Promise<void> {
        // Get data from expressions
        const expression = await this.getExpressionDataFromApi(+this.props.match.params.expressionId);
        // From mnemonic ids get mnemonics
        const mnemonics = await this.getRelatedMnemonics(1, Array.from(expression.mnemonics));
        // From categories ids get categories
        const categories = await this.getRelatedCategories();
        this.setState({ expression, mnemonics, categories, loaded: true });
    }

    renderSkeleton(): JSX.Element[] {
        const numOfEmptyCards = 4;
        return Array(numOfEmptyCards)
            .fill(null)
            .map((_, idx) => <MnemonicsCard key={idx} mnemnonicContent={null} />);
    }

    renderMnemonicCards(mnemonics: Mnemonic[]): JSX.Element[] {
        return mnemonics.map((mnemonic) => <MnemonicsCard key={mnemonic.id} mnemnonicContent={mnemonic} />);
    }

    render(): JSX.Element {
        const { expression, loaded, categories, current, mnemonics } = this.state;
        const expressionData: Expression | undefined = expression;
        if (!loaded) {
            // Load "Loading" spinner
            return (
                <Row>
                    <Col span={6} offset={12}>
                        <Spin size="large" />
                    </Col>
                </Row>
            );
        }
        if (expressionData == undefined) {
            // Load Not found page
            // TODO: define a 404 page
            return <div> Not found </div>;
        }

        return (
            <Layout className="layout">
                <Content className="expression-content">
                    <Row>
                        <Col span={12} offset={6}>
                            <Typography>
                                <PageHeader
                                    className="expression-header"
                                    title={expressionData.title}
                                    tags={<Labels labels={expressionData.tags} labelType={LabelType.mnemonicTag} />}
                                />
                                <div className="expression-content">
                                    <Title level={3}>Description</Title>
                                    <Paragraph>{expressionData.description}</Paragraph>
                                    <Title level={3}> Categories </Title>
                                    <Paragraph>
                                        <List
                                            size="small"
                                            dataSource={categories}
                                            renderItem={(item) => <List.Item>{item.title}</List.Item>}
                                        />
                                    </Paragraph>
                                    <Title level={3}> Mnemonics </Title>
                                    <Paragraph>
                                        <div className="card-list">
                                            {loaded ? this.renderMnemonicCards(mnemonics) : this.renderSkeleton()}
                                        </div>
                                        <Pagination
                                            className="pagination"
                                            defaultCurrent={1}
                                            total={this.total_cards}
                                            current={current}
                                            pageSize={this.PAGE_SIZE}
                                            onChange={this.onPageChange}
                                        />
                                    </Paragraph>
                                </div>
                            </Typography>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
