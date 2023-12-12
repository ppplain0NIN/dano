let socket;

let txt;
let tokens;
let counts;
let osc;
let db;
let group = "soundGame";
let typeOfThing = "word";

function preload() {
  // txt = "length of the word nononononono o o o o";
  // tokens = txt.split(" ");
  // counts = tokens.map((word) => word.length);
}

function setup() {
  console.log("ht")
  createCanvas(1000, 500);
  background(200);

  connectToFirebase();

  //Connect to the server
  //socket = io.connect("http://localhost:3000");

  osc = new p5.Oscillator("sine");

  // Create an input field
  input = createInput();
  input.position(20, height + 20);
  input.size(200);
  input.attribute("placeholder", "Enter a sentence");
  input.changed (function(){
    sendToFirebase(input.value());
    playSounds(input.value());
  });

}

function draw() {
  // Your drawing logic, if needed
}

function connectToFirebase() {
  //put in all the secret stuff and get an object to work with
  const firebaseConfig = {
    apiKey: "AIzaSyCqjjXaXu-VuZZ2Hj1YriHc3fRA02ujbXA",
    authDomain: "sharedmindhi.firebaseapp.com",
    databaseURL: "https://sharedmindhi-default-rtdb.firebaseio.com",
    projectId: "sharedmindhi",
    storageBucket: "sharedmindhi.appspot.com",
    messagingSenderId: "556118915099",
    appId: "1:556118915099:web:40cd773bb341c7cb3de0be",
    measurementId: "G-R7H5B2DEEH",
  };
  const app = firebase.initializeApp(firebaseConfig);
  db = app.database();
}

function sendToFirebase(localText) {
  //when I type something, send to server and everyone
  let mydata = {
    // location: { x: pos.x, y: pos.y + textSize() },
    text: localText
  };
 db.ref("group/" + group + "/" + typeOfThing + "/").push(mydata);
}

function subscribeToFirebase() {
  //all the stuff and future  changes from server
  var myRef = db.ref("group/" + group + "/" + typeOfThing + "/");
  myRef.on("child_added", (data) => {
    console.log("add", data.key, data.val());
   // let key = data.key;
    let value = data.val();
    let theySaid = value.text;
    playSounds(theySaid) ;
    ///???????????????????
  });

  myRef.on("child_changed", (data) => {
    console.log("changed", data.key, data.val());

  });

  myRef.on("child_removed", (data) => {
    console.log("removed", data.key);
  });
}


function playOscillatorWithWordLength(wordlength) {
  let frequency = random(100, 1000);
  let squareColor = frequencyToColor(frequency);

  osc.freq(frequency);
  osc.start();
  osc.amp(0.5, 0.1); // Adjust the amplitude as needed

  setTimeout(() => {
    osc.amp(0, 0.5);
    drawSquare(squareColor);

    //Emit playSound event to the server
    socket.emit("playSound", { frequency, squareColor });
  }, wordlength * 1000);
}

function drawSquare(squareColor) {
  fill(squareColor);
  rect(random(width), random(height), 5, 5);
}

function frequencyToColor(frequency) {
  let hue = map(frequency, 100, 1000, 0, 255);
  let saturation = map(frequency, 100, 1000, 98, 100); // Adjust the range as needed
  let brightness = map(frequency, 100, 1000, 80, 100); // Adjust the range as needed

  return color(hue, saturation, brightness);
}

/// wait /delay// and repeat the Oschillator according to the number of the tokens? counts?

function playSounds(userInput) {
  // Get user input from the input field
  // let userInput = input.value();
  tokens = userInput.split(" ");
  counts = tokens.map((word) => word.length);

  let waitTime = 0;

  for (let i = 0; i < counts.length; i++) {
    setTimeout(() => {
      doSomething();
      playOscillatorWithWordLength(counts[i]);
    }, waitTime * 100);
    waitTime += counts[i];
  }
}

function doSomething() {
  console.log("play tone");
}

change to input prompt lines
// function mousePressed() {
//   playSounds();
// }
