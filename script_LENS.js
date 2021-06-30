let mcQueen;
let latestPrediction = null;

function preload() {
  mcQueenImage = loadImage("/assets/kachow.png");
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  // ml5 function
  let facemesh = ml5.facemesh(video, () => {
    console.log("Model is ready!");
    modelIsLoading = false;
  });
  // ml5 function
  facemesh.on("predict", (results) => {
    // results is an Array
    // we care about the first object only
    // results[0]
    // console.log(results[0]);
    latestPrediction = results[0];
  });
  video.hide();
  mcQueen = new Car();
}

// Move class
class Car {
  constructor() {
    this.x = 450;
    this.y = 100;
    this.diameterX = 300;
    this.diameterY = 200;
    this.speed = 1;
  }
  move() {
    this.x -= 5;
    this.y -= 1;
  }
  display() {
    image(mcQueenImage, this.x, this.y, this.diameterX, this.diameterY);
  }
}

function draw() {
  let flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0, width, height);
  if (latestPrediction == null) return;
  mcQueen.move();
  mcQueen.display();
}
