//this feature will display a list of all user libraries for user to scroll through

let MOCK_LIBRARIES = {
    "libraries": [
        {
            "id": "1111111",
            "titles": ["brave new world", "moby dick", "origin of the speices", "tropic of cancer"],
            "ownerId": "aaaaaa",
            "ownerName": "John Doe"
        },
        {
            "id": "2222222",
            "text": ["oliver twist", "unlce tom's cabin", "the secret garden", "the beach", "a million little pieces", "the great gatsby"],
            "ownerId": "bbbbbbb",
            "ownerName": "Jane Doe"
        },
        {
            "id": "333333",
            "text": ["animal farm", "lord of the flies", "animal farm"],
            "ownerId": "cccc",
            "ownerName": "Jim Doe"
        },
        {
            "id": "4444444",
            "titles": ["where the wild things are", "1984", "vally of the dolls", "watership dawn", "helter skelter"],
            "ownerId": "ddddd",
            "ownerName": "Jackie Doe",
        }
    ]
}


function getLibraries(callback){
	// we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
	setTimeout(function(){ callback(MOCK_LIBRARIES)}, 1)
}

// this function stays the same when we connect
// to real API later
function displayLibraries(data) {
    for (index in data.libraries) {
	   $('body').append(
        '<p>' + data.libraries[index].text + '</p>');
    }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayLibraries() {
	getLibraries(displayLibraries);
}

//  on page load do this
$(function() {
	getAndDisplayLibraries();
})