import BaseElement from "./BaseElement";
import {nedGraph} from "./NedGraph";
import NodeInputGroup from "./NodeInputGroup";

export default class Node extends BaseElement{
  constructor(name){
    super();

    this.domElements = {};

    // DOM Element creation
    this.domElements.container = document.createElement('div');
    this.domElements.container.classList.add('node');
    this.domElements.container.setAttribute('title', name);

    // Create name display
    this.domElements.name = document.createElement("input");
    this.domElements.name.classList.add("nodeName");
    this.domElements.name.setAttribute("type","text");
    this.domElements.container.appendChild(this.domElements.name);
    this.domElements.name.ondblclick = (e) => this.handleNameDblClick(e);
    this.domElements.name.onkeyup = (e) => this.handleNameKeyup(e);

    // Create output visual
    this.domElements.output = document.createElement('span');
    this.domElements.output.classList.add('output');
    this.domElements.output.innerHTML = '&nbsp;';
    this.domElements.container.appendChild(this.domElements.output);

    // Create input group container element
    this.domElements.inputGroupContainer = document.createElement("div");
    this.domElements.inputGroupContainer.classList.add("nodeInputGroupContainer");
    this.domElements.container.appendChild(this.domElements.inputGroupContainer);

    // Output Click handler
    this.domElements.output.onclick = (e) => this.handleOutDomClick(e);

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
    this.domElements.container.setAttribute("data-nodeType",this.constructor.name);
  }

  get name(){
    return this._name;
  }
  set name(value){
    this._name = value;
    this.domElements.name.setAttribute("value",this._name);
  }

  handleNameDblClick(e){
    e.stopPropagation();

    this.domElements.name.focus();
  }

  handleNameKeyup(e){
    // Array of key codes that will trigger input submission
    let submitKeys = [13];
    // Array of key codes that will trigger input cancellation
    let cancelKeys = [27];

    if(submitKeys.indexOf(e.keyCode) >= 0){
      // Trigger name change
      this.name = this.domElements.name.value;
      this.domElements.name.blur();
    }
    else if(cancelKeys.indexOf(e.keyCode) >= 0){
      this.domElements.name.blur();
      this.domElements.name.value = this.name;
    }
  }

  handleOutDomClick(e){
    if(nedGraph.mouse.currentInput &&
      !this.ownsInput(nedGraph.mouse.currentInput)){
      let tmp = nedGraph.mouse.currentInput;
      nedGraph.mouse.currentInput = null;
      this.connectTo(tmp);
    }
    e.stopPropagation();
  };

  getOutputPoint(){
    let tmp = this.domElements.output;
    let offset = this.GetFullOffset(tmp);
    return {
      x: offset.left + tmp.offsetWidth / 2,
      y: offset.top + tmp.offsetHeight / 2
    };
  }

  detachInput(input){
    var index = -1;
    for(let i = 0; i < this.attachedPaths.length; i++){
      if(this.attachedPaths[i].input == input)
        index = i;
    };

    if(index >= 0){
      this.attachedPaths[index].path.removeAttribute('d');
      this.attachedPaths[index].input.node = null;
      this.attachedPaths.splice(index, 1);
    }

    if(this.attachedPaths.length <= 0){
      this.domElements.container.classList.remove('connected');
    }
  };

  ownsInput(input){
    for(let k in this.inputGroups){
      for(let i = 0; i < this.inputGroups[k].inputs.length; i++){
        if(this.inputGroups[k].inputs[i] == input)
          return true;
      }
    }
    return false;
  };

  updatePosition(){
    let outPoint = this.getOutputPoint();

    let aPaths = this.attachedPaths;
    for(let i = 0; i < aPaths.length; i++){
      let iPoint = aPaths[i].input.getAttachPoint();
      let pathStr = this.createPath(iPoint, outPoint);
      aPaths[i].path.setAttributeNS(null, 'd', pathStr);
    }

    for(let k in this.inputGroups){
      for(let j = 0; j < this.inputGroups[k].inputs.length; j++){
        if(this.inputGroups[k].inputs[j].node != null){
          let iP = this.inputGroups[k].inputs[j].getAttachPoint();
          let oP = this.inputGroups[k].inputs[j].node.getOutputPoint();

          let pStr = this.createPath(iP, oP);
          this.inputGroups[k].inputs[j].path.setAttributeNS(null, 'd', pStr);
        }
      }
    }
  }

  createPath(a, b){
    let diff = {
      x: b.x - a.x,
      y: b.y - a.y
    };

    let pathStr = 'M' + a.x + ',' + a.y + ' ';
    pathStr += 'C';
    pathStr += a.x + diff.x / 3 * 2 + ',' + a.y + ' ';
    pathStr += a.x + diff.x / 3 + ',' + b.y + ' ';
    pathStr += b.x + ',' + b.y;

    return pathStr;
  };

  connectTo(input){
    input.node = this;
    this.connected = true;
    this.domElements.container.classList.add('connected');

    input.domElement.classList.remove('empty');
    input.domElement.classList.add('filled');

    this.attachedPaths.push({
      input: input,
      path: input.path
    });

    let iPoint = input.getAttachPoint();
    let oPoint = this.getOutputPoint();

    let pathStr = this.createPath(iPoint, oPoint);

    input.path.setAttributeNS(null, 'd',pathStr);
  }

  moveTo(point){
    this.domElements.container.style.top = point.y + 'px';
    this.domElements.container.style.left = point.x + 'px';
    this.updatePosition();
  };

  initUI() {
    // Make draggable
    $(this.domElements.container).draggable({
      containment: 'window',
      cancel: '.connection,.output',
      drag: (event, ui) => {
        this.updatePosition();
      }
    });
    // Fix positioning
    this.domElements.container.style.position = 'absolute';

    document.body.appendChild(this.domElements.container);
    // Update Visual
    this.updatePosition();
  }

  addInputGroup(name){
    let group = new NodeInputGroup(this,name);
    this.inputGroups[name] = group;
  }
}