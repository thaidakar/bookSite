const key = "hmyLXpr8zFFPdnNitWMPh4sh8wUnNDfI";

function onClick(e) {
    e.preventDefault();
    // get form values
    let userInput = document.getElementById('input').value;
    let s = document.getElementById('selector');
    let type = s.options[s.selectedIndex].value;

    if (userInput !== '') {
        userInput = userInput.replace(/\s/g, '+');
    }

    let url = '';
    if (type === 'week') {
        url = "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?&api-key=" + key;
    } else if (type === 'author') {
        url = "https://api.nytimes.com/svc/books/v3/lists/best-sellers/history.json?author=" + userInput + "&api-key=" + key;
    } else if (type === 'title') {
        url = "https://api.nytimes.com/svc/books/v3/reviews.json?title=" + userInput + "&api-key=" + key;
    }



    try {
        fetch(url)
            .then(function(response) {
                if (response.status != 200) {
                    return {
                        text: "Error calling the Numbers API service: " + response.statusText
                    }
                }
                return response.json();
            }).then(function(json) {
                debugger
                let output = '<div class="container no-gutters result content-background">';
                if (json.num_results === 0) {
                    output += '<h2 style="text-align: center">No results found</h2>';
                } else {
                    if (type === 'week') {
                        output += weekly(json);
                    } else if (type === 'author') {
                        output += author(json);
                    } else if (type === 'title') {
                        output += book(json);
                    }
                }
                output += '</div>';
                updateResult(output);
            });
    } catch (error) {
        console.log(error.message)
    }
}

function updateResult(info) {
    document.getElementById('result').innerHTML = info;
}

document.getElementById('search').addEventListener('click', onClick);

function weekly(json) {
    let output = "<h2 style=text-align:center>This Week's Bestsellers</h2>";
    output += '<ol>';
    for (let result of json.results) {
        output += '<li class="listResult">';
        output += '<p>"<em>' + result.title + '</em>" ';
        if (result.contributor != null) {
            output += result.contributor + '</p>';
        } else {
            output += 'by ' + result.author + '</p>';
        }
        if ((result.description != '' && result.description != null) || (result.publisher != '' && result.publisher != null)) {
            output += '<ul>';
            if (result.description != '' && result.description != null) {
                output += '<li>&emsp;Description: ' + result.description + '</li>';
            }
            if (result.publisher != '' && result.publisher != null) {
                output += '<li>&emsp;Publisher: ' + result.publisher + '</li>';
            }
            output += '</ul>';
        }
        output += '</li>';
    }
    output += '</ol>';
    return output;
}

function author(json) {
    let output = "<h2 style='text-align: center'>Author's New York Times Bestsellers</h2>";
    output += '<ol>';
    for (let result of json.results) {
        output += '<li class="listResult">';
        output += '<p>"<em>' + result.title + '</em>" ';
        if (result.contributor != null) {
            output += result.contributor + '</p>';
        } else {
            output += 'by ' + result.author + '</p>';
        }
        if ((result.description != '' && result.description != null) || (result.publisher != '' && result.publisher != null)) {
            output += '<ul>';
            if (result.description != '' && result.description != null) {
                output += '<li>&emsp;Description: ' + result.description + '</li>';
            }
            if (result.publisher != '' && result.publisher != null) {
                output += '<li>&emsp;Publisher: ' + result.publisher + '</li>';
            }
            output += '</ul>';
        }
        output += '</li>';
    }
    output += '</ol>';
    return output;
}

function book(json) {
    let output = '<h2 style="text-align: center">Book Info</h2>';
    for (let result of json.results) {
        output += '<div class="row listResult">';
        output += '<p class="col" style="text-align: right">"<em>' + result.book_title + '</em>"</p>';
        output += '<p class="col" style="text-align: center">Author: ' + result.book_author + '</p>';
        output += '<a class="col review_link" style="text-align: left" href="' + result.url + '">Reference</a>';
        output += '</div>';
    }
    return output;
}