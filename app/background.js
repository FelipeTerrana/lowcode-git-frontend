const GIT_PATH = "dateValidation.js";

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        if (details?.requestBody?.raw[0]?.bytes) {
            const body = decodeBody(details.requestBody.raw[0].bytes);

            let base64Code = getBase64CodeFromRequest(body);

            if(!base64Code) {
                return;
            }

            commit(GIT_PATH, base64Code);
        }
    },
    { urls: ["*://*.budibase.app/*"] },
    ["requestBody"]
);



// ----------------------------------------------------



function decodeBody(bytes) {
    return JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
        new Uint8Array(bytes))));
}



function getBase64CodeFromRequest(body) {
    let base64Code = body?.props
        ?._children[0]
        ?._children[0]
        ?._children[0]
        ?._children[2]
        ?._children[7]
        ?.validation[0]?.value || "";

    [, base64Code] = base64Code.match(/^\{\{ js \"(.*)\" \}\}$/);

    return base64Code;
}



function commit(path, base64Code) {
    const BACKEND_URL = "http://localhost:8080/commit";

    chrome.tabs.query({ active: true, currentWindow: true })
        .then(tabs => chrome.scripting.executeScript({
                "target": { "tabId": tabs[0].id },
                "world": "MAIN",
                "func": () => {
                    const userEmail = document.querySelector("#app > div.root.svelte-gzmtw > div.top-nav.svelte-gzmtw > div.toprightnav.svelte-gzmtw > div.avatars.svelte-16y517q > div > div.tooltip.svelte-10v3vdh > span > span.spectrum-Tooltip-label.svelte-12iylyn").innerHTML;

                    return userEmail;
                }
            })
        )
        .then(results => {
            const userEmail = results[0].result;

            return fetch(BACKEND_URL, {
                "body": JSON.stringify({
                    "contentBase64": base64Code,
                    "path": path,
                    "authorEmail": userEmail
                }),
                "headers": {
                    "Content-Type": "application/json"
                },
                "method": "POST",
                "mode": "cors"
            });
        })
        .then(response => response.json())
        .then(body => {
            if (body.success) {
                console.log("Commit realizado com sucesso");
            } else {
                console.error("Erro ao realizar commit");
                console.error(body)
            }
        })
        .catch(error => {
            console.error("Erro ao fazer commit");
            console.error(error);
        });
}
