const BACKEND_URL = "http://localhost:8080/commit";
const GIT_PATH = "dateValidation.js";

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details?.requestBody?.raw[0]?.bytes) {
            const body = decodeBody(details.requestBody.raw[0].bytes);

            let base64Code = body?.props
                ?._children[0]
                ?._children[0]
                ?._children[0]
                ?._children[2]
                ?._children[7]
                ?.validation[0]?.value;

            if(!base64Code) {
                return;
            }

            [, base64Code] = base64Code.match(/^\{\{ js \"(.*)\" \}\}$/);

            fetch(BACKEND_URL, {
              "body": JSON.stringify({
                "contentBase64": base64Code,
                "path": GIT_PATH
              }),
              "headers": {
                "Content-Type": "application/json"
              },
              "method": "POST",
              "mode": "cors"
            });
        }
    },
    { urls: ["*://*.budibase.app/*"] },
    ["requestBody"]
);



function decodeBody(bytes) {
    return JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
        new Uint8Array(bytes))));
}
