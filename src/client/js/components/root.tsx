import React from 'react';

const attrs = {
  className: styled`
    background-color: navy;
    color: white;
  `
};

export default () => (
  <div {...attrs}>
    Root!!!?
  </div>
);
