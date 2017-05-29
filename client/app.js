import React, { Component } from 'react';
import { render } from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      roomName: '',
      rooms: ["Party Place", "Josh's Fun Time", "Sandwich Connoisseurs", "CdT"],
      username: ''
    };
    this.join = this.join.bind(this);
  }

  componentDidMount() {
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected!!');
      const user = prompt('Hello, please enter your username');
      this.setState({ username: user });
      this.state.socket.emit('username', user);
    });

    this.state.socket.on('errorMessage', message => {
      console.log('error');
      console.log(message);
    });
  }

  join(room) {
    if (room === this.state.roomName) {
      return;
    }
    console.log(`Joining room: ${room}`);
    this.setState({ roomName: room });
    this.state.socket.emit('room', room);
  }

  render() {
    return (
      <div>
        <center><h1>React Chat!</h1></center>

        {!this.state.username &&
          <div id="welcome-message" className="alert alert-danger">
            Please enter your username.
          </div>
        }

        {this.state.username &&
        <div>
          <div id="welcome-message" className="alert alert-success">
            Welcome to React Chat, {this.state.username}!
          </div>
          <ChatRoomSelector
            rooms={this.state.rooms}
            roomName={this.state.roomName}
            onSwitch={this.join}
          />
          <ChatRoom
            roomName={this.state.roomName}
            socket={this.state.socket}
            username={this.state.username}
          />
        </div>
        }
      </div>
    );
  }
}

class ChatRoomSelector extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <h4>Choose a room:</h4>
          <div id="rooms" className="btn-group">
            {this.props.rooms.map((room) => {
              var className = `btn btn-default${this.props.roomName === room ? ' active' : ''}`;
              return (
                <button
                  key={room}
                  type="button"
                  className={className}
                  onClick={() => { this.props.onSwitch(room) }}>
                  {room}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

class ChatRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: []
    };
    this.submitMessage = this.submitMessage.bind(this);
  }

  componentDidMount() {
    console.log('mount');
    this.props.socket.on('message', message => {
      const newMessages = this.state.messages;
      newMessages.push(`${message.username}: ${message.content}`);
      this.setState({
        messages: newMessages,
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    if (nextProps.roomName !== this.props.roomName){
      // this.props.socket.emit('room', nextProps.roomName);
      this.setState({
        messages: []
      });
    }
  }

  componentDidUpdate() {
    var display = document.getElementById("chatMessages");
    if (display) {
      display.scrollTop = display.scrollHeight;
    }
  }

  submitMessage(e){
    e.preventDefault();
    if (this.state.message === '') {
      return; // nothing
    }
    this.props.socket.emit('message', this.state.message);
    var newMessages = this.state.messages;
    newMessages.push(`${this.props.username}: ${this.state.message}`);
    this.setState({
      messages: newMessages,
      message: ''
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-8 col-md-offset-2">
          <div className="panel panel-info">
            <div className="panel-heading">
              CHAT
            </div>

            <div className="panel-body">
            {this.props.roomName.length == 0 ?
              <ul className="media-list"><li>No room selected!</li></ul>
            : (this.state.messages.length == 0 ?
                <ul className="media-list"><li>No messages</li></ul>
              : <ul id="chatMessages" className="media-list">
                  {this.state.messages.map((message, i) => <li key={i}>{message}</li>)}
                </ul>
              )
            }
            </div>

            <div className="panel-footer">
              <form className="form-group" onSubmit={this.submitMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Message"
                    onChange={(e) => this.setState({ message: e.target.value })}
                    value={this.state.message}
                  />
                  <span className="input-group-btn">
                    {this.props.roomName.length == 0 ?
                      <button className="btn btn-info" type="submit" disabled>SEND</button>
                    :
                      <button className="btn btn-info" type="submit">SEND</button>
                    }
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

render(
  <App />,
  document.getElementById('root')
);
