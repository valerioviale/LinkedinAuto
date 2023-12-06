Linkedin = {
    config: {
        scrollDelay: 3000,
        actionDelay: 5000,
        nextPageDelay: 5000,
        maxRequests: -1,
        totalRequestsSent: 0,
        addNote: true,
        note: "Hey {{name}}, I'm looking forward to connecting with you!",
    },

    init: function (data, config) {
        console.info("INFO: script initialized on the page...");
        setTimeout(() => this.scrollBottom(data, config), config.actionDelay);
    },

    scrollBottom: function (data, config) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
    },

    scrollTop: function (data, config){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => this.inspect(data, config), config.scrollDelay);
    },

    inspect: function (data, config) {
        var totalRows = this.totalRows();
        if (totalRows >= 0) {
            this.compile(data, config);
        } else {
            this.complete(config);
        }
    },

    compile: function (data, config) {
        var buttons = document.querySelectorAll("button");
        var contents = document.querySelectorAll(".entity-result__content");
       
          // Logic for buttons
        data.pageButtons = [...buttons].filter(function (element) {
             var buttonText = element.textContent.trim();
            return buttonText === "Connect" || buttonText === "Follow" || buttonText === "Message";
     });

    // Logic for contents
        data.pageContents = [...contents].filter(function (element) {
        // Add logic to filter contents based on your criteria
        // For example, here I'm assuming checking if it contains "Follow" or "Message"
            var contentText = element.textContent.trim();
            return contentText.includes("Follow") || contentText.includes("Message");
            
    });
      
        if (!data.pageButtons || data.pageButtons.length === 0) {
            console.warn("ERROR: no connect, follow, or message buttons found on page!");
            console.info("INFO: moving to next page...");
            setTimeout(() => {
                this.nextPage(config);
            }, config.nextPageDelay);
        } else {
            data.pageButtonTotal = data.pageButtons.length;
            console.info("INFO: " + data.pageButtonTotal + " connect, follow, or message buttons found");
            data.pageButtonIndex = 0;
        
            var names = document.getElementsByClassName("entity-result__title-text");
            var namesArray = [...names].filter(function (element) {
                var parentText = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.textContent;
                return parentText.includes("Connect\n") || parentText.includes("Follow\n") || parentText.includes("Message\n");
            });
            data.connectNames = [...namesArray].map(function (element) {
                return element.innerText.split(" ")[0];
            });
        
            var results = document.querySelectorAll('.entity-result__title-text');
            data.profileInfo = [];
        
            results.forEach(function (element) {
                var parent = element.closest('.entity-result__content');
                if (parent) {
                    var profileLinkElement = parent.querySelector('.app-aware-link');
                    if (profileLinkElement) {
                        var profileInfo = {
                            name: element.innerText.split(" ")[0],
                            profileURL: profileLinkElement.href
                        };
                        data.profileInfo.push(profileInfo);
                    }
                }
            });
              // New logic to fetch URLs from elements with class '.entity-result__content'
            const contentElements = document.querySelectorAll('.entity-result__content');
            contentElements.forEach(element => {
            const profileLinkElement = element.querySelector('.app-aware-link');
            if (profileLinkElement) {
                const profileLink = profileLinkElement.href;
                console.log(profileLink);
       } 
    });
        
            setTimeout(() => {
                this.performAction(data, config);
            }, config.actionDelay);
        }
        
    },

    performAction: function (data, config) {
        if (config.maxRequests === 0) {
            this.complete(config);
        } else {
            var button = data.pageButtons[data.pageButtonIndex];
            var buttonText = button.textContent.trim();
    
            if (buttonText === "Connect") {
                // ... (existing logic remains unchanged)
            } else if (buttonText === "Follow" || buttonText === "Message") {
                var entityContentElements = document.querySelectorAll('.entity-result__content');
    
                entityContentElements.forEach(element => {
                    const profileLinkElement = element.querySelector('.app-aware-link');
                    if (profileLinkElement) {
                        const profileLink = profileLinkElement.href;
                        console.log(profileLink);
                        // You can add additional actions here if needed
    
                        // Open the profile link in the same tab and navigate back
                        window.open(profileLink, '_self');
                        setTimeout(() => {
                            window.history.back();
                        }, config.actionDelay * 2); // Adjust the delay as needed
                    }
                });
    
                // Update the index for the next button action
                if (data.pageButtonIndex === (data.pageButtonTotal - 1)) {
                    console.debug("DEBUG: all connections for the page done, going to next page in " + config.actionDelay + " ms");
                    setTimeout(() => this.nextPage(config), config.actionDelay);
                } else {
                    data.pageButtonIndex++;
                    console.debug("DEBUG: sending next invite in " + config.actionDelay + " ms");
                    setTimeout(() => this.performAction(data, config), config.actionDelay);
                }
            }
    
            // Additional logic and actions can be added here
            // ...
    
            // Update the index for the next button action if needed
            // ...
    
            // Call nextPage function when required
            // ...
        }
    },
    
    
    
    

    clickAddNote: function (data, config) {
        var buttons = document.querySelectorAll('button');
        var addNoteButton = Array.prototype.filter.call(buttons, function (el) {
            return el.textContent.trim() === 'Add a note';
        });

        if (addNoteButton && addNoteButton[0]) {
            addNoteButton[0].click();
            setTimeout(() => this.pasteNote(data, config), config.actionDelay);
        } else {
            setTimeout(() => this.clickDone(data, config), config.actionDelay);
        }
    },

    pasteNote: function (data, config) {
        noteTextBox = document.getElementById("custom-message");
        noteTextBox.value = config.note.replace("{{name}}", data.connectNames[data.pageButtonIndex]);
        noteTextBox.dispatchEvent(new Event('input', {
            bubbles: true
        }));
        console.debug("DEBUG: clicking send in popup, if present, in " + config.actionDelay + " ms");
        setTimeout(() => this.clickDone(data, config), config.actionDelay);
    },

    clickDone: function (data, config) {
        var buttons = document.querySelectorAll('button');
        var doneButton = Array.prototype.filter.call(buttons, function (el) {
            return el.textContent.trim() === 'Send';
        });

        if (doneButton && doneButton[0]) {
            console.debug("DEBUG: clicking send button to close popup");
            doneButton[0].click();
        } else {
            console.debug("DEBUG: send button not found, clicking close on the popup in " + config.actionDelay);
        }
        setTimeout(() => this.clickClose(data, config), config.actionDelay);
    },

    clickClose: function (data, config) {
        var closeButton = document.getElementsByClassName('artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view');
        if (closeButton && closeButton[0]) {
            closeButton[0].click();
        }
        console.info('INFO: invite sent to ' + (data.pageButtonIndex + 1) + ' out of ' + data.pageButtonTotal);
        config.maxRequests--;
        config.totalRequestsSent++;

        if (data.pageButtonIndex === (data.pageButtonTotal - 1)) {
            console.debug("DEBUG: all connections for the page done, going to next page in " + config.actionDelay + " ms");
            setTimeout(() => this.nextPage(config), config.actionDelay);
        } else {
            data.pageButtonIndex++;
            console.debug("DEBUG: sending next invite in " + config.actionDelay + " ms");
            setTimeout(() => this.performAction(data, config), config.actionDelay);
        }
    },

    nextPage: function (config) {
        var pagerButton = document.getElementsByClassName('artdeco-pagination__button--next');
        if (!pagerButton || pagerButton.length === 0 || pagerButton[0].hasAttribute('disabled')) {
            console.info("INFO: no next page button found!");
            return this.complete(config);
        }
        console.info("INFO: Going to next page...");
        pagerButton[0].click();
        setTimeout(() => this.init({}, config), config.nextPageDelay);
    },

    complete: function (config) {
        console.info('INFO: script completed after sending ' + config.totalRequestsSent + ' connection requests');
    },

    totalRows: function () {
        var search_results = document.getElementsByClassName('search-result');
        if (search_results && search_results.length != 0) {
            return search_results.length;
        } else {
            return 0;
        }
    }
}

Linkedin.init({}, Linkedin.config);
