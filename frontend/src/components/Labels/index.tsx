import React, { Component } from "react";
import { Tag } from "antd";

import { MnemonicTypesApi, TagsApi } from "global/api";
import { MnemonicType, Tag as MnemonicTag } from "global/generated-api";

interface LabelsState {
    mnemonicTypes: MnemonicType[];
    mnemonicTags: MnemonicTag[];
}

export enum LabelType {
    mnemonicType,
    mnemonicTag,
}

export class Labels extends Component<{ labels?: Set<number> | null; labelType: LabelType }, LabelsState> {
    state: LabelsState = {
        mnemonicTypes: [],
        mnemonicTags: [],
    };

    async getMnemonicTypes(): Promise<void> {
        let mnemonicTypes: MnemonicType[] = [];
        const { labels } = this.props;
        if (labels) {
            const arrayLabels = Array.from(labels);
            const availableLabels = await MnemonicTypesApi.mnemonicTypesList();
            // TODO manage filtering in backend
            mnemonicTypes = availableLabels.filter((mnemonicType: MnemonicType) => {
                if (mnemonicType && mnemonicType.id) {
                    return arrayLabels.includes(mnemonicType.id);
                }
                return false;
            });
        }
        this.setState({ mnemonicTypes });
    }

    async getMnemonicTags(): Promise<void> {
        let mnemonicTags: MnemonicTag[] = [];
        const { labels } = this.props;
        if (labels) {
            const arrayLabels = Array.from(labels);
            const availableLabels = await TagsApi.tagsList();
            // TODO manage filtering in backend
            mnemonicTags = availableLabels.filter((mnemonicTag: MnemonicTag) => {
                if (mnemonicTag && mnemonicTag.id) {
                    return arrayLabels.includes(mnemonicTag.id);
                }
                return false;
            });
        }
        this.setState({ mnemonicTags });
    }

    async componentDidMount(): Promise<void> {
        if (this.props.labelType == LabelType.mnemonicTag) {
            this.getMnemonicTags();
        } else {
            this.getMnemonicTypes();
        }
    }

    render(): JSX.Element[] {
        if (this.props.labelType == LabelType.mnemonicTag) {
            return this.state.mnemonicTags.map((mnemonicTag) => <Tag key={mnemonicTag.id}>{mnemonicTag.label}</Tag>);
        }
        return this.state.mnemonicTypes.map((mnemonicType) => <Tag key={mnemonicType.id}>{mnemonicType.label}</Tag>);
    }
}
