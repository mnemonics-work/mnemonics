import React, { Component } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Form, Input, Button, Select, Tag, Col, Layout, Row, Typography } from "antd";

import "./styles.scss";
import history from "../../history";
import { CustomHeader } from "../Header";
import { MnemonicsAppApi, AuthenticatedAppApi } from "global/api";
import {
    ApiCategoriesListRequest,
    ApiExpressionsCreateRequest,
    Category,
    MnemonicType,
    Tag as TagModel,
    MnemonicCreate,
    ExpressionCreate,
} from "global/generated-api";

const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

interface MnemonicInterface {
    title: string;
    description: string;
    selectedTags: number[];
    selectedTypes: number[];
    sourceUrl: string;
    links: string;
    key: number;
}

interface ExpressionCreateStateInterface {
    title: string;
    description: string;
    categories: Category[];
    tags: TagModel[];
    selectedCategories: number[];
    selectedTags: number[];
    mnemonics: MnemonicInterface[];
    types: MnemonicType[];
}

interface CategoryModelMapping {
    id?: number;
    title: string;
}

interface TagModelMapping {
    id?: number;
    label: string;
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
        mnemonics: [
            {
                title: "",
                description: "",
                selectedTags: [],
                selectedTypes: [],
                sourceUrl: "",
                links: "",
                key: 0,
            },
        ],
    };
    keyCount = 0;

    componentDidMount(): void {
        const categoriesRequest: ApiCategoriesListRequest = {};
        MnemonicsAppApi.apiCategoriesList(categoriesRequest).then((results: Category[]) => {
            this.setState({ categories: results });
        });
        MnemonicsAppApi.apiTagsList().then((results: TagModel[]) => {
            this.setState({ tags: results });
        });
        MnemonicsAppApi.apiMnemonicTypesList().then((results: MnemonicType[]) => {
            this.setState({ types: results });
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

    handleMnemonicInputChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
        listIndex: number,
    ): void => {
        const {
            target: { value, name },
        } = event;
        const mnemonics = [...this.state.mnemonics];
        const mnemonic = { ...mnemonics[listIndex] };
        const nextMnemonic = Object.assign(mnemonic, { [name]: value });
        mnemonics[listIndex] = nextMnemonic;
        this.setState({ mnemonics });
    };

    handleMnemonicTagChange = (tagId: number, checked: boolean, listIndex: number): void => {
        const mnemonics = [...this.state.mnemonics];
        const mnemonic = { ...mnemonics[listIndex] };
        const nextSelectedTags = checked
            ? [...mnemonic.selectedTags, tagId]
            : mnemonic.selectedTags.filter((tag) => tag !== tagId);
        mnemonic.selectedTags = nextSelectedTags;
        mnemonics[listIndex] = mnemonic;
        this.setState({ mnemonics });
    };

    handleMnemonicTypeChange = (data: string[], listIndex: number): void => {
        const { types } = this.state;
        const selectedTypes = data.map((label) => types.find((type) => type.label == label));
        const mnemonics = [...this.state.mnemonics];
        const mnemonic = { ...mnemonics[listIndex] };
        mnemonic.selectedTypes = this.getListIds(selectedTypes);
        mnemonics[listIndex] = mnemonic;
        this.setState({ mnemonics });
    };

    handleSubmit = (): void => {
        const { title, description, selectedCategories, selectedTags, mnemonics } = this.state;
        const mnemonicsData: MnemonicCreate[] = [];
        for (const mnemonic of mnemonics) {
            const mnemonicData: MnemonicCreate = {
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
            title,
            description,
            categories: selectedCategories,
            tags: selectedTags,
            mnemonics: mnemonicsData,
        };
        const request: ApiExpressionsCreateRequest = { data: requestData };
        AuthenticatedAppApi()
            .apiExpressionsCreate(request)
            .then(
                (result: ExpressionCreate) => {
                    history.push("/expression/" + result.id);
                },
                (error: unknown) => {
                    console.error(error);
                    alert("Expression was not created, check form data.");
                },
            );
    };

    handleAddMnemonic = (): void => {
        this.setState((prevState: ExpressionCreateStateInterface) => ({
            mnemonics: [
                ...prevState.mnemonics,
                {
                    title: "",
                    description: "",
                    selectedTags: [],
                    selectedTypes: [],
                    sourceUrl: "",
                    links: "",
                    key: ++this.keyCount,
                },
            ],
        }));
    };

    handleRemoveMnemonic = (listIndex: number): void => {
        const mnemonics = [...this.state.mnemonics];
        mnemonics.splice(listIndex, 1);
        this.setState({ mnemonics });
    };

    createMnemonicInputs = (): JSX.Element[] => {
        const { types, tags, mnemonics } = this.state;
        return mnemonics.map((mnemonic: MnemonicInterface, listIndex) => (
            <Row key={mnemonic.key}>
                <Col span={12} offset={6}>
                    <Typography>
                        <div className="mnemonic-create-content">
                            <Title level={5}>
                                Mnemonic # {listIndex + 1}
                                {mnemonics.length > 1 && (
                                    <DeleteTwoTone
                                        className="mnemonic-delete-button"
                                        twoToneColor="#eb2f96"
                                        onClick={() => {
                                            this.handleRemoveMnemonic(listIndex);
                                        }}
                                    />
                                )}
                            </Title>
                            <div className="site-background center-content">
                                <Form.Item name={`mnemonic-title-${mnemonic.key}`}>
                                    <Input
                                        placeholder="Mnemonic Title"
                                        name="title"
                                        value={mnemonic.title}
                                        onChange={(event) => this.handleMnemonicInputChange(event, listIndex)}
                                        required
                                    />
                                </Form.Item>
                                <Form.Item name={`mnemonic-sourceUrl-${mnemonic.key}`}>
                                    <Input
                                        placeholder="Mnemonic Source URL"
                                        name="sourceUrl"
                                        value={mnemonic.sourceUrl}
                                        allowClear
                                        onChange={(event) => this.handleMnemonicInputChange(event, listIndex)}
                                    />
                                </Form.Item>
                                <Form.Item name={`mnemonic-description-${mnemonic.key}`}>
                                    <TextArea
                                        placeholder="Mnemonic Description"
                                        name="description"
                                        value={mnemonic.description}
                                        allowClear
                                        rows={4}
                                        onChange={(event) => this.handleMnemonicInputChange(event, listIndex)}
                                        required
                                    />
                                </Form.Item>
                                <Form.Item name={`mnemonic-links-${mnemonic.key}`}>
                                    <TextArea
                                        placeholder="Enter Mnemonic links split by comma"
                                        name="links"
                                        value={mnemonic.links}
                                        allowClear
                                        rows={4}
                                        onChange={(event) => this.handleMnemonicInputChange(event, listIndex)}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: "100%" }}
                                        placeholder="Select Mnemonic Types"
                                        onChange={(data) => this.handleMnemonicTypeChange(data as string[], listIndex)}
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
                                            checked={mnemonic.selectedTags.indexOf(id as number) > -1}
                                            onChange={(checked) => {
                                                this.handleMnemonicTagChange(id as number, checked, listIndex);
                                            }}
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
        ));
    };

    render(): JSX.Element {
        const { selectedTags, categories, title, description, tags } = this.state;

        return (
            <Layout className="layout">
                <CustomHeader />
                <Content className="expression-content">
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
                                                    style={{ width: "100%" }}
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
                        {this.createMnemonicInputs()}
                        <Button type="dashed" className="add-mnemonic-button" onClick={this.handleAddMnemonic}>
                            + Add new mnemonic
                        </Button>
                        <Button type="primary" className="create-expression-button" htmlType="submit">
                            Create Expression
                        </Button>
                    </Form>
                </Content>
            </Layout>
        );
    }
}
