import Node from "../../../src/Node";

export default class ModelNode extends Node{
  constructor(name){
    super(name);

    this.addInputGroup("Properties");
  }
}