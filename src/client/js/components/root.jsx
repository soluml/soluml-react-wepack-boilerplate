import React from 'react';

const attrs = {
  className: styled`
    background-color: navy;
    color: white;
  `
};

console.log(attrs.profile?.name?.firstName);

export default () => (
  <div {...attrs}>
    Root!!!?
  </div>
);
