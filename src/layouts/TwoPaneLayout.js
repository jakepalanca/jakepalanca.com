import React from 'react';
import './TwoPaneLayout.css';

const TwoPaneLayout = ({ left, right }) => {
  return (
    <div className="two-pane-layout">
      <div className="pane left-pane">{left}</div>
      <div className="pane right-pane">{right}</div>
    </div>
  );
};

export default TwoPaneLayout;
