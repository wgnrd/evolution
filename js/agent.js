var sightCircleColor = '#334552';
var healthyColor = '#3498db';
var SickColor = '#d62c1a';

function Agent(x,y,dna)
{
    this.dna = [];
    this.acceleration = createVector(0,0);
    this.position = createVector(x,y);
    this.velocity = createVector(0,2);
    this.size = 3.5;
    this.health = 100;
    this.dead = false;
    this.age = 0;
    this.oldest = false;
    var desiredseparation = 100;

    if (dna == null)
    {
        //this.dna[0] = maxSpeed
        this.dna[0] = random(4);
        //this.dna[1] = maxForce
        this.dna[1] = random(0.1,0.3);
        //this.dna[2] = sight
        this.dna[2] = random(0,150);
        //this.dna[3] = wannaseperate
        this.dna[3] = random(-20,20);
    }else {
        this.dna[0] = dna[0];
        this.dna[0] += random(-0.5,0.5);

        this.dna[1] = dna[1];
        this.dna[1] += random(-0.05,0.05); 

        this.dna[2] = dna[2];
        this.dna[2] += random(-15,15);

        this.dna[3] = dna[3];
        this.dna[3] += random(-2,2);
    }

    var closestFood = p5.Vector;

    this.applyForce = function(force) {
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    };

    //Update the location of the agent
    this.update = function()
    {
        this.health -= 0.4;
        if(this.health <= 0)
        {
            this.dead = true;
        }
        // console.log(this.health)
        this.velocity.add(this.acceleration);
        // this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        // Reset accelerationelertion to 0 each cycle
        this.acceleration.mult(0);
    };
    this.boundaries = function() {

        var desired = null;
        //left side
        if (this.position.x < d) {
            desired = createVector(this.dna[0]*3, this.velocity.y);
        }
        //right side
        else if (this.position.x > width -d) {
            desired = createVector(-this.dna[0]*3, this.velocity.y);
        }

        //top side
        if (this.position.y < d) {
            
            desired = createVector(this.velocity.x, this.dna[0]*3);
        }
        //bottom side
        else if (this.position.y+this.velocity.y > height-d) {
            
            desired = createVector(this.velocity.x, -this.dna[0]*3);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.dna[0]);
            var steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.dna[1]);
            this.applyForce(steer);
        }
    };

    this.clone = function()
    {
        return new Agent(this.position.x,this.position.y, this.dna);
    }

    // STEER = desired - velocity
    this.seek = function()
    {
        var closest = Infinity;
        var closestIndex = Infinity;
        closestFood = createVector(this.position.x + this.velocity.x,this.position.y + this.velocity.y);
        var d = Infinity;

        for(i=food.length-1;i>0;i--)
        {
            d = dist(this.position.x, this.position.y,food[i].x, food[i].y);
            if (d < closest && d < this.dna[2])
            {   
                closest = d
                closestIndex = i;
                closestFood = food[i];
            }
        }
        if (closest < 7)
        {
            food.splice(closestIndex,1);
            this.health += 20;
        }
        if (food.length == 1)
        {
            return;
        }

        var desired = p5.Vector.sub(closestFood,this.position);
        
        // Scale to maximum speed
        desired.setMag(this.dna[0]);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired,this.velocity);
        steer.limit(this.dna[1]);  // Limit to maximum steering force
        
        this.applyForce(steer);
    };

    // Displays the agent in the world
    this.display = function(){

        var healthy = color(healthyColor);
        var sick = color(SickColor);

        var theta = this.velocity.heading() + PI/2;


        fill(lerpColor(sick,healthy,this.health/100));
        stroke(200);
        if(this.oldest){
            strokeWeight(2);}
        else{
            strokeWeight(0);}
        push();
        translate(this.position.x,this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.size*2);
        vertex(-this.size, this.size*2);
        vertex(this.size, this.size*2);
        endShape(CLOSE);
        pop();
        
        noFill();
        stroke(sightCircleColor);
        strokeWeight(1);
        
        // ellipse(this.position.x, this.position.y, this.dna[2]*2);
        ellipse(this.position.x, this.position.y, this.dna[2]*2);
        
    };

    this.seperate = function(agents){
        var sepForce = this.DoSeparate(agents);
        this.applyForce(sepForce);
    }

     // Separation
  // Method checks for nearby vehicles and steers away
  this.DoSeparate = function(agents) {
    var sum = createVector();
    var count = 0;
    // For every boid in the system, check if it's too close
    for (var i = 0; i < agents.length; i++) {
      var d = p5.Vector.dist(this.position, agents[i].position);
      // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
      if ((d > 0) && (d < this.dna[2])) {
        // Calculate vector pointing away from neighbor
        var diff = p5.Vector.sub(this.position, agents[i].position);
        diff.normalize();
        diff.div((d/3)+this.dna[3]);        // Weight by distance
        
        sum.add(diff);
        count++;            // Keep track of how many
      }
    }
    // Average -- divide by how many
    if (count > 0) {
      sum.div(count);
      // Our desired vector is the average scaled to maximum speed
      sum.normalize();
      sum.mult(this.dna[0]);
      // Implement Reynolds: Steering = Desired - Velocity
      sum.sub(this.velocity);
      sum.limit(this.dna[1]);
    }
    return sum;
  };
}