import { tsConstructSignatureDeclaration } from "@babel/types";

export default function sketch (p) {
  let rotation = 0;

  let width = 200;
  let canvas_height = 400;
  let plant_height = 600;
  let node_size = 10;

  let branch_points = [
    plant_height / 4,
    plant_height / 4 + plant_height / 8,
    plant_height / 2,
    plant_height / 2 + plant_height / 8
  ];
  let branch_length = 50; // Branches will be 20 nodes long
  let branch_droopiness = 7;

  let random_tomato_locations = branch_points.map(function() {
    return Math.floor(Math.random() * (branch_length - 15)) + 20;
  });

  let angle = 0
  let amplitude = 30;
  let leaf_img_1;

  p.setup = function () {
    p.createCanvas(width, canvas_height, p.WEBGL);
    p.frameRate(60);
  };

  // p.preload = function () {
  //   leaf_img_1 = p.loadImage('./../assets/leaf.png', function() {
  //     alert('rendered the img');
  //   });
  // }

  p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    if (props.rotation){
      rotation = props.rotation * Math.PI / 180;
    }
  };

  function inBranchPoints(node_height) {
    for (let i = 0; i < branch_points.length; i++) 
      if (node_height === branch_points[i]) 
        return [true, i % 2 === 0, i]; // Return if this was an odd or even node so we can render leaves on either side
    return [false, false]; // Will shortcircuit so the second value is useless
  }

  function drawLeaf(x, y, reflect) { // draw a leaf as follows
    p.beginShape();
    p.vertex(x, y);
    p.vertex(x + (50 * (reflect ? -1 : 1)), y + 50);
    p.vertex(x, y + 50);
    // p.vertex(x + 50, y);
    p.endShape()
  }

  function branchFunction(index) {
    return branch_droopiness * Math.log(index);
  }

  function drawBranch(w_a, height, branch_to_left, tomato_index) {
    
    for (let i = 0; i < branch_length; i++) {
      p.ellipse(w_a - (branch_to_left ? i : i * -1), height - branchFunction(i), node_size, node_size);
      // p.ellipse(w_a - (branch_to_left ? i : i * -1), height - branchFunction(i), node_size, node_size);
    }

    p.fill('#ff6347');
    p.ellipse(
      w_a - (branch_to_left ? random_tomato_locations[tomato_index] : random_tomato_locations[tomato_index] * -1), 
      height + node_size * (3 /2) - branchFunction(random_tomato_locations[tomato_index]), 
      node_size * 3, 
      node_size * 3
    );
  }

  p.draw = function () {
    // if (p.frameCount % 60 !== 0) {
    //   return;
    // }
    // Clear the screen
    p.clear();

    // Declare offsets for the nodes
    let offset_a = 0;
    let offset_b = 0;

    // Set fill information for nodes
    p.noStroke();

    for (let i = 50; i < plant_height; i += 1) {
      // p.fill(255);
      p.fill('#52bf61');


      // Draw the main ellipse
      let w_a = width / 2 + p.sin(angle + offset_a) * amplitude * (10/i);
      p.ellipse(w_a - 100, i - (plant_height - canvas_height), node_size, node_size);

      // Draw the branches 
      const [is_branch, is_even_branch, tomato_index] = inBranchPoints(i);
      if (is_branch) {
        if (is_even_branch) {
          drawBranch(w_a - 100, i - (plant_height - canvas_height), true, tomato_index);
        } else {
          drawBranch(w_a - 100, i - (plant_height - canvas_height) , false, tomato_index);
        }
      }

      // Increment the offsets
      offset_a += .05;
      offset_b += .4;
    }

    angle += .03;
  } 
};