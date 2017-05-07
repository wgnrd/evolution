var agents = [];
var food = [];
var agentNumber=10;
var avgSpeed=0;
var avgForce=0;
var d = 10;

function setup()
{
    //Create world
    createCanvas(displayWidth - 30, displayHeight /2);

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
    avgSpeed = 0;
    avgForce = 0;
    background(30);

    // console.log(agents[0].closestFood);

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

    for(var i = agents.length - 1; i >= 0; i--)
    {
        agents[i].boundaries();
        agents[i].seek();
        agents[i].update();
        agents[i].display();

        
        var newAgent = agents[i].clone();
        if(newAgent!=null)
        {
            agents.push(newAgent);
            agentNumber +=1;
        }
        avgForce += agents[i].dna[1];
        avgSpeed += agents[i].dna[0];
        
        if (agents[i].dead)
        {
            agents.splice(i,1);
        }
    }
    displayDebug();

}

function displayDebug()
{
    removeElements();
    var PSpeed = createP('Avg. Speed: '+ avgSpeed/agents.length);
    var PNumber = createP('Number of Agents: ' + agentNumber);
    var PForce = createP('Avg. Force: ' + avgForce/agents.length);
    var PAlive = createP('Agents alive: ' + agents.length);
    var PFood = createP('Food: ' + food.length)
}