import Mouse from "./Mouse";
import Node from "./Node";
import NodeInput from "./NodeInput";


class NedGraph{
  constructor(){
    // SVG Setup
    this.svg = document.getElementById("nedGraph");
    this.svg.ns = this.svg.namespaceURI;

    this.mouse = new Mouse();

    this.nodes = [];
    this.nodeInputs = [];

    this._title = null;
    this._titleElement = null;

    this._header = document.createElement("div");
    this._header.id = "header";
    document.body.appendChild(this._header);

    this._supportedNodeTypes = {};
    this._nodeListContainer = document.createElement("div");
    this._nodeListContainer.classList.add("nodeListContainer");
    this._header.appendChild(this._nodeListContainer);
    this._addNodeElement = null;
    this._nodeListElement = null;
  }

  get title(){
    return this._title;
  }
  set title(value){
    this._title = value;
    this.updateTitleElement();
  }

  updateTitleElement(){
    if(!this._titleElement){
      // Create DOM element
      this._titleElement = document.createElement("div");
      this._titleElement.classList.add("nedTitle");
      this._titleElement.innerText = this._title;
      this._header.appendChild(this._titleElement);
    }
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

  addSupportedNodeType(name,nodeType){
    this._supportedNodeTypes[name] = nodeType;
    this.updateAddNodeUI();
  }

  updateAddNodeUI(){
    // Setup add node button if it doesn't already exist
    if(!this._addNodeElement){
      this._addNodeElement = document.createElement("div");
      this._addNodeElement.innerText = "+";
      this._addNodeElement.classList.add("addNode");
      this._addNodeElement.title = "Add Node";
      this._nodeListContainer.appendChild(this._addNodeElement);

      this._addNodeElement.onclick = (e) => this.handleAddNodeListClick(e);
    }

    // Setup containing element for the list of supported node types if it doesn't exist
    if(!this._nodeListElement){
      this._nodeListElement = document.createElement("div");
      this._nodeListElement.classList.add("nodeList","hide");
      this._nodeListContainer.appendChild(this._nodeListElement);
    }

    // Empty list of supported node types
    while (this._nodeListElement.firstChild) {
      this._nodeListElement.removeChild(this._nodeListElement.firstChild);
    }

    for(var i in this._supportedNodeTypes){
      let element = document.createElement("div");
      element.classList.add("nodeListItem");
      element.setAttribute("data-type",i);
      element.innerHTML = i;
      element.onclick = (e) => this.handleAddNodeTypeClick(e);
      this._nodeListElement.appendChild(element);
    }
  }

  handleAddNodeListClick(e){
    e.preventDefault();
    // If this._nodeListElement has the "hide" class then show the element
    if(this._nodeListElement.classList.contains("hide")){
      this._nodeListElement.classList.remove("hide");
    }
    else{
      this._nodeListElement.classList.add("hide");
    }
  }

  handleAddNodeTypeClick(e){
    e.preventDefault();

    let nodeListItem = e.target;

    let name = "New "+nodeListItem.dataset.type;
    let newNode = new this._supportedNodeTypes[nodeListItem.dataset.type](name);
    newNode.moveTo({x:100,y:100});
    newNode.initUI();
  }
}

export let nedGraph = new NedGraph();