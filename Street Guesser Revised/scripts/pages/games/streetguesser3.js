//timer and retry button are broken
var StreetList3 = MAP.MirrorPark;

class StreetGuesserStreetObject3 extends StreetObject {
    constructor(parent3, street3) {
        super(parent3, street3);

        this.street3 = street3;

        this.selectable3 = true;

        this.guessedCorrectly3 = false;
    }

    draw(ctx, offset, zoom) {
        if (!this.hovered && this.selectable3) return;

        if (this.selectable3) {
            this.color = this.hovered || this.selected ? "orange" : "grey";
            ctx.globalAlpha = this.hovered ? 0.75 : 0.2;
        } else {
            this.color = this.guessedCorrectly3 ? "green" : "red";
            ctx.globalAlpha = 0.5;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * zoom;

        for (const segment of this.segments) {
            segment.draw(ctx);
        }
    }
}

class StreetGuesserPage3 extends Page {
	

	
    getDisplayName() {
        return "Mirror Park"; //name on panel
    }

    hideFromPageList() {
        return false;   //show on panel
    }

    setup() {  //score on top 0/X 
        this.setupMap();

        document.getElementById("sgScore3").innerHTML =
            "0/" + Object.keys(StreetList3).length;
    }

    setupMap() {
        this.map = new MapProvider(
            this.pageElement.querySelector(".properties-map")
        );

        for (const [key3, street3] of Object.entries(StreetList3)) {
            this.map.addMapObject(
                key3,
                new StreetGuesserStreetObject3(this.map, street3)
            );
        }

        var context3 = this;

        this.map.onSelect = function (mapObject) {
            context3.onStreetSelected3(mapObject);
        };
    }

    onStreetSelected3(mapObject) {
        if (!this.started3) return;

        var correct3 =
            mapObject.street3.Name == this.streetQueue3[this.currentStreetIndex3];

        if (correct3) {
            mapObject.selectable3 = false;
            mapObject.guessedCorrectly3 = true;

            this.correct3 += 1;
        } else {
            var correctObject3 =
                this.map.mapObjects[this.streetQueue3[this.currentStreetIndex3]];
            correctObject3.selectable3 = false;
            correctObject3.guessedCorrectly3 = false;

            this.map.focus(correctObject3);
        }

        this.streetQueue3.splice(this.currentStreetIndex3, 1);

        this.shiftSelectedStreet3(0);

        this.guesses3 += 1;

        this.updateLabels3();

        if (this.streetQueue3.length <= 0) {
            this.endGame3();
        }
    }

    updateLabels3() {  
        document.getElementById("sgScore3").innerHTML = `${this.guesses3}/${
            Object.keys(StreetList3).length
        }`;

        document.getElementById(
            "sgCorrect3"
        ).innerHTML = `${this.correct3} Correct`; //shows left of timer

        document.getElementById("sgIncorrect3").innerHTML = `${
            this.guesses3 - this.correct3
        } Incorrect`; //shows right of timer
    }

    updateTimer3() {
        var time3 = new Date();
        var diff3 = new Date(time3.getTime() - this.startTime3.getTime());

        document.getElementById("sgTimer3").innerHTML = `${diff3
            .getMinutes()
            .toString()}:${diff3.getSeconds().toString().padStart(2, "0")}`;

        var context3 = this;
        if (this.started3)
            setTimeout(function () {
                context3.updateTimer3();
            }, 1000);
    }

    buildStreetQueue3() {
        var queue3 = [];

        for (const [key3, street3] of Object.entries(StreetList3)) {
            queue3.push(key3);
        }

        // naive shuffle
        queue3.sort(() => Math.random() - 0.5);

        this.streetQueue3 = queue3;
    }

    shiftSelectedStreet3(amount) {
        if (!this.started3) return;

        this.currentStreetIndex3 =
            (this.currentStreetIndex3 + amount) % this.streetQueue3.length;
        if (this.currentStreetIndex3 < 0)
            this.currentStreetIndex3 = this.streetQueue3.length - 1;

        document.getElementById("sgCurrentStreet3").innerHTML =
            this.streetQueue3[this.currentStreetIndex3];
    }

    startGame3() {
        if (this.started3) return;   //started = true

        this.buildStreetQueue3();	 //street name array

        this.currentStreetIndex3 = 0; //set to index 0
        this.started3 = true;		  //start = 1

        this.guesses3 = 0;
        this.correct3 = 0;
        this.startTime3 = new Date();

        this.updateLabels3();
        this.updateTimer3();

        this.shiftSelectedStreet3(0);

        document.getElementById("sgRetry3").style.display = "inline";
    }

    endGame3() {
        if (!this.started3) return;

        this.started3 = false;
        this.showEndGame3();
    }

    showEndGame3() {
        this.map.resetView();

        var overlayParent3 = document.getElementById("sgOverlay3");

        overlayParent3.style.display = "block";
        overlayParent3.className = "sg-overlay sg-overlay-fadein";

        document.getElementById("sgEndPercent3").innerHTML = `${Math.round(
            (this.correct3 / Object.keys(StreetList3).length) * 100
        )}%`;
        document.getElementById("sgEndScore3").innerHTML = `${this.correct3}/${
            Object.keys(StreetList3).length
        }`;

        var time3 = new Date();
        var diff3 = new Date(time3.getTime() - this.startTime3.getTime());

        document.getElementById("sgEndTime3").innerHTML = `${diff3
            .getMinutes()
            .toString()}:${diff3.getSeconds().toString().padStart(3, "0")}`;
    }

    retry3() {
        var overlayParent3 = document.getElementById("sgOverlay3");

        overlayParent3.style.display = "none";
        overlayParent3.className = "sg-overlay";

        this.map.clearMapObjects();

        for (const [key3, street3] of Object.entries(StreetList3)) {
            this.map.addMapObject(
                key3,
                new StreetGuesserStreetObject3(this.map, street3)
            );
        }

        this.buildStreetQueue3();

        this.startGame3();
    }
}
