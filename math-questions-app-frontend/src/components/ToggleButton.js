import React from 'react';

function ToggleButton({ toggle, label, disabled }) {
  return (
    <button onClick={toggle} disabled={disabled}>
      {label}
    </button>
  );
}

export default ToggleButton;

