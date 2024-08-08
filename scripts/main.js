PAGES = {};

urlSearchParams = new URLSearchParams(window.location.search);

function updateURL() {
    history.pushState(
        null,
        "",
        window.location.pathname + "?" + urlSearchParams.toString()
    );
}

function setURLParam(key, value) {
    urlSearchParams.set(key, encodeURIComponent(value));

    updateURL();
}

function deleteURLParam(key) {
    urlSearchParams.delete(key);

    updateURL();
}

function addPage(key, pageObject) {
    PAGES[key] = pageObject;

    // add sidebar button

    var sidebar = document.getElementById("sidebar");

    if (!pageObject.hideFromPageList()) {
        var pageButton = document.createElement("button");
        pageButton.innerHTML = pageObject.getDisplayName();
        pageButton.id = key + "PageButton";
        if (!pageObject.canOpen()) {
            pageButton.innerHTML = "";
            pageButton.className = "coming-soon";

            var comingSoonText = document.createElement("span");
            comingSoonText.innerHTML = pageObject.getDisplayName();
            pageButton.appendChild(comingSoonText);
        }

        pageButton.addEventListener("click", function () {
            showPage(key);
        });

        sidebar.appendChild(pageButton);
    }

    pageObject.setup();
}

function setupPages() {
   
	//to add more games
	
    addPage("Games", new GamesPage(document.getElementById("GamesPage")));
    addPage("StreetGuesserGame",new StreetGuesserPage(document.getElementById("StreetGuesserPage")));
	addPage("StreetGuesserGame2",new StreetGuesserPage2(document.getElementById("StreetGuesserPage2")));
	addPage("StreetGuesserGame3",new StreetGuesserPage3(document.getElementById("StreetGuesserPage3")));
	addPage("StreetGuesserGame4",new StreetGuesserPage4(document.getElementById("StreetGuesserPage4")));
    addPage("StreetGuesserGame5",new StreetGuesserPage5(document.getElementById("StreetGuesserPage5")));
	addPage("StreetGuesserGame6",new StreetGuesserPage6(document.getElementById("StreetGuesserPage6")));
	addPage("StreetGuesserGame7",new StreetGuesserPage7(document.getElementById("StreetGuesserPage7")));
	
}

function showPage(targetKey) {
    if (!PAGES[targetKey].canOpen()) return;

    for (const [key, value] of Object.entries(PAGES)) {
        var pageContent = value.pageElement;

        pageContent.className =
            key == targetKey ? "page-content" : "page-content hidden";

        if (value.hideFromPageList()) continue;
        var pageButton = document.getElementById(key + "PageButton");

        pageButton.className = key == targetKey ? "selected" : "";
    }

    setURLParam("p", targetKey);


}

function processURLQuery() {
    var url = window.location.href;

    var params = new URL(url).searchParams;

    var pageKey = decodeURIComponent(params.get("p"));

    if (pageKey == null) {
        showPage("Games");
        return;
    }

    var targetID = null;
    if (params.has("id")) targetID = decodeURIComponent(params.get("id"));

    switch (pageKey) {
        default:
            if (pageKey in PAGES) showPage(pageKey);
            else showPage("Games");
            break;
    }
}

window.onload = () => {
    setupPages();
    processURLQuery();
};
