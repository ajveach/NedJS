export default class BaseElement{
  // @todo create static utilities class to house this method
  GetFullOffset(element){
    if(!element){
      element = this.domElement;
    }

    var offset = {
      top: element.offsetTop,
      left: element.offsetLeft,
    };

    if(element.offsetParent){
      var po = this.GetFullOffset(element.offsetParent);
      offset.top += po.top;
      offset.left += po.left;
      return offset;
    }
    else
      return offset;
  }
}