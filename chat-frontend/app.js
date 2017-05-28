import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      socket: io()
    };
    this.join = this.join.bind(this);
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected');
    });

    this.state.socket.on('errorMessage', message => {
      console.log('error');
    });
  }

  join(room) {
    console.log(room);
  }

  render() {
    return (
      <div>
        <h1>React Chat</h1>
        <button className="btn btn-default" onClick={this.join('Party Place')}>
          Join the Party Place
        </button>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);
