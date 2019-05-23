class Boid{
    constructor(){
        this.position=createVector(random(width), random(height));
        // this.position=createVector(width/2, height/2);
        this.velocity=p5.Vector.random2D();
        this.acceleration=createVector();
        this.maxForce = 1;
        this.maxSpeed = 4;
        this.minSpeed = 0.5;
        this.velocity.setMag(random(this.minSpeed, this.maxSpeed));
        // this.velocity.setMag(this.maxSpeed)
        this.alignPerceptionRadius=50;
        this.separationPerceptionRadius = 50;
        this.cohesionPerceptionRadius = 100;
    }
    edges() {
        if(this.position.x>width) {
            this.position.x=0;
        }
        else if(this.position.x<0) {
            this.position.x=width;
        }
        if(this.position.y>height) {
            this.position.y=0;
        }
        else if(this.position.y<0) {
            this.position.y=height;
        }
    }
    show() {
        strokeWeight(8);
        stroke(255);
        point(this.position.x,this.position.y);
    }
    update() {
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.acceleration.mult(0);
    }
    distBetweenBoids(other) {
        return(dist(this.position.x, this.position.y, other.position.x, other.position.y));
    }
    align(boids) {
        let perceptionRadius = this.alignPerceptionRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            // let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            let d = this.distBetweenBoids(other);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    separation(boids) {
        let perceptionRadius = this.separationPerceptionRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d * d);
                steering.add(diff);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    cohesion(boids) {
        let perceptionRadius = this.cohesionPerceptionRadius;
        let steering = createVector();
        let total = 0;
        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }
        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }
    flock2(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
    }
    flock1(boids) {
        var totalA = 0, totalB = 0, totalC = 0;
        var alignSteering = createVector();
        var cohesionSteering = createVector();
        var separationSteering = createVector();
        for(var i = 0; i<boids.length; i++) {
            let other=boids[i];
            if(other == this) {continue;}
            // let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            let d = this.distBetweenBoids(other);
            if(d < this.alignPerceptionRadius) {
                // alignSteering.add(this.align(other));
                alignSteering.add(other.velocity);
                totalA+=1;
            }
            if(d < this.cohesionPerceptionRadius) {
                // cohesionSteering.add(this.cohesion(other));
                cohesionSteering.add(other.position);
                totalB+=1;
            }
            if(d < this.separationPerceptionRadius) {
                // separationSteering.add(this.separation(other));
                separationSteering.add((p5.Vector.sub(this.position, other.position)).div(d*d));
                totalC+=1;
            }
            // futureSteeringVals[i] = [alignSteering, cohesionSteering, separationSteering];
        }
        if(totalA > 0) {
            alignSteering.div(totalA);
            alignSteering.setMag(this.maxSpeed);
            alignSteering.sub(this.velocity);            
            alignSteering.limit(this.maxForce);
        }
        if(totalB > 0) {
            cohesionSteering.div(totalB);
            cohesionSteering.sub(this.position);
            cohesionSteering.setMag(this.maxSpeed);
            cohesionSteering.sub(this.velocity);
            cohesionSteering.limit(this.maxForce);
        }
        if(totalC > 0) {
            separationSteering.div(totalC);
            separationSteering.setMag(this.maxSpeed);
            separationSteering.sub(this.velocity);
            separationSteering.limit(this.maxForce);
        }
        // sliders
        alignSteering.mult(alignSlider.value());
        cohesionSteering.mult(cohesionSlider.value());
        separationSteering.mult(separationSlider.value());
        // set stuff from here: acc
        this.acceleration.add(alignSteering);
        this.acceleration.add(cohesionSteering);
        this.acceleration.add(separationSteering);
    }    
}