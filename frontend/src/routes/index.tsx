import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CardList } from "../components/CardList";
import { MnemonicPage } from "../components/MnemonicPage";

export class MainRoutes extends Component<unknown, unknown> {
    render(): JSX.Element {
        return (
            <Router>
                <Switch>
                    <Route path="/card-list" component={CardList} />
                    <Route path="/mnemonic/:mnemonicId" component={MnemonicPage} exact={true} />
                </Switch>
            </Router>
        );
    }
}
