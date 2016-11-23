export default class Mouse{
  constructor(){
    this.currentInput = null;

    window.onmousemove = (e) => {
      this.onMove(e);
    };

    window.onclick = (e) =>{
      this.onClick(e);
    };
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
  }

  onMove(e){
    if(this.currentInput){
      var p = this.currentInput.path;
      var iP = this.currentInput.getAttachPoint();
      var oP = {x: e.pageX, y: e.pageY};
      var s = this.createPath(iP, oP);
      p.setAttributeNS(null, 'd', s);
    }
  }

  onClick(e){
    if(this.currentInput){
      this.currentInput.path.removeAttribute('d');
      if(this.currentInput.node){
        this.currentInput.node.detachInput(this.currentInput);
      }
      this.currentInput = null;
    }
  }
}