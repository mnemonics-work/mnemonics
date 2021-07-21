import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Form, Input, Button, Select, Tag, Col, Layout, Row, Typography, Spin, Popconfirm } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";

import "./styles.scss";
import history from "../../history";
import { CustomHeader } from "../Header";
import { AuthenticatedAppApi } from "global/api";
import {
    ApiCategoriesListRequest,
    ApiExpressionsUpdateRequest,
    Category,
    Expression,
    MnemonicType,
    Tag as TagModel,
    ApiExpressionsReadRequest,
    ApiExpressionsIsAuthorRequest,
    IsAuthorExpression,
    ApiExpressionsDeleteRequest,
} from "global/generated-api";

const MnemonicsAppApi = AuthenticatedAppApi();
const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

interface RouteParams {
    expressionId: string;
}

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

interface TagModelMapping {
    id?: number;
    label: string;
}

export class ExpressionEditPage extends Component<RouteComponentProps<RouteParams>> {
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
    expressionId = +this.props.match.params.expressionId;
    isAuthor = false;
    title = "";

    async componentDidMount(): Promise<void> {
        const request: ApiExpressionsIsAuthorRequest = { id: this.expressionId };
        MnemonicsAppApi.apiExpressionsIsAuthor(request).then(
            async (result: IsAuthorExpression) => {
                this.isAuthor = result && result.isAuthor !== undefined ? result.isAuthor : false;
                const tagsList = await MnemonicsAppApi.apiTagsList();
                const mnemonicsTypesList = await MnemonicsAppApi.apiMnemonicTypesList();
                const categoriesRequest: ApiCategoriesListRequest = {};
                const categoriesList = await MnemonicsAppApi.apiCategoriesList(categoriesRequest);
                const expressionRequest: ApiExpressionsReadRequest = { id: this.expressionId };
                MnemonicsAppApi.apiExpressionsRead(expressionRequest).then(
                    (result: Expression) => {
                        this.setExpressionData(result, categoriesList, tagsList, mnemonicsTypesList);
                    },
                    (error: unknown) => {
                        console.error(error);
                        history.push("/home");
                    },
                );
            },
            (error: unknown) => {
                console.error(error);
                history.push("/home");
            },
        );
    }

    async setExpressionData(
        data: Expression,
        categoriesList: Category[],
        tagsList: TagModel[],
        mnemonicsTypesList: MnemonicType[],
    ): Promise<void> {
        const { title, description, categories, tags, mnemonics } = data;
        this.title = title;
        this.setState({
            title,
            description,
            mnemonics,
            categories: categoriesList,
            tags: tagsList,
            types: mnemonicsTypesList,
            selectedCategories: categories,
            selectedTags: tags,
            isLoaded: true,
        });
    }

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

    deleteExpression = (): void => {
        const request: ApiExpressionsDeleteRequest = { id: this.expressionId };
        MnemonicsAppApi.apiExpressionsDelete(request).then(
            () => {
                history.push("/home");
            },
            (error: unknown) => {
                console.error(error);
                alert("This expression could not been deleted.");
            },
        );
    };

    handleSubmit = (): void => {
        const { title, description, selectedCategories, selectedTags } = this.state;
        const requestData = {
            title,
            description,
            categories: selectedCategories,
            tags: selectedTags,
        };
        const request: ApiExpressionsUpdateRequest = { data: requestData, id: this.expressionId };
        MnemonicsAppApi.apiExpressionsUpdate(request).then(
            (result: Expression) => {
                history.push("/expression/" + result.id);
            },
            (error: unknown) => {
                console.error(error);
                alert("Expression was not updated, check form data.");
            },
        );
    };

    render(): JSX.Element {
        const { selectedTags, categories, title, description, tags, isLoaded, selectedCategories } = this.state;

        return (
            <Layout className="layout">
                <CustomHeader />
                <Content className="expression-content">
                    {isLoaded ? (
                        <Form
                            onFinish={this.handleSubmit}
                            initialValues={{
                                title,
                                description,
                                categories: categories
                                    .filter((category) => selectedCategories.indexOf(category.id as number) > -1)
                                    .map((category) => category.title),
                            }}
                        >
                            <Row>
                                <Col span={12} offset={6}>
                                    <Typography>
                                        <div className="expression-create-content">
                                            <Title level={3}>
                                                {this.title}
                                                <Popconfirm
                                                    title="Are you sure to delete this expression?"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    onConfirm={this.deleteExpression}
                                                >
                                                    <DeleteTwoTone
                                                        className="mnemonic-delete-button"
                                                        twoToneColor="#eb2f96"
                                                    />
                                                </Popconfirm>
                                            </Title>
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
                                                <Form.Item name="categories">
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
                            <Button type="primary" className="create-expression-button" htmlType="submit">
                                Save Expression
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
