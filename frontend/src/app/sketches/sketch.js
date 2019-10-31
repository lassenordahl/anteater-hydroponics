export default function sketch (p) {
  let rotation = 0;

  let width = 200;
  let height = 400;
  let down = true

  let angle = 0
  let amplitude = 30;

  p.setup = function () {
    p.createCanvas(width, height, p.WEBGL);
    p.frameRate(60);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  function drawLeaf(x, y, reflect) { // draw a leaf as follows
    p.beginShape();
    p.vertex(x, y);
    p.vertex(x + (50 * (reflect ? -1 : 1)), y + 50);
    p.vertex(x, y + 50);
    // p.vertex(x + 50, y);
    p.endShape()
  }

  p.draw = function () {
    if (p.frameCount % 1 === 0) {
      p.clear();
      let offset_a = 0;
      let offset_b = 0;
      p.noStroke();
      p.fill(255);
      for (let i = 50; i < height; i += 1) {
          let w_a = width / 2 + p.sin(angle + offset_a) * amplitude * (10/i);
          p.ellipse(w_a - 100, i - 100, 5, 5)
          offset_a += .05;
          offset_b += .4;
      }
  
      angle += .03;
    } 
  };
};