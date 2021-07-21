import React, { Component, Fragment } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { Form, Input, Button, Select, Tag, Col, Row, Typography } from "antd";

import "./styles.scss";
import { Category, MnemonicType, Tag as TagModel } from "global/generated-api";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { CheckableTag } = Tag;

export interface MnemonicInterface {
    title: string;
    description: string;
    selectedTags: number[];
    selectedTypes: number[];
    sourceUrl: string;
    links: string;
    key: number;
}

export interface MnemonicsCreateStateInterface {
    tags: TagModel[];
    mnemonics: MnemonicInterface[];
    types: MnemonicType[];
}

export interface MnemonicsCreatePropsInterface {
    tags: TagModel[];
    mnemonics: MnemonicInterface[];
    types: MnemonicType[];
    onChange: (mnemonics: MnemonicInterface[]) => void;
}

export interface TagModelMapping {
    id?: number;
    label: string;
}

export class MnemonicsCreateForm extends Component<MnemonicsCreatePropsInterface, MnemonicsCreateStateInterface> {
    state: MnemonicsCreateStateInterface = {
        types: [],
        tags: [],
        mnemonics: [],
    };
    keyCount = 0;

    componentDidMount(): void {
        const { types, mnemonics, tags } = this.props;
        this.setState({ types, mnemonics, tags });
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

    handleAddMnemonic = (): void => {
        this.setState((prevState: MnemonicsCreateStateInterface) => ({
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

    render(): JSX.Element {
        const { onChange } = this.props;
        const { types, tags, mnemonics } = this.state;
        onChange(mnemonics);
        return (
            <Fragment>
                {mnemonics.map((mnemonic: MnemonicInterface, listIndex) => (
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
                                        <Form.Item
                                            name={`mnemonic-title-${mnemonic.key}`}
                                            initialValue={mnemonic.title}
                                        >
                                            <Input
                                                placeholder="Mnemonic Title"
                                                name="title"
                                                value={mnemonic.title}
                                                onChange={(event) => this.handleMnemonicInputChange(event, listIndex)}
                                                required
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={`mnemonic-sourceUrl-${mnemonic.key}`}
                                            initialValue={mnemonic.sourceUrl}
                                        >
                                            <Input
                                                placeholder="Mnemonic Source URL"
                                                name="sourceUrl"
                                                value={mnemonic.sourceUrl}
                                                allowClear
                                                onChange={(event) => this.handleMnemonicInputChange(event, listIndex)}
                                            />
                                        </Form.Item>
                                        <Form.Item
                                            name={`mnemonic-description-${mnemonic.key}`}
                                            initialValue={mnemonic.description}
                                        >
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
                                        <Form.Item
                                            name={`mnemonic-links-${mnemonic.key}`}
                                            initialValue={mnemonic.links}
                                        >
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
                                                placeholder="Select Mnemonic Types"
                                                onChange={(data) =>
                                                    this.handleMnemonicTypeChange(data as string[], listIndex)
                                                }
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
                ))}
                <Button type="dashed" className="add-mnemonic-button" onClick={this.handleAddMnemonic}>
                    + Add new mnemonic
                </Button>
            </Fragment>
        );
    }
}
