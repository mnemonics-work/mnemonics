import React, { Component } from "react";
import { MnemonicsCard } from "../MnemonicCard";
import { Pagination, Space, Spin } from "antd";
import "./styles.scss";
import { backendApi, MnemonicCardData } from "../../global/api";

interface MnemonicCardsState {
    mnemonicCards: MnemonicCardData[];
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

    getDataPageFromApi(page: number, pageSize: number): void {
        this.setState({ loaded: false });
        backendApi.cardsList(page, pageSize).then((data) => {
            this.total_cards = data["total"];
            this.setState({ mnemonicCards: data["cards"], current: page, loaded: true });
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
            .map((_, idx) => <MnemonicsCard key={idx} empty={true} />);
    }

    renderMnemonicCards(): JSX.Element[] {
        return this.state.mnemonicCards.map((mnemonic) => (
            <MnemonicsCard
                key={mnemonic.id}
                title={mnemonic.title}
                description={mnemonic.description}
                types={mnemonic.types}
            />
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
