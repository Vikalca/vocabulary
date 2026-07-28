import render from "./render.js";
import navigation from "./navigation.js";
import store from "./store.js";

navigation();

store.subscribe(render);

render();
