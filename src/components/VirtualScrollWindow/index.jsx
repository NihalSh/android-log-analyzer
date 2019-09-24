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
    this.firstVisibleChild = 1; // one-indexed
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

  removeRowsNotInViewport() {
    const startIndex = this.firstVisibleChild - 2;
    if (startIndex >= 0) {
      this.lastRowRetrieved -= this.rows.length;
      this.rows = this.rows.slice(startIndex, startIndex + this.numberOfRowsToRender);
      this.firstVisibleChild = 2; // 2;
      this.lastRowRetrieved += startIndex + this.rows.length;
    }
    this.setState({ rows: this.rows });
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
    const indexOfLastVisibleRowElement = this.firstVisibleChild + this.numberOfRowsToRender - 2;
    const bottomOfVisibleElement = pivotParent.getBoundingClientRect().bottom;
    const lastVisibleRowElement = ele.querySelector(':nth-child(' + indexOfLastVisibleRowElement + ')');
    const topOfTheBottomElement = lastVisibleRowElement.getBoundingClientRect().top;
    if (bottomOfVisibleElement < topOfTheBottomElement) {
      const row = this.getRowToAddAtTheTop();
      if (row !== null) {
        this.rows = [row, ...this.rows];
        this.setState({ rows: this.rows });
        this.firstVisibleChild = 1;
        this.handleScrollUp();
      }
    }
  }

  handleScrollDown() {
    const ele = this.contentWrapperRef.current;
    const pivotParent = this.containerRef.current;
    const firstRowElement = ele.querySelector(`:nth-child(${this.firstVisibleChild})`);
    const topOfVisibleElement = pivotParent.getBoundingClientRect().top;
    const bottomOfFirstElement = firstRowElement.getBoundingClientRect().bottom;
    if (bottomOfFirstElement < topOfVisibleElement) {
      const row = this.getRowToAddAtTheBottom();
      if (row !== null) {
        this.rows = [...this.rows, row];
        this.setState({ rows: this.rows });
        this.firstVisibleChild += 1; // this can cause problems as all the elements may not be rendered when using the querySelector
        this.lastRowRetrieved = this.lastRowRetrieved + 1;
        this.handleScrollDown();
      }
    }
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
    this.removeRowsNotInViewport();
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
