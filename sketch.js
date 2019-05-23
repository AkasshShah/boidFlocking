const flock = [];
var alignSlider, cohesionSlider, separationSlider;
function setup() {
    createCanvas(640, 360);
    alignSlider = createSlider(0, 2, 1, 0.1);
    cohesionSlider = createSlider(0, 2, 1, 0.1);
    separationSlider = createSlider(0, 2, 1, 0.1);
    var numOfBoids = 200;
    for(let i=0; i<numOfBoids; i++) {
        flock.push(new Boid());
    }
}
var count=0;
function draw() {
    background(51);
    var j=0;
    // if(count < 100) {
    //     console.log("Count: "+count);
    // }
    // for(let boid of flock) {
    for(j=0; j<flock.length; j++) {
        boid = flock[j];
        // if(count < 100) {
        //     console.log("flock["+j+"]:");
        // }
        boid.flock1(flock);
        // boid.flock2(flock);
        boid.update();
        boid.edges();        
        boid.show();
        // if(count < 100) {
        //     console.log("\n");
        // }
    }
    count++;
}