import React, { Component } from "react";
import { Card, Typography, Space, Skeleton } from "antd";

import { Mnemonic } from "global/generated-api";

import { Labels, LabelType } from "../Labels";
import "./styles.scss";

const { Paragraph } = Typography;

export class MnemonicsCard extends Component<{ mnemnonicContent: Mnemonic | null }> {
    renderSkeleton(): JSX.Element {
        return (
            <Card className="card">
                <Skeleton active />
            </Card>
        );
    }

    renderCardContent(mnemonic: Mnemonic): JSX.Element {
        const mnemonicCardUrl: string = "/mnemonic/" + mnemonic.id;
        return (
            <Card className="card" title={mnemonic.title} extra={<a href={mnemonicCardUrl}> Open </a>}>
                <Space direction="vertical" size="large">
                    <Paragraph ellipsis={{ rows: 7, expandable: false }}>{mnemonic.description}</Paragraph>
                    <Labels labels={mnemonic.types} labelType={LabelType.mnemonicType} />
                </Space>
            </Card>
        );
    }

    render(): JSX.Element {
        const mnemonic = this.props.mnemnonicContent;
        if (mnemonic == null) {
            return this.renderSkeleton();
        }
        return this.renderCardContent(mnemonic);
    }
}
