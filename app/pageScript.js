startObserver();



// -----------------------------------------------------------



function startObserver() {
    const GIT_PATH = "dateValidation.js";
    
    const body = document.getElementById("app");
    const config = { "childList": true };

    const observer = new MutationObserver((mutations) => {
        const codeEditorElement = mutations
            .filter(mutation => mutation.addedNodes.length === 1)
            .map(mutation => mutation.addedNodes[0].querySelector?.(".code-editor"))
            .find(codeEditor => codeEditor);

        if(!codeEditorElement) {
            return;
        }

        const lineNodeList = codeEditorElement.querySelector(".cm-content")?.childNodes;

        if(!lineNodeList) {
            return;
        }

        fetchCommitStrings(GIT_PATH).then(commitStrings => {
            setLineCommits(lineNodeList, commitStrings);
        });
    });

    observer.observe(body, config);
}



function fetchCommitStrings(path) {
    const BACKEND_URL = `http://localhost:8080/blame/${encodeURIComponent(path)}`;

    return fetch(BACKEND_URL, {
        "headers": {
            "Content-Type": "application/json"
        },
        "method": "GET",
        "mode": "cors"
    }).then(response => response.json())
      .then(body => body.data);
}



function setLineCommits(lineNodeList, commitStrings) {
    for(let i=0; i < lineNodeList.length; i++) {
        let lineNode = lineNodeList[i];
        let commitString = commitStrings[i] ?? "";

        lineNode.setAttribute("commit", commitString);

        const observer = new MutationObserver(() => {
            if(!lineNode.hasAttribute("commit")) {
                lineNode.setAttribute("commit", commitString);
            }
        });

        observer.observe(lineNode, { "attributes": true });
    }
}
