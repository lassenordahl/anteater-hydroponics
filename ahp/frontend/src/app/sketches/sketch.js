import { tsConstructSignatureDeclaration } from "@babel/types";



export default function wrapper_sketch(health) {

  console.log(health);
  // 1 - 4 health for non map functions
  var step_health;

  if (health >= 75) {
    step_health = 4
  } else if (health >= 50) {
    step_health = 3;
  } else if (health > 25) {
    step_health = 2;
  } else {
    step_health = 1;
  }

  function healthFilterBranches(branch_points) {
    // Shuffle array
    console.log(step_health, branch_points.map((num) => {
      return Math.floor(num)
    }).sort(() => {
      return 0.5 - Math.random()
    }));
    return branch_points.map((num) => {
      return Math.floor(num)
    }).sort(() => {
      return 0.5 - Math.random()
    }).slice(-1 * step_health);
  }
  
  return function sketch (p) {
    let rotation = 0;

    let width = 200;
    let canvas_height = 400;
    let plant_height = 150 + ((health / 100) * 250);
    console.log(plant_height);
    // let plant_height = 300;
    let node_size = 5 + ((health / 100) * 5);

    // Filter out branches if health isn't great
    let branch_points = healthFilterBranches([
      plant_height / 4 + 50,
      plant_height / 4 + plant_height / 8 + 50,
      plant_height / 2 + 50,
      plant_height / 2 + plant_height / 8 + 50
    ]);
    console.log(branch_points);

    let branch_length = 50; // Branches will be 20 nodes long
    let branch_droopiness = 3 + Math.floor((health / 100) * 8);

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

    function inBranchPoints(node_height) {
      for (let i = 0; i < branch_points.length; i++) 
        if (node_height === branch_points[i]) 
          return [true, i % 2 === 0, i]; // Return if this was an odd or even node so we can render leaves on either side
      return [false, false]; // Will shortcircuit so the second value is useless
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
        height + node_size * (3 /2) - branchFunction(random_tomato_locations[tomato_index]) + 4, 
        node_size * 3, 
        node_size * 3
      );

      for (let i = 0; i < branch_length; i++) {
        if (i > (3 * (branch_length / 4)) && i % 20 == 0) {
          drawLeaf(
            w_a - (branch_to_left ? i : i * -1), 
            height - branchFunction(i),
            p.PI
          );
        }
      }
      // drawLeaf(
      //   w_a - (branch_to_left ? random_tomato_locations[tomato_index] : random_tomato_locations[tomato_index] * -1),
      //   height + node_size * (3 /2) - branchFunction(random_tomato_locations[tomato_index])
      // );
    }

    function drawLeaf(x, y, rotation) {
      p.fill('#228B22');
      p.strokeWeight(0);
      // p.scale(2);
      // p.translate(x, y);
      // p.rotate(rotation);
      //leaf shape
      p.beginShape();
      p.vertex(0, 0);
      p.vertex(7, -3);
      p.vertex(13, -2);
      p.vertex(16, 3);
      p.vertex(20, 20);
      p.vertex(3, 16);
      p.vertex(-2, 13);
      p.vertex(-3, 7);
      // p.vertex(x + 0, y + 0);
      // p.vertex(x + 7, y + -3);
      // p.vertex(x + 13, y + -2);
      // p.vertex(x + 16, y + 3);
      // p.vertex(x + 20, y + 20);
      // p.vertex(x + 3, y + 16);
      // p.vertex(x + -2, y + 13);
      // p.vertex(x + -3, y + 7);
      p.endShape();
      p.fill('#52bf61');
      // p.scale(.5);
      // p.translate(-1 * x, -1 * y);
      // p.rotate(-1 * rotation);
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
        p.fill('#52bf61');

        // Draw the main ellipse
        let w_a = width / 2 + -1 * p.sin(9/10 * (-1 * angle + offset_a)) * amplitude * (i / 1800);
        p.ellipse(w_a - 100, 250 - i, node_size, node_size);
        // p.ellipse(w_a - 100, i - (plant_height - canvas_height), node_size, node_size);

        // Draw the branches 
        const [is_branch, is_even_branch, tomato_index] = inBranchPoints(i);
        if (is_branch) {
          if (is_even_branch) {
            drawBranch(w_a - 100, 250 - i, true, tomato_index);
          } else {
            drawBranch(w_a - 100, 250 - i, false, tomato_index);
          }
        }

        // if (i > 100) {
        //   if ((i + 25) % 50 === 0) {
        //     drawLeaf(w_a - 100, 250 - i, p.PI);
        //   }
        //   if ((i + 25) % 25 === 0) {
        //     drawLeaf(w_a - 100, 250 - i, p.PI);
        //   }
        // }

        // Increment the offsets
        offset_a += .05;
        offset_b += .4;
      }

      angle += .03;
    } 
  }
};