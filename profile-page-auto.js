// Define the LinkedIn object
Linkedin = {
    // Configuration settings for the script
    config: {
        scrollDelay: 3000, // Delay for scrolling
        actionDelay: 5000, // Delay for various actions
        nextPageDelay: 5000, // Delay before moving to the next page
        maxRequests: 1, // Maximum number of requests (-1 for no limit)
        totalRequestsSent: 0, // Total number of requests sent
        addNote: true, // Option to add a note in invites
        note: "Hi, I'm looking forward to connect with you!", // Default note
    },

    // Initialization function
    init: function (data, config) {
        console.info("INFO: script initialized on the page...");
        console.debug("DEBUG: scrolling to bottom in " + config.scrollDelay + " ms");
        setTimeout(() => this.scrollBottom(data, config), config.actionDelay);
    },

    // Scroll to the bottom of the page
    scrollBottom: function (data, config) {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        console.debug("DEBUG: scrolling to top in " + config.scrollDelay + " ms");
        setTimeout(() => this.scrollTop(data, config), config.scrollDelay);
    },

    // Scroll to the top of the page
    scrollTop: function (data, config){
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.debug("DEBUG: inspecting elements in " + config.scrollDelay + " ms");
        setTimeout(() => this.inspect(data, config), config.scrollDelay);
    },

    // Inspect function to check search results
    inspect: function (data, config) {
        var totalRows = this.totalRows(); 
        console.debug("DEBUG: total search results found on page are " + totalRows);
        if (totalRows >= 0) {
            this.compile(data, config);
        } else {
            console.warn("WARN: end of search results!");
            this.complete(config);
        }
    },

    // Compile function to process page elements
    compile: function (data, config) {
        // Select all buttons on the page
        var elements = document.querySelectorAll('button');
        data.pageButtons = [...elements].filter(function (element) {
            return element.textContent.trim() === "Connect";
        });

        // Check if connect buttons are found on the page
        if (!data.pageButtons || data.pageButtons.length === 0) {
            console.warn("ERROR: no connect buttons found on page!");
            console.info("INFO: moving to next page...");
            setTimeout(() => { this.nextPage(config) }, config.nextPageDelay);
        } else {
            // Process found connect buttons
            data.pageButtonTotal = data.pageButtons.length;
            console.info("INFO: " + data.pageButtonTotal + " connect buttons found");
            data.pageButtonIndex = 0;

            // Extract names of profiles to connect with
            var names = document.getElementsByClassName("entity-result__title-text");
            names = [...names].filter(function (element) {
                return element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.textContent.includes("Connect\n");
            });
            data.connectNames = [...names].map(function (element) {
                return element.innerText.split(" ")[0];
            });

            // Start sending invites
            console.debug("DEBUG: starting to send invites in " + config.actionDelay + " ms");
            setTimeout(() => { this.sendInvites(data, config) }, config.actionDelay);
        }
    },

    // Send invitation function
    // Send invitation function
sendInvites: function (data, config) {
    console.debug("remaining requests " + config.maxRequests);
    if (config.maxRequests == 0) {
        console.info("INFO: max requests reached for the script run!");
        this.complete(config);
    } else {
        console.debug('DEBUG: sending invite to ' + (data.pageButtonIndex + 1) + ' out of ' + data.pageButtonTotal);
        var button = data.pageButtons[data.pageButtonIndex];
        button.click();
        if (config.addNote && config.note) {
            console.debug("DEBUG: clicking Add a note in popup, if present, in " + config.actionDelay + " ms");
            setTimeout(() => this.clickAddNote(data, config), config.actionDelay);
        } else {
            console.debug("DEBUG: clicking done in popup, if present, in " + config.actionDelay + " ms");
            setTimeout(() => this.clickDone(data, config), config.actionDelay);
        }
    }
},


// Function to open dropdown and click "Connect" button
openDropdownAndConnect: function (data, config) {
    // Find the dropdown menu
    var dropdownMenu = document.querySelector('.artdeco-dropdown');
    if (dropdownMenu) {
        // Open the dropdown menu
        dropdownMenu.click();

        // Wait for the dropdown menu to fully open
        setTimeout(() => {
            // Find the "Connect" button inside the dropdown menu
            var connectButton = dropdownMenu.querySelector('button[aria-label="Connect"]');
            if (connectButton) {
                // Click on the "Connect" button inside the dropdown menu
                connectButton.click();

                // Continue with the original code to handle the invitation popup
                setTimeout(() => this.clickClose(data, config), config.actionDelay);
            } else {
                console.warn("WARNING: Connect button not found inside dropdown.");
                // Continue with the original code to handle the invitation popup without clicking the Connect button
                setTimeout(() => this.clickClose(data, config), config.actionDelay);
            }
        }, 500);
    } else {
        console.warn("WARNING: Dropdown menu not found.");
        // Continue with the original code to handle the invitation popup without opening the dropdown menu
        setTimeout(() => this.clickClose(data, config), config.actionDelay);
    }
},

// Updated sendInvites function to call openDropdownAndConnect
sendInvites: function (data, config) {
    console.debug("remaining requests " + config.maxRequests);
    if (config.maxRequests == 0) {
        console.info("INFO: max requests reached for the script run!");
        this.complete(config);
    } else {
        console.debug('DEBUG: sending invite to ' + (data.pageButtonIndex + 1) + ' out of ' + data.pageButtonTotal);
        var button = data.pageButtons[data.pageButtonIndex];
        button.click();
        if (config.addNote && config.note) {
            console.debug("DEBUG: clicking Add a note in popup, if present, in " + config.actionDelay + " ms");
            setTimeout(() => this.clickAddNote(data, config), config.actionDelay);
        } else {
            console.debug("DEBUG: opening dropdown and clicking Connect in " + config.actionDelay + " ms");
            setTimeout(() => this.openDropdownAndConnect(data, config), config.actionDelay);
        }
    }
},
    // Function to click "Add a note" button in the invitation popup
    clickAddNote: function (data, config) {
        var buttons = document.querySelectorAll('button');
        var addNoteButton = Array.prototype.filter.call(buttons, function (el) {
            return el.textContent.trim() === 'Add a note';
        });

        // Adding note if required
        if (addNoteButton && addNoteButton[0]) {
            console.debug("DEBUG: clicking add a note button to paste note");
            addNoteButton[0].click();
            console.debug("DEBUG: pasting note in " + config.actionDelay);
            setTimeout(() => this.pasteNote(data, config), config.actionDelay);
        } else {
            console.debug("DEBUG: add note button not found, clicking send on the popup in " + config.actionDelay);
            setTimeout(() => this.clickDone(data, config), config.actionDelay);
        }
    },

    // Function to paste the note into the invitation popup
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
        // Find the "Connect" button inside the dropdown menu
        var dropdownMenu = document.querySelector('.artdeco-dropdown');
        var connectButton = dropdownMenu.querySelector('button[aria-label="Connect"]');
      
        if (dropdownMenu && connectButton) {
          // Open the dropdown menu
          dropdownMenu.click();
      
          // Wait for the dropdown menu to fully open
          setTimeout(() => {
            // Click on the "Connect" button inside the dropdown menu
            connectButton.click();
          }, 500);
        }
      
        // Continue with the original code to handle the invitation popup
        setTimeout(() => this.clickClose(data, config), config.actionDelay);
      },
    // Function to close the invitation popup
    clickClose: function (data, config) {
        var closeButton = document.getElementsByClassName('artdeco-modal__dismiss artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view');
        if (closeButton && closeButton[0]) {
            closeButton[0].click();
        }
        console.info('INFO: invite sent to ' + (data.pageButtonIndex + 1) + ' out of ' + data.pageButtonTotal);
        config.maxRequests--;
        config.totalRequestsSent++;

        // Check if all invitations on the page are sent
        if (data.pageButtonIndex === (data.pageButtonTotal - 1)) {
            console.debug("DEBUG: all connections for the page done, going to next page in " + config.actionDelay + " ms");
            setTimeout(() => this.nextPage(config), config.actionDelay);
        } else {
            // Send the next invite
            data.pageButtonIndex++;
            console.debug("DEBUG: sending next invite in " + config.actionDelay + " ms");
            setTimeout(() => this.sendInvites(data, config), config.actionDelay);
        }
    },

    // Function to navigate to the next page of search results
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

    // Function to mark script completion
    complete: function (config) {
        console.info('INFO: script completed after sending ' + config.totalRequestsSent + ' connection requests');
    },

    // Function to count the total number of search result rows
    totalRows: function () {
        var search_results = document.getElementsByClassName('search-result');
        if (search_results && search_results.length != 0) {
            return search_results.length;
        } else {
            return 0;
        }
    }
}

// Initialize the script with default data and configuration
Linkedin.init({}, Linkedin.config);
