import React from "react";
import ReactDOM from "react-dom";
import "./assets/scss/app.scss";
import "antd/dist/antd.css";
import { MainRoutes } from "./routes";

ReactDOM.render(
    <React.StrictMode>
        <MainRoutes />
    </React.StrictMode>,
    document.getElementById("root"),
);
