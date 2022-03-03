import React from 'react';

const AlgorithmSelector = props => {
  const setAlgorithmHandler = event => {
    props.onAlgorithmSelect(event.target.value);
  };

  return (
    <div>
      {' '}
      <label htmlFor="algorithm">Choose an Algorithm:</label>
      <select
        value={props.selectedAlgorithm}
        name="algorithm"
        id="algorithm"
        onChange={setAlgorithmHandler}>
        <option value="djikstra">Dkistra's Algorithm</option>
        <option value="astar">A* Search</option>
        <option value="greedybfs">Greedy Best-first Search</option>
        {/* <option value="swarm">Swarm Algorithm</option>
        <option value="convergentswarm">Convergent Swarm Algorithm</option>
        <option value="bidirectionalswarm">
          Bidirectional Swarm Algorithm */}
        {/* </option> */}
        <option value="bfs">Breadth-first Search</option>
        <option value="dfs">Depth-first Search</option>
      </select>
    </div>
  );
};

export default AlgorithmSelector;
