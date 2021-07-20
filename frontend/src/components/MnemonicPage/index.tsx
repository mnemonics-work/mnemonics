import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Typography, List, PageHeader, Layout, Spin, Row, Col, Button } from "antd";

import "./styles.scss";
import history from "../../history";
import { Labels, LabelType } from "../Labels";
import { Link } from "react-router-dom";
import { CustomHeader } from "../Header";
import { AnalyticsApi, AuthenticatedAppApi } from "global/api";
import {
    Mnemonic,
    ApiMnemonicsReadRequest,
    Expression,
    ApiExpressionsReadRequest,
    Category,
    ApiExpressionsRelatedCategoriesRequest,
    Event,
    AnalyticsEventCreateRequest,
    EventEventTypeEnum,
    ApiMnemonicsIsAuthorRequest,
    IsAuthorMnemonic,
} from "global/generated-api";

const MnemonicsAppApi = AuthenticatedAppApi();
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

interface MnemonicInfo {
    mnemonicId: string;
    pagePath: string;
    pageFullPath: string;
}

export class MnemonicPage extends Component<RouteComponentProps<RouteParams>> {
    state: MnemonicPageState = {
        mnemonic: undefined,
        loaded: false,
        expression: undefined,
        categories: [],
    };
    mnemonicId = +this.props.match.params.mnemonicId;
    isAuthor = false;

    getMnemonicDataFromApi(mnemonicId: number): void {
        const requestParams: ApiMnemonicsReadRequest = { id: mnemonicId };
        MnemonicsAppApi.apiMnemonicsRead(requestParams)
            .then((data) => {
                this.setState({ mnemonic: data, loaded: true });
                if (this.state.mnemonic?.expression) {
                    this.getExpression(this.state.mnemonic.expression);
                }
            })
            .catch(() => this.setState({ mnemonic: undefined, loaded: true, expression: undefined }));
    }

    componentDidMount(): void {
        const request: ApiMnemonicsIsAuthorRequest = { id: this.mnemonicId };
        MnemonicsAppApi.apiMnemonicsIsAuthor(request).then(
            (result: IsAuthorMnemonic) => {
                this.isAuthor = result && result.isAuthor !== undefined ? result.isAuthor : false;
                this.logEvent();
                this.getMnemonicDataFromApi(this.mnemonicId);
            },
            (error: unknown) => {
                console.error(error);
                history.push("/home");
            },
        );
    }

    logEvent(): void {
        const eventData: MnemonicInfo = {
            mnemonicId: this.props.match.params.mnemonicId,
            pagePath: this.props.location.pathname,
            pageFullPath: window.location.href,
        };
        const requestEvent: Event = { eventType: EventEventTypeEnum.Mv, data: eventData, datetime: new Date() };
        const requestParams: AnalyticsEventCreateRequest = { data: requestEvent };
        AnalyticsApi.analyticsEventCreate(requestParams);
    }

    getRelatedCategories(expressionId: number): void {
        const requestParams: ApiExpressionsRelatedCategoriesRequest = { id: expressionId };
        MnemonicsAppApi.apiExpressionsRelatedCategories(requestParams).then((data) => {
            this.setState({ categories: data });
        });
    }

    getExpression(expressionId: number): void {
        const requestParams: ApiExpressionsReadRequest = { id: expressionId };
        MnemonicsAppApi.apiExpressionsRead(requestParams).then((data) => {
            this.setState({
                mnemonic: this.state.mnemonic,
                loaded: this.state.loaded,
                expression: data,
            });
            this.getRelatedCategories(expressionId);
        });
    }

    render(): JSX.Element {
        const { loaded, expression, categories, mnemonic } = this.state;
        const mnemonicData: Mnemonic | undefined = mnemonic;
        let mnemonicDataLinks: string[] = [];
        if (mnemonicData) {
            if (mnemonicData.links == null) {
                mnemonicData.links = [];
            }
            mnemonicDataLinks = mnemonicData.links.filter((link) => link != undefined);
        }
        const expressionTitle = expression?.title;
        const expressionUrl = "/expression/" + expression?.id;
        return (
            <Layout className="layout">
                <CustomHeader />
                {loaded && mnemonicData ? (
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
                                        <Paragraph>
                                            <a href={expressionUrl}>{expressionTitle}</a>
                                        </Paragraph>
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
                                                dataSource={categories}
                                                renderItem={(item) => <List.Item>{item.title}</List.Item>}
                                            />
                                        </Paragraph>
                                        {this.isAuthor && (
                                            <Link to={`/mnemonic/${this.mnemonicId}/edit`}>
                                                <Button type="primary" className="edit-mnemonic-button">
                                                    Edit Mnemonic
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </Typography>
                            </Col>
                        </Row>
                    </Content>
                ) : (
                    <Row className="spin">
                        <Col span={6} offset={12}>
                            <Spin size="large" />
                        </Col>
                    </Row>
                )}
            </Layout>
        );
    }
}
