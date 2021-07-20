import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Form, Button, Col, Layout, Row, Typography, Spin } from "antd";

import "./styles.scss";
import history from "../../history";
import { CustomHeader } from "../Header";
import { AuthenticatedAppApi } from "global/api";
import { MnemonicsCreateForm, MnemonicInterface } from "../MnemonicsCreateForm";
import {
    Expression,
    ApiExpressionsReadRequest,
    ApiExpressionsAddRelatedMnemonicsRequest,
    MnemonicCreateUpdate,
    ApiExpressionsIsAuthorRequest,
    IsAuthorExpression,
} from "global/generated-api";

const MnemonicsAppApi = AuthenticatedAppApi();
const { Title } = Typography;
const { Content } = Layout;

interface RouteParams {
    expressionId: string;
}

export class MnemonicsCreatePage extends Component<RouteComponentProps<RouteParams>> {
    mnemonics: MnemonicInterface[] = [
        {
            title: "",
            description: "",
            selectedTags: [],
            selectedTypes: [],
            sourceUrl: "",
            links: "",
            key: 0,
        },
    ];
    state = {
        title: "",
        isLoaded: false,
        tags: [],
        types: [],
    };
    expressionId = +this.props.match.params.expressionId;

    async componentDidMount(): Promise<void> {
        const request: ApiExpressionsIsAuthorRequest = { id: this.expressionId };
        MnemonicsAppApi.apiExpressionsIsAuthor(request).then(
            async (result: IsAuthorExpression) => {
                if (result.isAuthor) {
                    const tags = await MnemonicsAppApi.apiTagsList();
                    const types = await MnemonicsAppApi.apiMnemonicTypesList();
                    const expressionRequest: ApiExpressionsReadRequest = { id: this.expressionId };
                    const expression = await MnemonicsAppApi.apiExpressionsRead(expressionRequest);
                    this.setState({ tags, types, title: expression.title, isLoaded: true });
                } else {
                    history.push("/home");
                }
            },
            (error: unknown) => {
                console.error(error);
                history.push("/home");
            },
        );
    }

    handleSubmit = (): void => {
        const mnemonicsData: MnemonicCreateUpdate[] = [];
        for (const mnemonic of this.mnemonics) {
            const mnemonicData: MnemonicCreateUpdate = {
                types: mnemonic.selectedTypes,
                title: mnemonic.title,
                description: mnemonic.description,
                sourceUrl: mnemonic.sourceUrl,
                links: mnemonic.links
                    .split(",")
                    .map((link) => link.trim())
                    .filter((link) => Boolean(link)),
                tags: mnemonic.selectedTags,
            };
            mnemonicsData.push(mnemonicData);
        }
        const requestData = {
            mnemonics: mnemonicsData,
        };
        const request: ApiExpressionsAddRelatedMnemonicsRequest = {
            data: requestData,
            id: this.expressionId,
        };
        MnemonicsAppApi.apiExpressionsAddRelatedMnemonics(request).then(
            (result: Expression) => {
                history.push("/expression/" + result.id);
            },
            (error: unknown) => {
                console.error(error);
                alert("Mnemonics were not created, check form data.");
            },
        );
    };

    render(): JSX.Element {
        const { title, isLoaded, types, tags } = this.state;
        return (
            <Layout className="layout">
                <CustomHeader />
                <Content className="expression-content">
                    {isLoaded ? (
                        <Form onFinish={this.handleSubmit}>
                            <Row>
                                <Col span={12} offset={6}>
                                    <Typography>
                                        <div className="add-new-mnemonics-title">
                                            <Title level={3}>{title}</Title>
                                            <Title level={5}>Add new mnemonics to expression</Title>
                                        </div>
                                    </Typography>
                                </Col>
                            </Row>
                            <MnemonicsCreateForm
                                onChange={(mnemonics: MnemonicInterface[]) => (this.mnemonics = mnemonics)}
                                mnemonics={this.mnemonics}
                                tags={tags}
                                types={types}
                            />
                            <Button type="primary" className="create-mnemonics-button" htmlType="submit">
                                Create Mnemonics
                            </Button>
                        </Form>
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
