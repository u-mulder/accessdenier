// config in `about:addons`

function isValidTime(timeStr) {
    // todo
    //return /\d\d/.test();

    return true;
}

function saveOptions() {
    var rules = [];
    var sites = document.querySelectorAll("input[name='domain[]']");
    var denyFrom = document.querySelectorAll("input[name='deny_start[]']");
    var denyTo = document.querySelectorAll("input[name='deny_end[]']");

    sites.forEach(function(v, i) {
        var site = v.value.trim();
        var timeFrom = denyFrom[i].value.trim();
        var timeTo = denyTo[i].value.trim();

        if (site && isValidTime(timeFrom) && isValidTime(timeTo)) {
            rules.push({
                site: site,
                timeFrom: timeFrom,
                timeTo: timeTo
            });
        }
    });

    if (rules.length) {
        browser.storage.local.set({acdn_rules: rules});
    }
}

function restoreOptions() {
    function onError(error) {
        alert("Error happened, open console to see the text");
        console.log("Error restoring options: ", error);
    }

    function createRulesItems(result) {
        var rules = result.acdn_rules || null;
        var rulesBlock = document.querySelector("#rules_block");

        if (rules) {
            var node = document.querySelector(".rule_item");
            for (var k in rules) {
                if (k == 0) {
                    node.querySelector("input[name='domain[]']").value = rules[k].site;
                    node.querySelector("input[name='deny_start[]']").value = rules[k].timeFrom;
                    node.querySelector("input[name='deny_end[]']").value = rules[k].timeTo;
                } else {
                    var nodeClone = node.cloneNode(true);
                    nodeClone.querySelector("input[name='domain[]']").value = rules[k].site;
                    nodeClone.querySelector("input[name='deny_start[]']").value = rules[k].timeFrom;
                    nodeClone.querySelector("input[name='deny_end[]']").value = rules[k].timeTo;
                    rulesBlock.appendChild(nodeClone);
                }
            }
        }
    }

    var rules = browser.storage.local.get("acdn_rules");
    rules.then(createRulesItems, onError);
}

function addRule() {
    var node = document.querySelector(".rule_item");
    var nodeClone = node.cloneNode(true);
    var inputs = nodeClone.querySelectorAll("input");
    for (var k in inputs) {
        inputs[k].value = "";
    }
    document.querySelector("#rules_block").appendChild(nodeClone);
}

function removeRule(e) {
    if (e.target && e.target.className == "remove_rule") {
        var ruleParent = e.target.closest(".rule_item");
        if (ruleParent) {
            var rulesLen = document.querySelectorAll(".rule_item").length;
            if (1 < rulesLen) {
                ruleParent.parentNode.removeChild(ruleParent);
            } else {
                var inputs = ruleParent.querySelectorAll("input");
                for (var k in inputs) {
                    inputs[k].value = "";
                }
            }
        }

        e.preventDefault();
    }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("#add_rule").addEventListener("click", addRule)
document.addEventListener("click", removeRule)
document.querySelector("form").addEventListener("submit", saveOptions);
