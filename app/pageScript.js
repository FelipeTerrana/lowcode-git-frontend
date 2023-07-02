startObserver();



// -----------------------------------------------------------



function startObserver() {
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

        // TODO commits do backend
        setLineCommits(lineNodeList);
    });

    observer.observe(body, config);
}



function setLineCommits(lineNodeList, commitStrings) {
    // TODO
    console.log(lineNodeList);
}
