import Node from "../../src/Node";
import ModelNode from "./nodeTypes/ModelNode";
import ControllerNode from "./nodeTypes/ControllerNode";
import {nedGraph} from "../../src/NedGraph";

nedGraph.title = "NedJS Demo";

nedGraph.addSupportedNodeType("Controller",ControllerNode);
nedGraph.addSupportedNodeType("Model",ModelNode);

// Node 1
// let node = new Node("Another One");
// node.addInput('Value1');
// node.addInput('Value2');
// node.addInput('Value3');
//
// // Node 2
// let node2 = new Node("Node 2");
// node2.addInput('Text In');
// node2.addInput('Value 5');
//
// // Node 3
// let node3 = new Node('Something Else');
// node3.addInput('Color4');
// node3.addInput('Position');
// node3.addInput('Noise Octaves');
//
// node.moveTo({x: 250, y: 160});
// node2.moveTo({x: 400, y: 90});
// node3.moveTo({x:500, y:240});
//
//
// // Connect Nodes
// node.connectTo(node2.inputs[0]);
// node3.connectTo(node2.inputs[1]);
// node3.connectTo(node.inputs[0]);
//
// // Add to DOM
// node.initUI();
// node2.initUI();
// node3.initUI();