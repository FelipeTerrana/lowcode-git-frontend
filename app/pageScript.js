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
    // TODO pegar do backend
    return Promise.resolve([
        "fulano@email.com - 02/07/2023 19:05:54",
        "fulano@email.com - 02/07/2023 19:05:54",
        "sicrano@email.com - 21/06/2023 10:13:20",
        "beltrano@email.com - 23/07/2023 13:51:03",
        "fulano@email.com - 02/07/2023 19:05:54",
        "fulano@email.com - 02/07/2023 19:05:54",
        "fulano@email.com - 02/07/2023 19:05:54"
    ]);
}



function setLineCommits(lineNodeList, commitStrings) {
    for(let i=0; i < lineNodeList.length; i++) {
        lineNodeList[i].setAttribute("commit", commitStrings[i]);

        const observer = new MutationObserver(() => {
            if(!lineNodeList[i].getAttribute("commit")) {
                lineNodeList[i].setAttribute("commit", commitStrings[i]);
            }
        });

        observer.observe(lineNodeList[i], { "attributes": true });
    }
}
