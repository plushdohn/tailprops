import { render } from "preact";
import { App } from "./app";
import "./global.css";

render(<App />, document.getElementById("app") as HTMLElement);
