
// Initialize Firebase
var config = {
    apiKey: "AIzaSyAkk3kJa-_WKjNrR-3YJJaPYFTngb2Mzjc",
    authDomain: "traintime-58da7.firebaseapp.com",
    databaseURL: "https://traintime-58da7.firebaseio.com",
    storageBucket: "traintime-58da7.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();

//-----------------------------------------------------------------------------------------------

// Adding new Train on submit button click
$("#addTrainButton").on("click", function (event) {
    event.preventDefault();

    // pull info from entry fields
    var trainName = $("#trainName").val().trim();
    var trainDest = $("#trainDest").val().trim();
    var trainTime = moment($("#trainTime").val().trim(), "HH:mm").format("X");
    var trainFreq = $("#trainFreq").val().trim();

    // create temporary object to hold new train info
    var newTrain = {
        name: trainName,
        destination: trainDest,
        time: trainTime,
        frequency: trainFreq
    };

    // push to firebase
    database.ref().push(newTrain);

    //console log to make sure it went through (maybe delete later)
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.time);
    console.log(newTrain.frequency);

    // notification alert if successful
    alert("Train successfully added");

    // clear entry fields
    $("#trainName").val("");
    $("#trainDest").val("");
    $("#trainTime").val("");
    $("#trainFreq").val("");
});

//-----------------------------------------------------------------------------------------------

database.ref().on("child_added", function (childSnapshot) {
    console.log(childSnapshot.val());

    // store snapshots into temp variables
    var trainName = childSnapshot.val().name;
    var trainDest = childSnapshot.val().destination;
    var trainTime = childSnapshot.val().time;
    var trainFreq = childSnapshot.val().frequency;

    // console log to make sure it went through (maybe delete later)
    console.log("Submitted Train Name: " + trainName);
    console.log("Submitted Train Destination: " + trainDest);
    console.log("Submitted Train Time: " + trainTime);
    console.log("Submitted Train Frequency: every " + trainFreq + " minutes");

    //properly format the train time
    var trainStartPretty = moment.unix(trainTime).format("HH:mm");
    console.log("First time: " + trainStartPretty);

    //converting the train Time (year subtraction)
    var firstTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
    console.log("First time converted: " + firstTimeConverted);

    // console log current time to make sure accurate
    var currentTime = moment();
    console.log("Current Time: " + moment(currentTime).format("HH:mm"));

    //calculating difference
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference: " + diffTime);

    //mod math
    var tRemainder = diffTime % trainFreq;
    console.log(tRemainder);

    //time until next train
    var timeUntilTrain = trainFreq - tRemainder;
    console.log("Minutes Until next Train: " + timeUntilTrain);

    // next train time
    var nextTrain = moment().add(timeUntilTrain, "minutes");
    console.log("Next Train Arrival Time: " + moment(nextTrain).format("hh:mm"));
    var nextTrainFormatted = moment(nextTrain).format("hh:mm");

//-----------------------------------------------------------------------------------------------

    // Create the new row
    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDest),
        $("<td>").text(trainFreq),
        $("<td>").text(nextTrainFormatted),
        $("<td>").text(timeUntilTrain)
    );

    // Append the new row to the table
    $("#newTrainTable > tbody").append(newRow);
});