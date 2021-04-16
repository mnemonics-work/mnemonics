import React, { Component } from "react";
import { MnemonicsCard } from "../MnemonicCard";
import { Pagination, Space, Spin } from "antd";
import "./styles.scss";
import { MnemonicsApi } from "global/api";
import { Mnemonic, MnemonicsListRequest } from "global/generated-api";

interface MnemonicCardsState {
    mnemonicCards: Mnemonic[];
    current: number;
    loaded: boolean;
}

export class CardList extends Component<unknown, MnemonicCardsState> {
    PAGE_SIZE = 8;
    total_cards = 1;

    state: MnemonicCardsState = {
        mnemonicCards: [],
        current: 0,
        loaded: false,
    };

    getOffset(currentPage: number, pageSize: number): number {
        return (currentPage - 1) * pageSize;
    }

    getDataPageFromApi(page: number, _pageSize: number): void {
        this.setState({ loaded: false });
        const requestParams: MnemonicsListRequest = { limit: _pageSize, offset: this.getOffset(page, _pageSize) };
        MnemonicsApi.mnemonicsList(requestParams).then((data) => {
            this.total_cards = data.count;
            this.setState({ mnemonicCards: data.results, current: page, loaded: true });
        });
    }

    componentDidMount(): void {
        this.getDataPageFromApi(1, this.PAGE_SIZE);
    }

    onPageChange = (page: number): void => {
        this.getDataPageFromApi(page, this.PAGE_SIZE);
    };

    renderSkeleton(): JSX.Element[] {
        const numOfEmptyCards = 4;
        return Array(numOfEmptyCards)
            .fill(null)
            .map((_, idx) => <MnemonicsCard key={idx} mnemnonicContent={null} />);
    }

    renderMnemonicCards(): JSX.Element[] {
        return this.state.mnemonicCards.map((mnemonic) => (
            <MnemonicsCard key={mnemonic.id} mnemnonicContent={mnemonic} />
        ));
    }

    render(): JSX.Element {
        return (
            <Space direction="vertical" className="cards">
                <Spin spinning={!this.state.loaded} size="default">
                    <div className="card-list">
                        {this.state.loaded ? this.renderMnemonicCards() : this.renderSkeleton()}
                    </div>
                </Spin>
                <Pagination
                    className="pagination"
                    defaultCurrent={1}
                    total={this.total_cards}
                    current={this.state.current}
                    pageSize={this.PAGE_SIZE}
                    onChange={this.onPageChange}
                />
            </Space>
        );
    }
}
