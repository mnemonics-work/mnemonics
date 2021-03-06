import React, { Component } from "react";
import { Form, Input, Button, Select, Tag, Col, Layout, Row, Typography, Spin } from "antd";

import "./styles.scss";
import history from "../../history";
import AuthService from "../../services/auth.service";
import { CustomHeader } from "../Header";
import { MnemonicsCreateForm, MnemonicInterface, TagModelMapping } from "../MnemonicsCreateForm";
import { AuthenticatedAppApi } from "global/api";
import {
    ApiCategoriesListRequest,
    ApiExpressionsCreateRequest,
    Category,
    MnemonicType,
    Tag as TagModel,
    MnemonicCreateUpdate,
    Expression,
} from "global/generated-api";

const MnemonicsAppApi = AuthenticatedAppApi();
const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

interface ExpressionCreateStateInterface {
    title: string;
    description: string;
    categories: Category[];
    tags: TagModel[];
    selectedCategories: number[];
    selectedTags: number[];
    types: MnemonicType[];
    isLoaded: boolean;
}

interface CategoryModelMapping {
    id?: number;
    title: string;
}

export class ExpressionCreatePage extends Component<unknown> {
    state: ExpressionCreateStateInterface = {
        title: "",
        description: "",
        categories: [],
        types: [],
        selectedCategories: [],
        tags: [],
        selectedTags: [],
        isLoaded: false,
    };
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

    async componentDidMount(): Promise<void> {
        if (this.isLogged()) {
            const tags = await MnemonicsAppApi.apiTagsList();
            const types = await MnemonicsAppApi.apiMnemonicTypesList();
            const categoriesRequest: ApiCategoriesListRequest = {};
            const categories = await MnemonicsAppApi.apiCategoriesList(categoriesRequest);
            this.setState({ tags, types, categories, isLoaded: true });
        } else {
            history.push("/home");
        }
    }

    isLogged = (): boolean => {
        return Boolean(AuthService.getAuthToken());
    };

    getListIds(list: (Category | MnemonicType | undefined)[]): number[] {
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
        const { categories } = this.state;
        const selectedCategories = data.map((title) => categories.find((category) => category.title == title));
        this.setState({
            selectedCategories: this.getListIds(selectedCategories),
        });
    }

    handleInputChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void => {
        const {
            target: { value, name },
        } = event;

        this.setState({ [name]: value });
    };

    handleSubmit = (): void => {
        const { title, description, selectedCategories, selectedTags } = this.state;
        const mnemonics: MnemonicCreateUpdate[] = [];
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
            mnemonics.push(mnemonicData);
        }
        const requestData = {
            title,
            description,
            categories: selectedCategories,
            tags: selectedTags,
            mnemonics,
        };
        const request: ApiExpressionsCreateRequest = { data: requestData };
        MnemonicsAppApi.apiExpressionsCreate(request).then(
            (result: Expression) => {
                history.push("/expression/" + result.id);
            },
            (error: unknown) => {
                console.error(error);
                alert("Expression was not created, check form data.");
            },
        );
    };

    render(): JSX.Element {
        const { selectedTags, categories, title, description, tags, types, isLoaded } = this.state;

        return (
            <Layout className="layout">
                <CustomHeader />
                <Content className="expression-content">
                    {isLoaded ? (
                        <Form onFinish={this.handleSubmit}>
                            <Row>
                                <Col span={12} offset={6}>
                                    <Typography>
                                        <div className="expression-create-content">
                                            <Title level={3}>New Expression</Title>
                                            <div className="site-background center-content expression-inputs">
                                                <Form.Item name="title">
                                                    <Input
                                                        placeholder="Expression Title"
                                                        name="title"
                                                        value={title}
                                                        onChange={this.handleInputChange}
                                                        required
                                                    />
                                                </Form.Item>
                                                <Form.Item name="description">
                                                    <TextArea
                                                        placeholder="Expression Description"
                                                        name="description"
                                                        value={description}
                                                        allowClear
                                                        rows={4}
                                                        onChange={this.handleInputChange}
                                                        required
                                                    />
                                                </Form.Item>
                                                <Form.Item>
                                                    <Select
                                                        mode="multiple"
                                                        allowClear
                                                        placeholder="Select expression categories"
                                                        onChange={(data) => this.handleSelectChange(data as string[])}
                                                    >
                                                        {categories.map(({ title, id }: CategoryModelMapping) => (
                                                            <Option key={id} value={title}>
                                                                {title}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item label="Choose tags">
                                                    {tags.map(({ label, id }: TagModelMapping) => (
                                                        <CheckableTag
                                                            key={id}
                                                            checked={selectedTags.indexOf(id as number) > -1}
                                                            onChange={(checked) =>
                                                                this.handleTagChange(id as number, checked)
                                                            }
                                                        >
                                                            {label}
                                                        </CheckableTag>
                                                    ))}
                                                </Form.Item>
                                            </div>
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
                            <Button type="primary" className="create-expression-button" htmlType="submit">
                                Create Expression
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
