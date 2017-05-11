var agents = [];
var food = [];
var agentNumber = 10;
var d = 10;
var data = {};
var oldest = 0;
var dynasty = 1;
var avgSeperate = 0;
var timestamp = 0;
var bigdata = [];
var foodSpawnRate = 0.08;

var downloadChecked = false;
var starvingChecked = false;

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

    if ($('#checkboxDownload').prop('checked')){
        downloadChecked = true;
    }

}
function draw() {
    background('#1C2F3B');
    timestamp += 1;
    for (i = food.length - 1; i > 0; i--) {
        noStroke();
        fill('#f39c12');
        ellipse(food[i].x, food[i].y, 5);
    }
    if (random() < foodSpawnRate) {
        food.push(createVector(random(width), random(height)));
    }

    for (var i = agents.length - 1; i >= 0; i--) {
        agents[i].boundaries();
        agents[i].seek();
        if (!$('#checkboxSpreadForce').prop('checked')){
            agents[i].seperate(agents);
        }
        agents[i].update();
        agents[i].display();
        agents[i].age += 1;

        if (random()<agents[i].health*0.00001)
        {
            agents.push(agents[i].clone());
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
        if (agents.length == 0){
            dynasty += 1;

            // DOWNLOAD
            if (downloadChecked){
                var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bigdata));
                var dlAnchorElem = document.getElementById('downloadAnchorElem');
                dlAnchorElem.setAttribute("href",     dataStr     );
                dlAnchorElem.setAttribute("download", dynasty-1+"evolution.json");
                dlAnchorElem.click();
            }

            setup();
        }
    }
}

function newDynasty()
{
    agents.length = 0;
    food.length = 0;
    setup();
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
    avgSeperate = 0;
    
    for (var i = agents.length - 1; i >= 0; i--) {
        avgForce += agents[i].dna[1];
        avgSpeed += agents[i].dna[0];
        
        if (!$('#checkboxSpreadForce').prop('checked')){
            avgSeperate += agents[i].dna[3];
        }

        if (oldest <= agents[i].age / 60){
            oldest = (agents[i].age / 60).toFixed(2);
            agents[i].oldest = true;
        }
    }
    avgSeperate = (avgSeperate / agents.length).toFixed(2);
    avgForce = (avgForce / agents.length).toFixed(2);
    avgSpeed = (avgSpeed / agents.length).toFixed(2);
}

function displayDebug() {
    var html = '';
    data.d = [
        {key: 'Geschwindigkeit Ø', value: avgSpeed},
        {key: 'Wendigkeit Ø', value: avgForce},
        {key: 'Anzahl an \'Agnenten\'', value: agents.length},
        {key: 'Spread force Ø', value: avgSeperate},
        {key: 'Iteration', value: agentNumber},
        {key: 'Ältester (sek)', value: oldest},
        {key: 'Dynastie', value: dynasty}
    ];
    
    if (downloadChecked){
        for(i=0;i<data.d.length;i++)
        {
            bigdata.push(timestamp);
            bigdata.push(data.d[i]);
        }   
    }
    // Injecting data into table
    $('#debugInfoTable tr').not(':first').remove();
    for(var i = 0; i < data.d.length; i++)
        html += '<tr><td>' + data.d[i].key + '</td><td>' + data.d[i].value + '</td></tr>';
    $('#debugInfoTable tbody').first().append(html);


}

function windowResized() {
    resizeCanvas($('#world').width(), $('#world').height());
}