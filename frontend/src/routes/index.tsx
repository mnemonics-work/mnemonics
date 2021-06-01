import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import { CardList } from "../components/CardList";
import { MnemonicPage } from "../components/MnemonicPage";
import { MnemonicSearch } from "../components/MnemonicSearch";
import { ExpressionPage } from "../components/ExpressionPage";
import { IndexPage } from "../components/IndexPage";
import { CategoryPage } from "../components/CategoryPage";
import history from "../history";

export class MainRoutes extends Component<unknown, unknown> {
    render(): JSX.Element {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/card-list" component={CardList} />
                    <Route path="/mnemonic/:mnemonicId" component={MnemonicPage} exact={true} />
                    <Route path="/expression/:expressionId" component={ExpressionPage} exact={true} />
                    <Route path="/category/:categoryId" component={CategoryPage} />
                    <Route path="/search/:query?" component={MnemonicSearch} />
                    <Route path="/" component={IndexPage} />
                </Switch>
            </Router>
        );
    }
}
