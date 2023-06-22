const BACKEND_URL = "http://localhost:8080/commit";

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
      const body = decodeBody(details.requestBody.raw[0].bytes);
      
      fetch(BACKEND_URL, {
        "body": JSON.stringify(body),
        "method": "POST",
        "mode": "no-cors"
      });
  },
  { urls: ["*://*.budibase.app/*"] },
  ["requestBody"]
);



function decodeBody(bytes) {
  return JSON.parse(decodeURIComponent(String.fromCharCode.apply(null,
    new Uint8Array(bytes))));
}
