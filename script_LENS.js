let mcQueen;
// let latestPrediction = null;
let poseNet;
let poses = [];
let keypoints = [];
let interpolatedKeypoints = [];
var mySound;

function preload() {
  mcQueenImage = loadImage("/assets/kachow.png");
}

function setup() {
  createCanvas(960, 720);
  video = createCapture(VIDEO);
  video.size(width, height);

  // // ml5 function
  // let facemesh = ml5.facemesh(video, () => {
  //   console.log("Model is ready!");
  //   modelIsLoading = false;
  // });
  // // ml5 function
  // facemesh.on("predict", (results) => {
  //   // results is an Array
  //   // we care about the first object only
  //   // results[0]
  //   // console.log(results[0]);
  //   latestPrediction = results[0];
  // });

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, { flipHorizontal: true });
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
  // setup original keypoints
  createInitialKeypoints();
  // creates car object
  mcQueen = new Car();
  // creates sound
  mySound = new sound("/assets/kachow.mp3");
}

function updateKeypoints() {
  // If there are no poses, ignore it.
  if (poses.length <= 0) {
    return;
  }

  // Otherwise, let's update the points;
  let pose = poses[0].pose;
  keypoints = pose.keypoints;

  for (let kp = 0; kp < keypoints.length; kp++) {
    let oldKeypoint = interpolatedKeypoints[kp];
    let newKeypoint = keypoints[kp].position;

    let interpX = lerp(oldKeypoint.x, newKeypoint.x, 0.3);
    let interpY = lerp(oldKeypoint.y, newKeypoint.y, 0.3);

    let interpolatedKeypoint = { x: interpX, y: interpY };

    interpolatedKeypoints[kp] = interpolatedKeypoint;
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < interpolatedKeypoints.length; i++) {
    keypoint = interpolatedKeypoints[i];
    fill(255, 0, 0);
    text(i, keypoint.x, keypoint.y); // draw keypoint number on video
    // ellipse(keypoint.x, keypoint.y, 10, 10); // just draw red dots
  }
}

// Create default keypoints for interpolation easing
function createInitialKeypoints() {
  let numKeypoints = 17;
  for (let i = 0; i < numKeypoints; i++) {
    newKeypoint = { x: width / 2, y: height / 2 };
    interpolatedKeypoints.push(newKeypoint);
  }
}

// Move class
class Car {
  constructor() {
    this.x = width;
    this.y = 100;
    this.diameterX = 300;
    this.diameterY = 200;
    this.speed = 1;
  }
  move() {
    this.x -= 100;
    this.y -= 10;
    if(this.x < 0){
      this.x = width;
      this.y = 100;
    }
  }
  display() {
    image(mcQueenImage, this.x, this.y, this.diameterX, this.diameterY);
  }
}

//sound function
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
    this.sound.volume = .2;
  }
  this.stop = function(){
    this.sound.pause();
  }
}

function draw() {
  let flippedVideo = ml5.flipImage(video);
  image(flippedVideo, 0, 0, width, height);
  // if (latestPrediction == null) return;

  updateKeypoints();
  drawKeypoints();

  let leftWristPosition = interpolatedKeypoints[9];
  let rightWristPosition = interpolatedKeypoints[10];

  if((leftWristPosition.y < height/2) && (rightWristPosition.y < height/2)){
    mcQueen.move();
    mcQueen.display();
    mySound.play();
  }
  else{
    mySound.stop();
    tint(255);
  }

}
