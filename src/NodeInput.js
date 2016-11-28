import BaseElement from "./BaseElement";
import {nedGraph} from "./NedGraph";

export default class NodeInput extends BaseElement{
  constructor(name){
    super();

    this.name = name;
    this.node = null;

    // The dom element, here is where we could add
    // different input types
    this.domElement = document.createElement('div');
    this.domElement.innerHTML = name;
    this.domElement.classList.add('connection');
    this.domElement.classList.add('empty');

    // SVG Connector
    this.path = document.createElementNS(nedGraph.svg.ns, 'path');
    this.path.setAttributeNS(null, 'stroke', '#8e8e8e');
    this.path.setAttributeNS(null, 'stroke-width', '2');
    this.path.setAttributeNS(null, 'fill', 'none');
    nedGraph.svg.appendChild(this.path);

    // DOM Event handlers
    this.domElement.onclick = (e) => {
      this.onClick(e);
    }

    // Add to nedGraph
    this.index = nedGraph.nodeInputs.length;
    nedGraph.nodeInputs.push(this);
  }

  onClick(e){
    var mouse = nedGraph.mouse;

    if(mouse.currentInput){
      if(mouse.currentInput.path.hasAttribute('d')) {
        mouse.currentInput.path.removeAttribute('d');
      }
      if(mouse.currentInput.node){
        mouse.currentInput.node.detachInput(mouse.currentInput);
        mouse.currentInput.node = null;
      }
    }
    mouse.currentInput = this;
    if(this.node){
      this.node.detachInput(this);
      this.domElement.classList.remove('filled');
      this.domElement.classList.add('empty');
    }
    e.stopPropagation();
  }

  getAttachPoint() {
    var offset = this.GetFullOffset(this.domElement);
    return {
      x: offset.left + this.domElement.offsetWidth - 2,
      y: offset.top + this.domElement.offsetHeight / 2
    }
  }
}