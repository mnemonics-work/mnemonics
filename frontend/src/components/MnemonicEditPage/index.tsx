import React, { Component } from "react";
import { Form, Input, Button, Select, Tag, Col, Row, Typography, Layout, Spin, Popconfirm } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { RouteComponentProps } from "react-router-dom";

import "./styles.scss";
import history from "../../history";
import { CustomHeader } from "../Header";
import { TagModelMapping } from "../MnemonicsCreateForm";
import { AuthenticatedAppApi } from "global/api";
import {
    Mnemonic,
    ApiMnemonicsReadRequest,
    ApiMnemonicsUpdateRequest,
    MnemonicType,
    Tag as TagModel,
    ApiMnemonicsIsAuthorRequest,
    IsAuthorMnemonic,
    ApiMnemonicsDeleteRequest,
} from "global/generated-api";

const MnemonicsAppApi = AuthenticatedAppApi();
const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { CheckableTag } = Tag;
const { Option } = Select;

interface MnemonicEditPageState {
    title: string;
    description: string;
    selectedTags: number[];
    selectedTypes: number[];
    sourceUrl: string;
    links: string;
    tags: TagModel[];
    types: MnemonicType[];
    isLoaded: boolean;
}

interface RouteParams {
    mnemonicId: string;
}

export class MnemonicEditPage extends Component<RouteComponentProps<RouteParams>> {
    state: MnemonicEditPageState = {
        title: "",
        description: "",
        selectedTags: [],
        selectedTypes: [],
        sourceUrl: "",
        links: "",
        tags: [],
        types: [],
        isLoaded: false,
    };
    mnemonicId = +this.props.match.params.mnemonicId;
    title = "";

    async componentDidMount(): Promise<void> {
        const request: ApiMnemonicsIsAuthorRequest = { id: this.mnemonicId };
        MnemonicsAppApi.apiMnemonicsIsAuthor(request).then(
            async (result: IsAuthorMnemonic) => {
                if (result.isAuthor) {
                    const tags = await MnemonicsAppApi.apiTagsList();
                    const types = await MnemonicsAppApi.apiMnemonicTypesList();
                    const mnemonicRequest: ApiMnemonicsReadRequest = { id: this.mnemonicId };
                    const mnemonic: Mnemonic = await MnemonicsAppApi.apiMnemonicsRead(mnemonicRequest);
                    this.title = mnemonic.title;
                    this.setState({
                        tags,
                        types,
                        title: mnemonic.title,
                        description: mnemonic.description,
                        sourceUrl: mnemonic.sourceUrl,
                        selectedTags: mnemonic.tags,
                        selectedTypes: mnemonic.types,
                        links: mnemonic.links ? mnemonic.links.join(", ") : "",
                        isLoaded: true,
                    });
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

    getListIds(list: (MnemonicType | undefined)[]): number[] {
        const ids = [];
        for (const element of list) {
            if (element && element.id !== undefined) {
                ids.push(element.id);
            }
        }
        return ids;
    }

    handleTagChange(tagId: number, checked: boolean): void {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked ? [...selectedTags, tagId] : selectedTags.filter((t) => t !== tagId);
        this.setState({ selectedTags: nextSelectedTags });
    }

    handleSelectChange(data: string[]): void {
        const { types } = this.state;
        const selectedTypes = data.map((label) => types.find((type) => type.label == label));
        this.setState({
            selectedTypes: this.getListIds(selectedTypes),
        });
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
        const {
            target: { value, name },
        } = event;

        this.setState({ [name]: value });
    };

    deleteMnemonic = (): void => {
        const request: ApiMnemonicsDeleteRequest = { id: this.mnemonicId };
        MnemonicsAppApi.apiMnemonicsDelete(request).then(
            () => {
                history.push("/home");
            },
            (error: unknown) => {
                console.error(error);
                alert("This mnemonic could not been deleted.");
            },
        );
    };

    handleSubmit = (): void => {
        const { title, description, selectedTypes, selectedTags, links, sourceUrl } = this.state;
        const requestData = {
            title,
            description,
            links: links
                .split(",")
                .map((link: string) => link.trim())
                .filter((link: string) => Boolean(link)),
            sourceUrl,
            types: selectedTypes,
            tags: selectedTags,
        };
        const request: ApiMnemonicsUpdateRequest = { data: requestData, id: this.mnemonicId };
        MnemonicsAppApi.apiMnemonicsUpdate(request).then(
            (result: Mnemonic) => {
                history.push("/mnemonic/" + result.id);
            },
            (error: unknown) => {
                console.error(error);
                alert("Mnemonic was not updated, check form data.");
            },
        );
    };

    render(): JSX.Element {
        const { title, sourceUrl, description, links, tags, types, selectedTags, selectedTypes, isLoaded } = this.state;
        return (
            <Layout className="layout">
                <CustomHeader />
                <Content className="expression-content">
                    <Row>
                        <Col span={12} offset={6}>
                            <Typography>
                                {isLoaded ? (
                                    <Form
                                        initialValues={{
                                            title,
                                            sourceUrl,
                                            description,
                                            links,
                                            types: types
                                                .filter((type) => selectedTypes.indexOf(type.id as number) > -1)
                                                .map((type) => type.label),
                                        }}
                                        onFinish={this.handleSubmit}
                                    >
                                        <div className="mnemonic-create-content">
                                            <Title level={3}>
                                                {this.title}
                                                <Popconfirm
                                                    title="Are you sure to delete this expression?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={this.deleteMnemonic}
                                                >
                                                    <DeleteTwoTone
                                                        className="mnemonic-delete-button"
                                                        twoToneColor="#eb2f96"
                                                    />
                                                </Popconfirm>
                                            </Title>
                                            <div className="site-background center-content">
                                                <Form.Item name="title">
                                                    <Input
                                                        placeholder="Mnemonic Title"
                                                        name="title"
                                                        value={title}
                                                        onChange={(event) => this.handleInputChange(event)}
                                                        required
                                                    />
                                                </Form.Item>
                                                <Form.Item name="sourceUrl">
                                                    <Input
                                                        placeholder="Mnemonic Source URL"
                                                        name="sourceUrl"
                                                        value={sourceUrl}
                                                        allowClear
                                                        onChange={(event) => this.handleInputChange(event)}
                                                    />
                                                </Form.Item>
                                                <Form.Item name="description">
                                                    <TextArea
                                                        placeholder="Mnemonic Description"
                                                        name="description"
                                                        value={description}
                                                        allowClear
                                                        rows={4}
                                                        onChange={(event) => this.handleInputChange(event)}
                                                        required
                                                    />
                                                </Form.Item>
                                                <Form.Item name="links">
                                                    <TextArea
                                                        placeholder="Enter Mnemonic links split by comma"
                                                        name="links"
                                                        value={links}
                                                        allowClear
                                                        rows={4}
                                                        onChange={(event) => this.handleInputChange(event)}
                                                    />
                                                </Form.Item>
                                                <Form.Item name="types">
                                                    <Select
                                                        mode="multiple"
                                                        allowClear
                                                        placeholder="Select Mnemonic Types"
                                                        onChange={(data) => this.handleSelectChange(data as string[])}
                                                    >
                                                        {types.map(({ label, id }: MnemonicType) => {
                                                            return (
                                                                <Option key={id} value={label}>
                                                                    {label}
                                                                </Option>
                                                            );
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="Choose tags">
                                                    {tags.map(({ label, id }: TagModelMapping) => (
                                                        <CheckableTag
                                                            key={id}
                                                            checked={selectedTags.indexOf(id as number) > -1}
                                                            onChange={(checked) => {
                                                                this.handleTagChange(id as number, checked);
                                                            }}
                                                        >
                                                            {label}
                                                        </CheckableTag>
                                                    ))}
                                                </Form.Item>
                                            </div>
                                            <Button type="primary" className="save-mnemonic-button" htmlType="submit">
                                                Save Mnemonic
                                            </Button>
                                        </div>
                                    </Form>
                                ) : (
                                    <Row className="spin">
                                        <Col span={6} offset={12}>
                                            <Spin size="large" />
                                        </Col>
                                    </Row>
                                )}
                            </Typography>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}
