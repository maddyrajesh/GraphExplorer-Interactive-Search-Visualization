import React, {Component} from 'react';
import Node from './Node/Node';
import './PathfindingVisualizer.css';

import MouseActionSelector from './components/MouseActionSelector';
import AlgorithmSelector from './components/AlgorithmSelector';

import {djikstra, getNodesInShortestPathOrder} from '../algorithms/djikstra';
import {astar} from '../algorithms/astar';
import {bfs} from '../algorithms/bfs';
import {dfs} from '../algorithms/dfs';
import {greedybfs} from '../algorithms/greedybfs';
import {simpleMaze} from '../mazes/SimpleMaze';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      algorithm: 'djikstra',
      mouseAction: 'barrier',
    };

    this.setSelectedAlgorithmHandler =
      this.setSelectedAlgorithmHandler.bind(this);
    this.setSelectedMouseActionHandler =
      this.setSelectedMouseActionHandler.bind(this);
    this.algorithmVisualizeButtonHandler =
      this.algorithmVisualizeButtonHandler.bind(this);
    this.RandomizeWallButtonHandler =
      this.RandomizeWallButtonHandler.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if (this.state.mouseAction === 'barrier') {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    } else if (this.state.mouseAction === 'departure') {
      const newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    } else {
      const newGrid = getNewGridWithFinishToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if (this.state.mouseAction === 'barrier') {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    } else if (this.state.mouseAction === 'departure') {
      const newGrid = getNewGridWithStartToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    } else {
      const newGrid = getNewGridWithFinishToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  setSelectedMouseActionHandler(mouseAction) {
    this.setState({...this.state, mouseAction: mouseAction});
    console.log(mouseAction);
  }

  setSelectedAlgorithmHandler(algorithm) {
    this.setState({...this.state, algorithm: algorithm});
    console.log(algorithm);
  }

  RandomizeWallButtonHandler() {
    const grid = clearGridHelper();
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    var nodesToBeWalls = null;
    nodesToBeWalls = simpleMaze(grid, startNode, finishNode);
    if (nodesToBeWalls !== null) {
      this.animateWalls(nodesToBeWalls, grid);
    }
  }

  async animateWalls(nodesToBeWalls, grid) {
    const promises = [];
    for (let i = 0; i <= nodesToBeWalls.length; i++) {
      promises.push(
        new Promise(resolve => {
          setTimeout(() => {
            const node = nodesToBeWalls[i];
            if (node && !node.isStart && !node.isFinish && node.isWall) {
              document.getElementById(
                `node-${node.row}-${node.col}`,
              ).className = 'node node-wall';
            }

            if (i === nodesToBeWalls.length - 1) {
              this.setState({grid: grid});
            }
            resolve();
          }, 10 * i);
        }),
      );
    }
    await Promise.all(promises);
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
    if (this.state.algorithm === 'greedybfs') {
      visitedNodesInOrder = greedybfs(grid, startNode, finishNode);
    }
    if (this.state.algorithm === 'astar') {
      visitedNodesInOrder = astar(grid, startNode, finishNode);
    }
    if (this.state.algorithm === 'bfs') {
      visitedNodesInOrder = bfs(grid, startNode, finishNode);
    }
    if (this.state.algorithm === 'dfs') {
      visitedNodesInOrder = dfs(grid, startNode, finishNode);
    }
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <MouseActionSelector
          selectedMouseAction={this.state.mouseAction}
          onMouseActionSelect={this.setSelectedMouseActionHandler}
        />
        <AlgorithmSelector
          selectedAlgorithm={this.state.algorithm}
          onAlgorithmSelect={this.setSelectedAlgorithmHandler}
        />
        <div>
          <button onClick={this.RandomizeWallButtonHandler}>
            Randomize Wall
          </button>
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

function clearGridHelper() {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];

    for (let col = 0; col < 50; col++) {
      var node = createNode(col, row);
      node.isWall = false;

      if (node && !node.isFinish && !node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node';
      } else if (node.isFinish) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-finish';
      } else if (node.isStart) {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-start';
      }

      currentRow.push(node);
    }
    grid.push(currentRow);
  }
  return grid;
}

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

const getNewGridWithStartToggled = (grid, row, col) => {
  let newGrid = grid.slice();
  let node = newGrid[START_NODE_ROW][START_NODE_COL];
  let newNode = {
    ...node,
    isStart: false,
  };
  newGrid[START_NODE_ROW][START_NODE_COL] = newNode;

  node = newGrid[row][col];
  START_NODE_ROW = row;
  START_NODE_COL = col;
  newNode = {
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithFinishToggled = (grid, row, col) => {
  let newGrid = grid.slice();
  let node = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];
  let newNode = {
    ...node,
    isFinish: false,
  };
  newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = newNode;

  node = newGrid[row][col];
  FINISH_NODE_ROW = row;
  FINISH_NODE_COL = col;
  newNode = {
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
