function Agent(x,y,dna)
{
    this.dna = [];
    this.acceleration = createVector(0,0);
    this.position = createVector(x,y);
    this.velocity = createVector(0,2);
    if (dna == null)
    {
        this.maxSpeed = random(4);
        this.maxForce = random(0.1,0.3);
    }else {
        this.maxSpeed = dna[0];
        this.maxForce = dna[1]
        this.maxForce += random(-0.05,0.05);
        this.maxSpeed += random(-0.5,0.5); 
    }
    this.size = 3.5;
    this.health = 100;
    this.sight = 100;
    this.dead = false;
    this.dna[0] = this.maxSpeed;
    this.dna[1] = this.maxForce;

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

    this.clone = function()
    {
        if (random()<this.health*0.00001)
        {
            return new Agent(this.position.x,this.position.y, this.dna)
        }else{
            return null;
        }
    }

    // STEER = desired - velocity
    this.seek = function()
    {
        var closest = Infinity;
        var closestIndex = Infinity;
        var closestFood = this.velocity;
        var d = Infinity;
        for(i=food.length-1;i>0;i--)
        {
            d = dist(this.position.x, this.position.y,food[i].x, food[i].y);
            if (d < closest)
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
        desired.setMag(this.maxSpeed);

        // Steering = Desired minus velocity
        var steer = p5.Vector.sub(desired,this.velocity);
        steer.limit(this.maxForce);  // Limit to maximum steering force
        
        this.applyForce(steer);
    };

    // Displays the agent in the world
    this.display = function()
    {
        // console.log(this.health/100);
        var healthy = color('green');
        var sick = color('red');
        var theta = this.velocity.heading() + PI/2;
        fill(lerpColor(sick,healthy,this.health/100));
       
        stroke(200);
        strokeWeight(0);
        push();
        translate(this.position.x,this.position.y);
        rotate(theta);
        beginShape();
        vertex(0, -this.size*2);
        vertex(-this.size, this.size*2);
        vertex(this.size, this.size*2);
        endShape(CLOSE);
        pop();
    };
}