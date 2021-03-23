import React, { Component } from "react";
import { Card, Typography, Space, Skeleton } from "antd";
import { Labels } from "../Labels";
import "./styles.scss";
import { Mnemonic } from "../../global/generated-api";

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
        return (
            <Card className="card" title={mnemonic.title} extra={<a href="#"> Open </a>}>
                <Space direction="vertical" size="large">
                    <Paragraph ellipsis={{ rows: 7, expandable: false }}>{mnemonic.description}</Paragraph>
                    <Labels labels={mnemonic.types} />
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
