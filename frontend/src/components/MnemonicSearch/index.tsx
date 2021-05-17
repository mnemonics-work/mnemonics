import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Card, Checkbox, Divider, Empty, Input, Pagination, Spin } from "antd";

import { MnemonicsApi, MnemonicTypesApi, TagsApi } from "global/api";
import { Mnemonic, MnemonicsListRequest, MnemonicType, Tag } from "global/generated-api";

import { MnemonicsCard } from "../MnemonicCard";
import "./styles.scss";

const { Search } = Input;

interface MnemonicSearchState {
    mnemonics: Mnemonic[];
    current: number;
    loaded: boolean;
    tags: Tag[];
    mnemonicTypes: MnemonicType[];
    dataRetrieved: boolean;
}

interface CheckboxOption {
    label: string;
    value: number;
}

interface RouteParams {
    query: string;
}

declare type CheckboxValue = number | string | boolean;

export class MnemonicSearch extends Component<RouteComponentProps<RouteParams>, MnemonicSearchState> {
    PAGE_SIZE = 8;
    total_cards = 1;
    selectedTags: number[] = [];
    selectedMnemonicTypes: number[] = [];
    searchedText = "";
    searchedTags: number[] = [];
    searchedMnemonicTypes: number[] = [];

    state: MnemonicSearchState = {
        mnemonics: [],
        current: 0,
        loaded: false,
        tags: [],
        mnemonicTypes: [],
        dataRetrieved: false,
    };

    getOffset(currentPage: number, pageSize: number): number {
        return (currentPage - 1) * pageSize;
    }

    async searchAndFilter(searchText: string, tags: number[], mnemonicTypes: number[], page: number): Promise<void> {
        this.setState({ dataRetrieved: false });
        const requestParameters: MnemonicsListRequest = {
            search: searchText,
            tags: tags,
            types: mnemonicTypes,
            offset: this.getOffset(page, this.PAGE_SIZE),
            limit: this.PAGE_SIZE,
        };
        MnemonicsApi.mnemonicsList(requestParameters).then((data) => {
            this.total_cards = data.count;
            this.setState({ mnemonics: data.results, dataRetrieved: true, current: page });
        });
    }

    onSearch = (textValue: string): void => {
        this.searchedTags = [...this.selectedTags];
        this.searchedMnemonicTypes = [...this.selectedMnemonicTypes];
        this.searchedText = textValue;
        this.searchAndFilter(textValue, this.selectedTags, this.selectedMnemonicTypes, 1);
    };

    onPageChange = (page: number): void => {
        this.searchAndFilter(this.searchedText, this.searchedTags, this.searchedMnemonicTypes, page);
    };

    async getAllTagsFromApi(): Promise<Tag[]> {
        return await TagsApi.tagsList();
    }

    async getAllMnemonicTypesFromApi(): Promise<MnemonicType[]> {
        return await MnemonicTypesApi.mnemonicTypesList();
    }

    async componentDidMount(): Promise<void> {
        const tags = await this.getAllTagsFromApi();
        const mnemonicTypes = await this.getAllMnemonicTypesFromApi();
        this.setState({ tags, mnemonicTypes, loaded: true });
        await this.searchAndFilter(this.props.match.params.query, this.selectedTags, this.selectedMnemonicTypes, 1);
    }

    updateSelectedTags = (checkedValues: CheckboxValue[]): void => {
        this.selectedTags = checkedValues.map((value) => (typeof value == "number" ? value : 0));
    };

    updateSelectedMnemonicTypes = (checkedValues: CheckboxValue[]): void => {
        this.selectedMnemonicTypes = checkedValues.map((value) => (typeof value == "number" ? value : 0));
    };

    renderTagsOptions(tags: Tag[]): JSX.Element {
        const tagsOptions: CheckboxOption[] = tags.map(function (tag) {
            const option: CheckboxOption = { value: tag.id ? tag.id : 0, label: tag.label };
            return option;
        });
        return <Checkbox.Group options={tagsOptions} onChange={this.updateSelectedTags} />;
    }

    renderMnemonicTypesOptions(mnemonicTypes: MnemonicType[]): JSX.Element {
        const mnemonicTypesOptions: CheckboxOption[] = mnemonicTypes.map(function (mnemonicType) {
            const option: CheckboxOption = { value: mnemonicType.id ? mnemonicType.id : 0, label: mnemonicType.label };
            return option;
        });
        return <Checkbox.Group options={mnemonicTypesOptions} onChange={this.updateSelectedMnemonicTypes} />;
    }

    renderSkeleton(): JSX.Element[] {
        const numOfEmptyCards = 4;
        return Array(numOfEmptyCards)
            .fill(null)
            .map((_, idx) => <MnemonicsCard key={idx} mnemnonicContent={null} />);
    }

    renderMnemonicCards(mnemonics: Mnemonic[]): JSX.Element[] | JSX.Element {
        if (mnemonics.length == 0) {
            return (
                <div className="no-results-container">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </div>
            );
        }
        return mnemonics.map((mnemonic) => <MnemonicsCard key={mnemonic.id} mnemnonicContent={mnemonic} />);
    }

    render(): JSX.Element {
        const { loaded, dataRetrieved, current, mnemonics, tags, mnemonicTypes } = this.state;
        return (
            <Card title="Search Mnemonics">
                <div className="search-menu">
                    <Search
                        placeholder="Title or description"
                        enterButton="Search"
                        defaultValue={this.props.match.params.query}
                        onSearch={this.onSearch}
                    />
                    <div className="tags">
                        <Divider orientation="left" plain>
                            Tags
                        </Divider>
                        {loaded && this.renderTagsOptions(tags)}
                    </div>
                    <div className="mnemonicTypes">
                        <Divider orientation="left" plain>
                            Mnemonic Types
                        </Divider>
                        {loaded && this.renderMnemonicTypesOptions(mnemonicTypes)}
                    </div>
                </div>
                <div className="results">
                    <Divider> Mnemonics </Divider>
                    <Spin spinning={!loaded} size="default">
                        <div className="card-list">
                            {dataRetrieved ? this.renderMnemonicCards(mnemonics) : this.renderSkeleton()}
                        </div>
                    </Spin>
                    <Pagination
                        className="pagination"
                        defaultCurrent={1}
                        total={this.total_cards}
                        current={current}
                        pageSize={this.PAGE_SIZE}
                        onChange={this.onPageChange}
                    />
                </div>
            </Card>
        );
    }
}
