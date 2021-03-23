import React, { Component } from "react";
import { Tag } from "antd";
import { MnemonicTypesApi } from "../../global/api";
import { MnemonicType } from "../../global/generated-api";

interface LabelsState {
    mnemonicTypes: MnemonicType[];
}

export class Labels extends Component<{ labels?: Set<number> | null }, LabelsState> {
    state: LabelsState = {
        mnemonicTypes: [],
    };

    async componentDidMount(): Promise<void> {
        let mnemonicTypes: MnemonicType[] = [];
        const labels = this.props.labels;
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
        this.setState({ mnemonicTypes: mnemonicTypes });
    }

    render(): JSX.Element[] {
        return this.state.mnemonicTypes.map((mnemonicType) => <Tag key={mnemonicType.id}>{mnemonicType.label}</Tag>);
    }
}
