import {createElement, Component, render} from './library/toy-react.js';

class App extends Component {
    
    render() {
        return(
            <div>
                <h1>Toy React Component</h1>
                { this.children }
            </div>
        )
    }
}

render(
    <App>
        <div>line1</div>
        <div>line2</div>
        Hello ToyReact
    </App>, document.body
);