import Node from "../../../src/Node";

export default class ControllerNode extends Node{
  constructor(name){
    super(name);

    this.addInputGroup("Models");
  }
}