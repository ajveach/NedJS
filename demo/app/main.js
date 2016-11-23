import NedGraph from "../../src/NedGraph";

let graph = new NedGraph("nedGraph");

// Node 1
let node = graph.addNode("Another One");
node.addInput('Value1');
node.addInput('Value2');
node.addInput('Value3');

// Node 2
let node2 = graph.addNode('Node 2');
node2.addInput('Text In');
node2.addInput('Value 5');

// Node 3
var node3 = graph.addNode('Something Else');
node3.addInput('Color4');
node3.addInput('Position');
node3.addInput('Noise Octaves');

node.moveTo({x: 150, y: 20});
node2.moveTo({x: 20, y: 70});
node3.moveTo({x:300, y:150});

// Connect Nodes
node.connectTo(node2.inputs[0]);
node3.connectTo(node2.inputs[1]);
node3.connectTo(node.inputs[0]);

// Add to DOM
node.initUI();
node2.initUI();
node3.initUI();