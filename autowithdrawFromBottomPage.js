// Find all "Connect" buttons and confirm buttons
var connectButtons = document.getElementsByClassName("invitation-card__action-btn artdeco-button artdeco-button--muted artdeco-button--3 artdeco-button--tertiary ember-view");
var confirmButton = document.getElementsByClassName("artdeco-modal__confirm-dialog-btn artdeco-button artdeco-button--2 artdeco-button--primary ember-view");

// Click "Connect" buttons and confirm
setInterval(() => {
  for (var i = connectButtons.length - 1; i >= 0; i--) {
    connectButtons[i].click();
    confirmButton[0].click();
  }
}, 4000);

// Withdraw invitations function
(function withdrawInvitations() {
  console.log("Started");
  var totalCount = 0;
  var invitationButtons = [];

  // Find all invitation buttons
  function findInvitationButtons() {
    invitationButtons = document.getElementsByClassName("artdeco-button__text");
  }

  // Withdraw one invitation at a time
  function withdrawOneInvitation() {
    console.log(invitationButtons);
    var invitationButtonIndex = 0;
    var invitationButtonCount = invitationButtons.length;

    while (invitationButtonIndex < invitationButtonCount) {
      var invitationButton = invitationButtons.item(invitationButtonIndex);
      console.log("IDX: " + invitationButtonIndex + " InvitationButton: ");

      // Click the invitation button and increment the count
      if (invitationButton) {
        setTimeout(function (button, index) {
          totalCount++;
          console.log("running.. click " + totalCount);
          button.click();

          // If all invitations are withdrawn, log done message, 
          // else find more invitations and run the function again.
          if (invitationButtonCount == index + 1) {
            console.log("Looking for new elements");
            setTimeout(function () {
              findInvitationButtons();

              if (invitationButtonCount == 0) {
                console.log("..........Done");
              } else {
                console.log("Rerun withdraw...");
                withdrawOneInvitation();
              }
            }, 5000);
          }
        }, invitationButtonIndex * 600, invitationButton, invitationButtonIndex);
      }

      invitationButtonIndex++;
    }
  }

  // Run the functions
  findInvitationButtons();
  withdrawOneInvitation();
})();