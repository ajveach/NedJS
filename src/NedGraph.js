import Mouse from "./Mouse";
import Node from "./Node";
import NodeInput from "./NodeInput";


export default class NedGraph{
  constructor(id){
    // SVG Setup
    this.svg = document.getElementById(id);
    this.svg.ns = this.svg.namespaceURI;

    this.mouse = new Mouse();

    this.nodes = {};
    this.nodeInputs = {};
  }

  addNode(name){
    var node = new Node(name);
    node._nedGraph = this;
    this.nodes[name] = node;

    return node;
  }

  addNodeInput(name){
    var nodeInput = new NodeInput(name, this);
    this.nodeInputs[name] = nodeInput;

    return nodeInput;
  }
}