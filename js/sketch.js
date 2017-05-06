var agents = [];
var food = [];
var agentID=10;

function setup()
{
    //Create world
    createCanvas(displayWidth - 30, displayHeight /1.3);

    for(i=0;i<80;i++)
    {
        var x = random(width);
        var y = random(height);
        food.push(createVector(x,y));
    }
    //Create agent
    // agent = new Agent(width/2, height/2);
    for(i=0; i<10;i++)
    {
        agents.push(new Agent(random(width), random(height)));
    }
}

function draw()
{
    background(30);
    //set target to mouse
    var target = createVector(mouseX, mouseY);
    for(i=food.length-1;i>0;i--)
    {
        noStroke();
        fill('yellow');
        ellipse(food[i].x, food[i].y , 5);
    }

    if (random()<0.08)
    {
        food.push(createVector(random(width), random(height)));
    }

    var maxmaxSpeed = 0;
    var allspeed = 0;
    for(var i = agents.length - 1; i >= 0; i--)
    {
        agents[i].seek();
        agents[i].update();
        agents[i].display();

        
        var newAgent = agents[i].clone();
        if(newAgent!=null)
        {
            agents.push(newAgent);
            agentID +=1;
            console.log(agentID);
        }

        allspeed += agents[i].maxSpeed;
        //Max. Max.Speed
        if (agents[i].maxSpeed > maxmaxSpeed)
        {
            maxmaxSpeed = agents[i].maxSpeed;
        }

        if (agents[i].dead)
        {
            agents.splice(i,1);
        }
    }

}