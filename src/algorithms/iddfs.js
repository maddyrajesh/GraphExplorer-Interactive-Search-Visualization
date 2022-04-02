import {getUnvisitedNeighbors} from '../algorithms/djikstra';
const NUM_COLUMNS = 50;
const NUM_ROWS = 20;

var MAX_DEPTH = 0;
var visitedNodesInOrder = [];
var finished = 0;

export function IDDFS(grid, startNode, finishNode) {
  visitedNodesInOrder = [];
  MAX_DEPTH = NUM_COLUMNS * NUM_ROWS;

  for (let i = 0; i <= MAX_DEPTH; i++) {
    //var newgrid = JSON.parse(JSON.stringify(grid));
    //console.log(grid);
    //var bool = DLS(newgrid, startNode, finishNode, i);
    var bool = DLS(grid, startNode, finishNode, i);
    if (bool === true) return visitedNodesInOrder;
    visitedNodesInOrder = resetVisitedNodes(visitedNodesInOrder);
    //console.log(visitedNodesInOrder);
  }

  return visitedNodesInOrder;
}

function resetVisitedNodes(visited) {
  for (var node of visited) {
    node.visited = false;
  }
  return visited;
}

function DLS(grid, startNode, finishNode, limit) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }

  if (startNode === finishNode) {
    finished = 1;
    return true;
  }

  if (limit <= 0) return false;

  if (startNode.isWall) return false;

  startNode.visited = true;
  if (!visitedNodesInOrder.includes(startNode)) {
    visitedNodesInOrder.push(startNode);
  }

  var unvisitedNeighbours = getUnvisitedNeighbors(startNode, grid);

  for (var neighbour of unvisitedNeighbours) {
    if (!neighbour.isWall && !neighbour.visited) {
      neighbour.previousNode = startNode;
      if (finished === 1) {
        return true;
      }
      if (DLS(grid, neighbour, finishNode, limit - 1)) {
        return true;
      }
      if (finished === 1) {
        return true;
      }
    }
  }

  return false;
}
