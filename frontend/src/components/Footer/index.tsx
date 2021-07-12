import React, { Component } from "react";
import { Layout } from "antd";
import { Space } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import "./styles.scss";

const { Footer } = Layout;

export class CustomFooter extends Component<unknown> {
    render(): JSX.Element {
        return (
            <Footer className="center-content">
                <Space direction="vertical">
                    <div className="footer-copyright">
                        <span>Copyright @ 2021 Mnemonics Work</span>
                        <a
                            href="https://github.com/mnemonics-work/mnemonics"
                            className="footer-link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <GithubOutlined className="github-icon" />
                        </a>
                    </div>
                    <div>
                        <a
                            href="https://www.termsofusegenerator.net/live.php?token=cfwRZZxSC7nYva6OvPrF7DPsa7i3ouYy"
                            className="footer-link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Terms of service
                        </a>
                    </div>
                </Space>
            </Footer>
        );
    }
}
