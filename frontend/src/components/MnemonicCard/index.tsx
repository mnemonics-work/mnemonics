import React, { Component } from "react";
import { Card, Typography, Space, Skeleton } from "antd";
import { Labels } from "../Labels";
import "./styles.scss";

const { Paragraph } = Typography;

export class MnemonicsCard extends Component<
    { title?: string; description?: string; types?: string[]; empty?: boolean },
    never
> {
    renderSkeleton(): JSX.Element {
        return (
            <Card className="card">
                <Skeleton active />
            </Card>
        );
    }

    renderCardContent(title?: string, description?: string, types?: string[]): JSX.Element {
        return (
            <Card className="card" title={title} extra={<a href="#"> Open </a>}>
                <Space direction="vertical" size="large">
                    <Paragraph ellipsis={{ rows: 7, expandable: false }}>{description}</Paragraph>
                    <Labels labels={types} />
                </Space>
            </Card>
        );
    }

    render(): JSX.Element {
        const { title, description, types, empty } = this.props;
        if (empty) {
            return this.renderSkeleton();
        }
        return this.renderCardContent(title, description, types);
    }
}
