import React, { Component, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Col, Layout, List, PageHeader, Pagination, Row, Spin, Typography, Button } from "antd";
import { Link } from "react-router-dom";

import "./styles.scss";
import history from "../../history";
import { CustomHeader } from "../Header";
import { MnemonicsCard } from "../MnemonicCard";
import { Labels, LabelType } from "../Labels";
import { AuthenticatedAppApi } from "global/api";
import {
    ApiExpressionsReadRequest,
    ApiExpressionsRelatedCategoriesRequest,
    ApiMnemonicsListRequest,
    Category,
    Expression,
    Mnemonic,
    ApiExpressionsIsAuthorRequest,
    IsAuthorExpression,
} from "global/generated-api";

const MnemonicsAppApi = AuthenticatedAppApi();
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
    expressionId = +this.props.match.params.expressionId;
    isAuthor: boolean | undefined = false;

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
        const requestParams: ApiExpressionsRelatedCategoriesRequest = { id: this.expressionId };
        return await MnemonicsAppApi.apiExpressionsRelatedCategories(requestParams);
    }

    onPageChange = async (page: number): Promise<void> => {
        if (this.state.expression?.mnemonics) {
            const mnemonics = await this.getRelatedMnemonics(page, Array.from(this.state.expression.mnemonics));
            this.setState({ mnemonics });
        }
    };

    async componentDidMount(): Promise<void> {
        const request: ApiExpressionsIsAuthorRequest = { id: this.expressionId };
        MnemonicsAppApi.apiExpressionsIsAuthor(request).then(
            async (result: IsAuthorExpression) => {
                this.isAuthor = result.isAuthor;
                const expression = await this.getExpressionDataFromApi(this.expressionId);
                const mnemonics = await this.getRelatedMnemonics(1, Array.from(expression.mnemonics));
                const categories = await this.getRelatedCategories();
                this.setState({ expression, mnemonics, categories, loaded: true });
            },
            (error: unknown) => {
                console.error(error);
                history.push("/home");
            },
        );
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

        return (
            <Layout className="layout">
                <CustomHeader />
                <Content className="expression-content">
                    {loaded && expression ? (
                        <Row>
                            <Col span={12} offset={6}>
                                <Typography>
                                    <PageHeader
                                        className="expression-header"
                                        title={expression.title}
                                        tags={<Labels labels={expression.tags} labelType={LabelType.mnemonicTag} />}
                                    />
                                    <div className="expression-content">
                                        <Title level={3}>Description</Title>
                                        <Paragraph>{expression.description}</Paragraph>
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
                                        {this.isAuthor && (
                                            <Fragment>
                                                <Link to={`/expression/${this.expressionId}/mnemonic/create`}>
                                                    <Button type="dashed" className="new-mnemonics-button">
                                                        + Add new mnemonics
                                                    </Button>
                                                </Link>
                                                <Link to={`/expression/${this.expressionId}/edit`}>
                                                    <Button type="primary" className="edit-expression-button">
                                                        Edit Expression
                                                    </Button>
                                                </Link>
                                            </Fragment>
                                        )}
                                    </div>
                                </Typography>
                            </Col>
                        </Row>
                    ) : (
                        <Row className="spin">
                            <Col span={6} offset={12}>
                                <Spin size="large" />
                            </Col>
                        </Row>
                    )}
                </Content>
            </Layout>
        );
    }
}
