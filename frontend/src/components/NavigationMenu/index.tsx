import React, { Component, Key } from "react";
import { Tree } from "antd";

import { MnemonicsAppApi } from "global/api";
import { ApiCategoriesListRequest, Category } from "global/generated-api";
import history from "../../history";

interface CategoryWrapper {
    category: Category;
    childCategories: CategoryWrapper[];
}

interface DataNode {
    title: string;
    key: number;
    isLeaf?: boolean;
    children?: DataNode[];
}

interface NavigationState {
    loaded: boolean;
    treeData: DataNode[];
}

export class NavigationMenu extends Component<unknown, NavigationState> {
    state: NavigationState = {
        loaded: false,
        treeData: [],
    };
    allCategories: { [id: number]: Category } = {};

    async getParentCategories(): Promise<Category[]> {
        const requestParams: ApiCategoriesListRequest = { parentTopicIsNull: "True" };
        return await MnemonicsAppApi.apiCategoriesList(requestParams);
    }

    async getAllCategories(): Promise<Category[]> {
        const requestParams: ApiCategoriesListRequest = {};
        return await MnemonicsAppApi.apiCategoriesList(requestParams);
    }

    buildMenuTree(initialCategories: number[]): CategoryWrapper[] {
        const res: CategoryWrapper[] = [];
        for (const categoryId of initialCategories) {
            res.push({
                category: this.allCategories[categoryId],
                childCategories: this.buildMenuTree(Array.from(this.allCategories[categoryId].childTopics)),
            });
        }
        return res;
    }

    async componentDidMount(): Promise<void> {
        const categories: Category[] = await this.getAllCategories();
        for (const category of categories) {
            if (category.id) {
                this.allCategories[category.id] = category;
            }
        }
        const parentCategories = await this.getParentCategories();
        const treeData: DataNode[] = parentCategories
            .filter((category) => category.id != undefined)
            .map((category) => {
                const dataNode: DataNode = {
                    title: category.title,
                    key: category.id as number,
                    isLeaf: Array.from(category.childTopics).length == 0,
                };
                return dataNode;
            });
        this.setState({ treeData, loaded: true });
    }

    updateTreeData(treeData: DataNode[], key: number, children: DataNode[]): DataNode[] {
        return treeData.map((node) => {
            if (node.key == key) {
                return { ...node, children };
            }
            if (node.children) {
                return { ...node, children: this.updateTreeData(node.children, key, children) };
            }
            return node;
        });
    }

    getChildrenData(parentCategoryId: number): void {
        const childCategoriesIds = Array.from(this.allCategories[parentCategoryId].childTopics);
        if (childCategoriesIds.length == 0) return;
        const requestParameters: ApiCategoriesListRequest = { ids: childCategoriesIds };
        MnemonicsAppApi.apiCategoriesList(requestParameters).then((data) => {
            const childrenTreeData: DataNode[] = data.map((category) => {
                const dataNode: DataNode = {
                    title: category.title,
                    key: category.id as number,
                    isLeaf: Array.from(category.childTopics).length == 0,
                };
                return dataNode;
            });
            this.setState({ treeData: this.updateTreeData(this.state.treeData, parentCategoryId, childrenTreeData) });
        });
    }

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    onLoadData = async ({ key, children }: any): Promise<void> => {
        if (children) {
            return;
        }
        this.getChildrenData(key);
    };

    onNodeSelect = async (selectedKeys: Key[]): Promise<void> => {
        if (selectedKeys.length == 1) {
            history.push("/category/" + selectedKeys[0]);
        }
    };

    render(): JSX.Element | null {
        return <Tree loadData={this.onLoadData} treeData={this.state.treeData} onSelect={this.onNodeSelect} />;
    }
}
