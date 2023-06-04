const firebase =require("firebase/app");
import "firebase/auth";

function phoneSignIn() {
  function getPhoneNumberFromUserInput() {
    return "+9647705127299";
  }

  // [START auth_phone_signin]
  const phoneNumber = getPhoneNumberFromUserInput();
  firebase.auth().signInWithPhoneNumber(phoneNumber, "hello world")
    .then((confirmationResult) => {
      // SMS sent. Prompt user to type the code from the message, then sign the
      // user in with confirmationResult.confirm(code).
      window.confirmationResult = confirmationResult;
      // ...
    }).catch((error) => {
      // Error; SMS not sent
      // ...
    });
  // [END auth_phone_signin]
}

phoneSignIn();
