import React, {Component} from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';

import {djikstra, getNodesInShortestPathOrder} from '../algorithms/djikstra';
import {astar} from '../algorithms/astar';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algorithm: 'djikstra',
    };

    this.setSelectedAlgorithmHandler =
      this.setSelectedAlgorithmHandler.bind(this);
    this.algorithmVisualizeButtonHandler =
      this.algorithmVisualizeButtonHandler.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  setSelectedAlgorithmHandler(event) {
    this.setState({...this.state, algorithm: event.target.value});
  }

  algorithmVisualizeButtonHandler() {
    this.visualizeAlgorithm();
  }

  animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeAlgorithm() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    var visitedNodesInOrder = [];

    if (this.state.algorithm === 'djikstra') {
      visitedNodesInOrder = djikstra(grid, startNode, finishNode);
    }
    if (this.state.algorithm === 'astar') {
      visitedNodesInOrder = astar(grid, startNode, finishNode);
    }

    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div>
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
          />
          <label htmlFor="departure">Barrier</label>
        </div>

        <div>
          {' '}
          <label htmlFor="algorithm">Choose an Algorithm:</label>
          <select
            name="algorithm"
            id="algorithm"
            onChange={this.setSelectedAlgorithmHandler}>
            <option value="djikstra">Dkistra's Algorithm</option>
            <option value="astar">A* Search</option>
            <option value="greedybfs">Greedy Best-first Search</option>
            <option value="swarm">Swarm Algorithm</option>
            <option value="convergentswarm">Convergent Swarm Algorithm</option>
            <option value="bidirectionalswarm">
              Bidirectional Swarm Algorithm
            </option>
            <option value="bfs">Breadth-first Search</option>
            <option value="dfs">Depth-first Search</option>
          </select>
        </div>

        <button onClick={this.algorithmVisualizeButtonHandler}>
          Visualize
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
