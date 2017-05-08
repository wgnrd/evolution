var agents = [];
var food = [];
var agentNumber = 10;
var d = 10;
var data = {};
var oldest = 0;

function setup() {
    var avgForce = 0;
    var avgSpeed = 0;

    //Create world
    var canvas = createCanvas($('#world').width(), $('#world').height());
    canvas.parent('world');
    for (i = 0; i < 80; i++) {
        var x = random(width);
        var y = random(height);
        food.push(createVector(x, y));
    }

    for (i = 0; i < 10; i++) {
        agents.push(new Agent(random(width), random(height)));
    }
    updateInfo();
    displayDebug();
}
function draw() {
    background('#1C2F3B');
    console.log();
    for (i = food.length - 1; i > 0; i--) {
        noStroke();
        fill('#f39c12');
        ellipse(food[i].x, food[i].y, 5);
    }

    if (random() < 0.08) {
        food.push(createVector(random(width), random(height)));
    }

    for (var i = agents.length - 1; i >= 0; i--) {
        agents[i].boundaries();
        agents[i].seek();
        agents[i].update();
        agents[i].display();
        agents[i].age += 1;

        var newAgent = agents[i].clone();
        if (newAgent != null) {
            agents.push(newAgent);
            agentNumber += 1;
            updateInfo();
            displayDebug();
        }
        if (agents[i].dead) {
            agents.splice(i, 1);
            
            findOldestAgent();

            updateInfo();
            displayDebug();
        }
    }
}

function findOldestAgent()
{
    oldest = 0;
    for (var i = agents.length - 1; i >= 0; i--) {
        if (oldest <= agents[i].age / 60){
            oldest = (agents[i].age / 60).toFixed(2);
        }
    } 
}
function updateInfo() {

    avgSpeed = 0;
    avgForce = 0;
    
    for (var i = agents.length - 1; i >= 0; i--) {
        avgForce += agents[i].dna[1];
        avgSpeed += agents[i].dna[0];

        if (oldest <= agents[i].age / 60){
            oldest = (agents[i].age / 60).toFixed(2);
            agents[i].oldest = true;
        }
    }

    avgForce = (avgForce / agents.length).toFixed(2);
    avgSpeed = (avgSpeed / agents.length).toFixed(2);
}

function displayDebug() {
    var html = '';
    data.d = [
        {key: 'Geschwindigkeit Ø', value: avgSpeed},
        {key: 'Wendigkeit Ø', value: avgForce},
        {key: 'Anzahl an \'Agnenten\'', value: agents.length},
        {key: 'Iteration', value: agentNumber},
        {key: 'Ältester (sek)', value: oldest}
    ];

    // Injecting data into table
    $('#debugInfoTable tr').not(':first').remove();
    for(var i = 0; i < data.d.length; i++)
        html += '<tr><td>' + data.d[i].key + '</td><td>' + data.d[i].value + '</td></tr>';
    $('#debugInfoTable tbody').first().append(html);

}

function windowResized() {
    resizeCanvas($('#world').width(), $('#world').height());
}