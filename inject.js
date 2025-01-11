chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === "ping") {
    sendResponse({ type: "pong", status: true });
  } else if (request.type === "question") {
    get_question().then(question => {
      sendResponse({ question, status: true });
    });
    return true;
  } else if (request.type === "submission") {
    if (submitted) {
      submitted = false;
      get_question().then(question => {
        sendResponse({ submitted: true, question, status: true });
      });
      return true;
    } else {
      sendResponse({ submitted, status: true });
    }
  }
});

let submitted = false;
function submissionListener() {
  submitted = true;
}

function addSubmissionListener() {
  try {
    const submitButton = document.querySelector(
      "[class*='coding-question-footer__submit-btn']"
    );
    if (submitButton) {
      submitButton.addEventListener("click", submissionListener);
    }
  } catch (e) {
    // console.log(e);
  }
}
setInterval(addSubmissionListener, 2000);

async function get_question() {
  const siteUrl = window.location.href;
  const urlParts = siteUrl.split("/");

  const testWord = urlParts.indexOf("test");
  const testId = urlParts[testWord + 1];

  const questionWord = urlParts.indexOf("questions");

  let questionId = "DOESNOTEXIST";

  if (questionWord !== urlParts.length - 1) {
    questionId = urlParts[questionWord + 1];
  }

  // Get the question
  const question = await fetch(
    `https://www.hackerrank.com/recruit/tests/${testId}`
  );

  return { question: await question.json(), questionId, testId };
}
