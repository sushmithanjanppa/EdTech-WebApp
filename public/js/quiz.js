const questionButton = document.getElementById("questionButton");

questionButton.addEventListener("click", () => {
   alert("hello");
})

var solutions = ["A", "C","D", "A"],
   sum = solutions.length;

function getSolution(QuestID) {
  var answer = document.querySelector(
    "#" + QuestID + " input[type=radio]:checked"
  );

  if (answer === null) {
    document.querySelector("#" + QuestID + " .error").style.display =
      "inline";
  } else {
    document.querySelector("#" + QuestID + " .error").style.display =
      "";
    answer = answer.value;
  }

  return answer;
}

function getTotal() {
  var score = 0;

  for (var i = 0; i < sum; i++) {
    document.getElementById("set" + i).innerHTML = "";

    
    // console.log(document.querySelector(
    //   "#" + `section${i + 1}` + " input[type=radio]:checked"
    // ))    
    var subSolution = document.querySelector(
      "#" + `section${i + 1}` + " input[type=radio]:checked"
    ).nextElementSibling;
// console.log(subSolution)
    
    if (getSolution("section" + (i + 1)) == solutions[i]) {
      score += 1;
      subSolution.textContent = " (Correct!)";
    } else {
      subSolution.textContent = " (Incorrect!)";
    }
  }

  return score;
}

var getResults = function() {
  var x = document.getElementById("myText").value;
  var message = "";
  var isValid = true;

  if (getTotal() == 0)
   {
    message = "your score is 0%, Retake the Quiz";
  } 
  else if (getTotal() ==1 ) 
  {
    message = "your score is 30%, Retake the Quiz";
  } 
  else if (getTotal() ==2 ) 
  {
    message = "your score is 50%, Retake the Quiz";
  }
  else if (getTotal() ==3 ) 
  {
    message = "your score is 70%, You have passed!";
  }
  else if (getTotal() == 4) 
  {
    message = "Perfect.your score is 100% ,You have passed!";
  }

  return message;
};

function returnResults() {
  document.getElementById("results").innerHTML = getResults();
}
