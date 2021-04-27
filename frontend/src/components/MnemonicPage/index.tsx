import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Labels } from "../Labels";
import { Typography, List, PageHeader, Layout, Spin, Row, Col } from "antd";
import { ExpressionsApi, MnemonicsApi, CategoriesApi } from "global/api";
import { Mnemonic, MnemonicsReadRequest, Expression, ExpressionsReadRequest, Category } from "global/generated-api";
import { LabelType } from "../Labels";
import "./styles.scss";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

interface MnemonicPageState {
    mnemonic: Mnemonic | undefined;
    loaded: boolean;
    expression: Expression | undefined;
    categories: Category[];
}

interface RouteParams {
    mnemonicId: string;
}

export class MnemonicPage extends Component<RouteComponentProps<RouteParams>> {
    state: MnemonicPageState = {
        mnemonic: undefined,
        loaded: false,
        expression: undefined,
        categories: [],
    };

    getMnemonicDataFromApi(mnemonicId: number): void {
        const requestParams: MnemonicsReadRequest = { id: mnemonicId };
        MnemonicsApi.mnemonicsRead(requestParams)
            .then((data) => {
                this.setState({ mnemonic: data, loaded: true });
                if (this.state.mnemonic?.expression) {
                    this.getExpression(this.state.mnemonic.expression);
                }
            })
            .catch(() => this.setState({ mnemonic: undefined, loaded: true, expression: undefined }));
    }

    componentDidMount(): void {
        this.getMnemonicDataFromApi(+this.props.match.params.mnemonicId);
    }

    getRelatedCategories(categoriesId: number[]): void {
        // TODO filter by categories Ids(list)
        CategoriesApi.categoriesList().then((data) => {
            const categories = data.filter((category) => {
                if (category && category.id) {
                    return categoriesId.includes(category.id);
                }
            });
            this.setState({ categories });
        });
    }

    getExpression(expressionId: number): void {
        const requestParams: ExpressionsReadRequest = { id: expressionId };
        ExpressionsApi.expressionsRead(requestParams).then((data) => {
            const categories = Array.from(data.categories);
            this.setState({
                mnemonic: this.state.mnemonic,
                loaded: this.state.loaded,
                expression: data,
            });
            this.getRelatedCategories(categories);
        });
    }

    render(): JSX.Element {
        const mnemonicData: Mnemonic | undefined = this.state.mnemonic;
        if (!this.state.loaded) {
            // Load "Loading" spinner
            return (
                <Row>
                    <Col span={6} offset={12}>
                        <Spin size="large" />
                    </Col>
                </Row>
            );
        }
        if (mnemonicData == undefined) {
            // Load Not found page
            // TODO: define a 404 page
            return <div> Not found </div>;
        }
        if (mnemonicData.links == null) {
            mnemonicData.links = [];
        }
        let mnemonicDataLinks: string[] = [];
        mnemonicDataLinks = mnemonicData.links.filter((link) => link != undefined);
        const expressionTitle = this.state.expression?.title;
        return (
            <Layout className="layout">
                <Content className="mnemonic-content">
                    <Row>
                        <Col span={12} offset={6}>
                            <Typography>
                                <PageHeader
                                    className="mnemonic-header"
                                    title={mnemonicData.title}
                                    tags={<Labels labels={mnemonicData.tags} labelType={LabelType.mnemonicTag} />}
                                />
                                <div className="mnemonic-content">
                                    <Title level={3}>Description</Title>
                                    <Paragraph>{mnemonicData.description}</Paragraph>
                                    <Title level={3}>Expression</Title>
                                    <Paragraph>{expressionTitle}</Paragraph>
                                    <Title level={3}>Source</Title>
                                    <Paragraph>
                                        <a>{mnemonicData.sourceUrl}</a>
                                    </Paragraph>
                                    <Title level={3}>Links</Title>
                                    <Paragraph>
                                        <List
                                            size="small"
                                            dataSource={mnemonicDataLinks}
                                            renderItem={(item) => (
                                                <List.Item>
                                                    <a>{item}</a>
                                                </List.Item>
                                            )}
                                        />
                                    </Paragraph>
                                    <Title level={3}>Types</Title>
                                    <Paragraph>
                                        <Labels labels={mnemonicData.types} labelType={LabelType.mnemonicType} />
                                    </Paragraph>
                                    <Title level={3}> Categories </Title>
                                    <Paragraph>
                                        <List
                                            size="small"
                                            dataSource={this.state.categories}
                                            renderItem={(item) => <List.Item>{item.title}</List.Item>}
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
