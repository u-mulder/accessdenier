// about:debugging - Adding temporary addon to Firefox
// about:addons - Configuring addon

function onSettingsGet(result) {
    if (result.acdn_rules) {
        var loc = document.location;

        for (var k in result.acdn_rules) {
            var hostStr = result.acdn_rules[ k ].site
                .replace(/\./, '\\.')
                .replace(/\*/, '(.*)')
            var hostRe = new RegExp('^' + hostStr + '$');
            if (hostRe.test(document.location.hostname) && timeIsInInterval(result.acdn_rules[ k ].timeFrom, result.acdn_rules[ k ].timeTo)) {
                document.body.innerHTML = "<h1 style='margin:15px auto;'>NOPE</h1>";
                break;
            }
        }
    }
}

function timeIsInInterval(timeFrom, timeTo) {
    var currentDate = new Date();
    var minutes = currentDate.getMinutes();
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    var curTime = parseInt(currentDate.getHours() + "" + minutes);
    timeFrom = parseInt(timeFrom.replace(":", ""));
    timeTo = parseInt(timeTo.replace(":", ""));

    return timeFrom <= curTime && curTime <= timeTo;
}

function onError(error) {
    console.log( "Error with accessdenier addon: ", error );
}

var getting = browser.storage.local.get("acdn_rules");
getting.then(onSettingsGet, onError);
