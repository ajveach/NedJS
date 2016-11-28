import NodeInput from "./NodeInput";

export default class NodeInputGroup{
  constructor(node,name){
    this.inputs = [];

    this.node = node;
    this.domElements = {};

    // Create container element
    let containerElement = document.createElement("div");
    containerElement.classList.add("nodeInputGroup");
    this.node.domElements.inputGroupContainer.appendChild(containerElement);
    this.domElements.container = containerElement;

    // Create add input element
    let addInputElement = document.createElement("div");
    addInputElement.classList.add("addNodeInputButton");
    addInputElement.onclick = (e) => this.handleAddInputButtonClick(e);
    this.domElements.container.appendChild(addInputElement);
    this.domElements.addInputElement = addInputElement;

    // Create inputs list
    let inputList = document.createElement("div");
    inputList.classList.add("nodeInputList");
    this.domElements.container.appendChild(inputList);
    this.domElements.inputList = inputList;

    // Set title
    this.name = name;
  }

  get name(){
    return this._name;
  }

  set name(value){
    this._name = value;
    this.updateTitle();
  }

  updateTitle(){
    this.domElements["container"].setAttribute("title",this._name);
  }

  addInput(name){
    var input = new NodeInput(name);
    this.inputs.push(input);
    this.domElements.inputList.appendChild(input.domElement);

    return input;
  };

  handleAddInputButtonClick(e){
    e.preventDefault();

    this.addInput("New Input");
  }
}