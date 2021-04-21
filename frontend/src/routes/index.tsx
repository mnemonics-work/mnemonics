import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CardList } from "../components/CardList";
import { MnemonicPage } from "../components/MnemonicPage";
import { MnemonicSearch } from "../components/MnemonicSearch";

export class MainRoutes extends Component<unknown, unknown> {
    render(): JSX.Element {
        return (
            <Router>
                <Switch>
                    <Route path="/card-list" component={CardList} />
                    <Route path="/mnemonic/:mnemonicId" component={MnemonicPage} exact={true} />
                    <Route path="/search" component={MnemonicSearch} />
                </Switch>
            </Router>
        );
    }
}
