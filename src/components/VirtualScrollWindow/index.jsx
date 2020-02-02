import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

class VirtualScrollWindow extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      rows: [],
    };
    this.containerRef = React.createRef();
    this.contentWrapperRef = React.createRef();
    this.scrollWindowRef = React.createRef();
    this.rows = [];
    this.numberOfRowsToRender = 0;
    this.lastRowRetrieved = -1; // zero-indexed
  }

  getRowHeight() {
    // the height cannot be part of state
    const ROW_HEIGHT = 20; // pixels
    return ROW_HEIGHT;
  }

  getRow(rowData, index) {
    const rowHeight = this.getRowHeight();
    const row = (
      <div
        key={index}
        style={{ position: 'absolute', height: rowHeight, top: rowHeight * index, left: 0 }}
      >
        {rowData}
      </div>
    );
    return row;
  }

  getRowToAddAtTheTop() {
    const { getNextRow } = this.props;
    const lastRow = this.lastRowRetrieved - this.rows.length - 1;
    const rowData = getNextRow(lastRow);
    if (rowData === null) {
      return null;
    }
    const index = lastRow + 1;
    return this.getRow(rowData, index);
  }

  getRowToAddAtTheBottom() {
    const { getNextRow } = this.props;
    const rowData = getNextRow(this.lastRowRetrieved);
    if (rowData === null) {
      return null;
    }
    const index = this.lastRowRetrieved + 1;
    return this.getRow(rowData, index);
  }

  getIntialRowsToRender(height) {
    const numberOfRowsToRender = this.calculateRowsToRender(height);
    this.numberOfRowsToRender = numberOfRowsToRender;
    const rowsToRender = [];
    for (let i = 0; i < numberOfRowsToRender; i++) {
      const row = this.getRowToAddAtTheBottom();
      if (row === null) break;
      rowsToRender.push(row);
      this.lastRowRetrieved = i;
    }
    return rowsToRender;
  }

  setContainerDimensions() {
    const height = this.containerRef.current.clientHeight;
    const width = this.containerRef.current.clientWidth;
    const { height: oldHeight, width: oldWidth } = this.state;

    if (oldHeight != height || oldWidth != width) {
      return { hasDimensionChanged: true, height, width };
    }
    return { hasDimensionChanged: false };
  }

  handleContainerResizing() {
    const { hasDimensionChanged, height, width } = this.setContainerDimensions();
    if (hasDimensionChanged) {
      const rowsToRender = this.getIntialRowsToRender(height);
      this.rows = rowsToRender;
      this.setState({
        height,
        width,
        rows: rowsToRender,
      });
    }
  }

  handleScrollUp() {
    const ele = this.contentWrapperRef.current;
    const pivotParent = this.containerRef.current;
    const firstRowElement = ele.querySelector(`:nth-child(1)`);
    const topOfVisibleElement = pivotParent.getBoundingClientRect().top;
    const topOfFirstElement = firstRowElement.getBoundingClientRect().top;
    let numberOfRowsToBeAdded = Math.ceil((topOfFirstElement - topOfVisibleElement) / this.getRowHeight());
    if (numberOfRowsToBeAdded <= 0) {
      return;
    }

    const newRows = [];
    this.lastRowRetrieved = this.lastRowRetrieved - this.rows.length - numberOfRowsToBeAdded;
    if (this.lastRowRetrieved < 0) {
      this.lastRowRetrieved = -1;
    }
    if (numberOfRowsToBeAdded > this.numberOfRowsToRender) {
      numberOfRowsToBeAdded = this.numberOfRowsToRender;
    }

    let lastRowRetrievedBck = this.lastRowRetrieved;
    while (numberOfRowsToBeAdded--) {
      const row = this.getRowToAddAtTheBottom();
      if (row === null) {
        break;
      }
      this.lastRowRetrieved++;
      newRows.push(row);
    }
    this.rows = [...newRows, ...this.rows];
    this.rows = this.rows.slice(0, this.numberOfRowsToRender);
    this.lastRowRetrieved = lastRowRetrievedBck + this.rows.length;
    this.setState({ rows: this.rows });
  }

  handleScrollDown() {
    const ele = this.contentWrapperRef.current;
    const pivotParent = this.containerRef.current;
    const firstRowElement = ele.querySelector(`:nth-child(1)`);
    const topOfVisibleElement = pivotParent.getBoundingClientRect().top;
    const bottomOfFirstElement = firstRowElement.getBoundingClientRect().bottom;
    let numberOfRowsToBeAdded = Math.ceil((topOfVisibleElement - bottomOfFirstElement) / this.getRowHeight());
    if (numberOfRowsToBeAdded <= 0) {
      return;
    }

    const newRows = [];
    if (numberOfRowsToBeAdded > this.numberOfRowsToRender) {
      this.lastRowRetrieved += numberOfRowsToBeAdded - this.numberOfRowsToRender - 1;
      numberOfRowsToBeAdded = this.numberOfRowsToRender;
    }

    while (numberOfRowsToBeAdded--) {
      const row = this.getRowToAddAtTheBottom();
      if (row === null) {
        break;
      }
      this.lastRowRetrieved++;
      newRows.push(row);
    }

    this.rows = [...this.rows, ...newRows];
    this.rows = this.rows.slice(this.rows.length - this.numberOfRowsToRender, this.rows.length);
    this.setState({ rows: this.rows });
  }

  lastScrollTopPosition = 0;

  handleScroll = (e) => {
    const latestScrollTopPosition = this.scrollWindowRef.current.scrollTop;
    if (latestScrollTopPosition - this.lastScrollTopPosition > 0) {
      this.handleScrollDown();
    } else {
      this.handleScrollUp();
    }
    this.lastScrollTopPosition = latestScrollTopPosition;
  }

  componentDidMount() {
    this.handleContainerResizing();
  }

  componentDidUpdate() {
    this.handleContainerResizing();
  }

  calculateRowsToRender(height) {
    const rowHeight = this.getRowHeight();
    const numberOfRowsInViewport = Math.ceil(height / rowHeight);
    const numberOfRowsToRender = numberOfRowsInViewport + 2;
    return numberOfRowsToRender;
  }

  render() {
    const { className: parentClassNames, rowCount } = this.props;
    const { height, rows, width } = this.state;
    const rowHeight = this.getRowHeight();
    const className = classNames(styles['text-view-container'], parentClassNames);
    return (
      <div className={className} ref={this.containerRef}>
        <section onScroll={this.handleScroll} ref={this.scrollWindowRef} style={{ height, width, overflow: 'auto' }}>
          <div styleName="row" ref={this.contentWrapperRef} style={{ position: 'relative', height: rowHeight * rowCount }}>
            {rows}
          </div>
        </section>
      </div>
    );
  }
}

VirtualScrollWindow.defaultProps = {
  className: '',
};

VirtualScrollWindow.propTypes = {
  className: PropTypes.string,
  getNextRow: PropTypes.func.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default VirtualScrollWindow;
