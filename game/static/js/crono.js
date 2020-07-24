let crono = 0;

function cronoAdd() {
    crono++;
}

setInterval(cronoAdd, 1000);

function cronoSend(val) {
    fetch("leaderboard", {
        method: "POST",
        body: JSON.stringify({
            "value": val,
            "time": crono
        })
    })
        .then(res => res.json())
        .then(res => {
            if (res.saved) {
                console.log("LeaderBoard Updated");
            } else {
                console.error("An error ocurred trying update the leaderboard");
            }
        })
        .catch (error => console.error(error))
}
