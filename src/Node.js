import BaseElement from "./BaseElement";
import {nedGraph} from "./NedGraph";
import NodeInputGroup from "./NodeInputGroup";

export default class Node extends BaseElement{
  constructor(name){
    super();

    // DOM Element creation
    this.domElement = document.createElement('div');
    this.domElement.classList.add('node');
    this.domElement.setAttribute('title', name);

    // Create output visual
    var outDom = document.createElement('span');
    outDom.classList.add('output');
    outDom.innerHTML = '&nbsp;';
    this.domElement.appendChild(outDom);

    // Create input group container element
    this._inputGroupContainerElement = document.createElement("div");
    this._inputGroupContainerElement.classList.add("nodeInputGroupContainer");
    this.domElement.appendChild(this._inputGroupContainerElement);

    // Output Click handler
    outDom.onclick = (e) => this.onClick(e);

    // Node Stuffs
    this.name = name;
    this.value = '';
    this.inputGroups = {};
    this.connected = false;

    // SVG Connectors
    this.attachedPaths = [];

    // Add to nedGraph
    this.index = nedGraph.nodes.length;
    nedGraph.nodes.push(this);

    // Set class name as attribute
    this.domElement.setAttribute("data-nodeType",this.constructor.name);
  }

  onClick(e){
    if(nedGraph.mouse.currentInput &&
      !this.ownsInput(nedGraph.mouse.currentInput)){
      var tmp = nedGraph.mouse.currentInput;
      nedGraph.mouse.currentInput = null;
      this.connectTo(tmp);
    }
    e.stopPropagation();
  };

  getOutputPoint(){
    var tmp = this.domElement.firstElementChild;
    var offset = this.GetFullOffset(tmp);
    return {
      x: offset.left + tmp.offsetWidth / 2,
      y: offset.top + tmp.offsetHeight / 2
    };
  }

  detachInput(input){
    var index = -1;
    for(var i = 0; i < this.attachedPaths.length; i++){
      if(this.attachedPaths[i].input == input)
        index = i;
    };

    if(index >= 0){
      this.attachedPaths[index].path.removeAttribute('d');
      this.attachedPaths[index].input.node = null;
      this.attachedPaths.splice(index, 1);
    }

    if(this.attachedPaths.length <= 0){
      this.domElement.classList.remove('connected');
    }
  };

  ownsInput(input){
    for(var k in this.inputGroups){
      for(var i = 0; i < this.inputGroups[k].inputs.length; i++){
        if(this.inputGroups[k].inputs[i] == input)
          return true;
      }
    }
    return false;
  };

  updatePosition(){
    var outPoint = this.getOutputPoint();

    var aPaths = this.attachedPaths;
    for(var i = 0; i < aPaths.length; i++){
      var iPoint = aPaths[i].input.getAttachPoint();
      var pathStr = this.createPath(iPoint, outPoint);
      aPaths[i].path.setAttributeNS(null, 'd', pathStr);
    }

    for(var k in this.inputGroups){
      for(var j = 0; j < this.inputGroups[k].inputs.length; j++){
        if(this.inputGroups[k].inputs[j].node != null){
          var iP = this.inputGroups[k].inputs[j].getAttachPoint();
          var oP = this.inputGroups[k].inputs[j].node.getOutputPoint();

          var pStr = this.createPath(iP, oP);
          this.inputGroups[k].inputs[j].path.setAttributeNS(null, 'd', pStr);
        }
      }
    }
  }

  createPath(a, b){
    var diff = {
      x: b.x - a.x,
      y: b.y - a.y
    };

    var pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;

    return pathStr;
  };

  connectTo(input){
    input.node = this;
    this.connected = true;
    this.domElement.classList.add('connected');

    input.domElement.classList.remove('empty');
    input.domElement.classList.add('filled');

    this.attachedPaths.push({
      input: input,
      path: input.path
    });

    var iPoint = input.getAttachPoint();
    var oPoint = this.getOutputPoint();

    var pathStr = this.createPath(iPoint, oPoint);

    input.path.setAttributeNS(null, 'd',pathStr);
  }

  moveTo(point){
    this.domElement.style.top = point.y + 'px';
    this.domElement.style.left = point.x + 'px';
    this.updatePosition();
  };

  initUI() {
    // Make draggable
    $(this.domElement).draggable({
      containment: 'window',
      cancel: '.connection,.output',
      drag: (event, ui) => {
        this.updatePosition();
      }
    });
    // Fix positioning
    this.domElement.style.position = 'absolute';

    document.body.appendChild(this.domElement);
    // Update Visual
    this.updatePosition();
  }

  addInputGroup(name){
    let group = new NodeInputGroup(this,name);
    this.inputGroups[name] = group;
  }
}