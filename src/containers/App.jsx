import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { selectors, operations } from 'ducks/sample';

class App extends React.PureComponent {
  render() {
    return (
      <>
        <span>
          {this.props.message}
        </span>
        <br />
        <button
          onClick={() => this.props.sendMessage(Math.random().toString())}
        >
          Randomize
        </button>
      </>
    );
  }
}

App.propTypes = {
  message: PropTypes.string.isRequired,
  sendMessage: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    message: selectors.getEchoMessage(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    sendMessage: operations.doEcho(dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App); 
