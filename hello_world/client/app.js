function fetchGreeting(){
    return fetch('http://localhost:3000/',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: "query { greeting }",
        })
    })
    .then(response => response.json())
    .then(body => {
        return body.data.greeting;
    })
    .catch(err => console.log(err));
}

const strongText = document.getElementById('greeting');
fetchGreeting()
    .then(response => {
        strongText.textContent = response;
    })
    .catch(err => console.log(err));