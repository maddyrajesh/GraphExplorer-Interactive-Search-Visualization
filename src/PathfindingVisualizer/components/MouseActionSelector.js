import React from 'react';

const MouseActionSelector = props => {
  const setSetlectedMouseActionHandler = event => {
    props.onMouseActionSelect(event.target.value);
  };

  return (
    <div
      value={props.selectedMouseAction}
      onChange={setSetlectedMouseActionHandler}>
      {' '}
      <input
        type="radio"
        id="departure"
        name="grid-selector"
        value="departure"
      />
      <label htmlFor="departure">Departure</label>
      <input
        type="radio"
        id="destination"
        name="grid-selector"
        value="destination"
      />
      <label htmlFor="departure">Destination</label>
      <input
        type="radio"
        id="barrier"
        name="grid-selector"
        value="barrier"
        defaultChecked
      />
      <label htmlFor="departure">Barrier</label>
    </div>
  );
};

export default MouseActionSelector;
