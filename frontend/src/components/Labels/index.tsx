import React, { Component } from "react";
import { Tag } from "antd";

export class Labels extends Component<{ labels?: string[] }, never> {
    render(): JSX.Element | undefined {
        const { labels } = this.props;
        let listOfLabels: JSX.Element[] = [];
        if (labels) {
            listOfLabels = labels.map((label) => <Tag key={label}>{label}</Tag>);
            return <div>{listOfLabels}</div>;
        }
        return undefined;
    }
}
