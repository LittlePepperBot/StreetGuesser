var StreetList4 = MAP.Sandy;

class StreetGuesserStreetObject4 extends StreetObject {
    constructor(parent4, street4) {
        super(parent4, street4);

        this.street4 = street4;

        this.selectable4 = true;

        this.guessedCorrectly4 = false;
    }

    draw(ctx, offset, zoom) {
        if (!this.hovered && this.selectable4) return;

        if (this.selectable4) {
            this.color = this.hovered || this.selected ? "orange" : "grey";
            ctx.globalAlpha = this.hovered ? 0.75 : 0.2;
        } else {
            this.color = this.guessedCorrectly4 ? "green" : "red";
            ctx.globalAlpha = 0.5;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * zoom;

        for (const segment of this.segments) {
            segment.draw(ctx);
        }
    }
}

class StreetGuesserPage4 extends Page {
	

	
    getDisplayName() {
        return "Sandy Shores"; //name on panel
    }

    hideFromPageList() {
        return false;   //show on panel
    }

    setup() {  //score on top 0/X 
        this.setupMap();

        document.getElementById("sgScore4").innerHTML =
            "0/" + Object.keys(StreetList4).length;
    }

    setupMap() {
        this.map = new MapProvider(
            this.pageElement.querySelector(".properties-map")
        );

        for (const [key4, street4] of Object.entries(StreetList4)) {
            this.map.addMapObject(
                key4,
                new StreetGuesserStreetObject4(this.map, street4)
            );
        }

        var context4 = this;

        this.map.onSelect = function (mapObject) {
            context4.onStreetSelected4(mapObject);
        };
    }

    onStreetSelected4(mapObject) {
        if (!this.started4) return;

        var correct4 =
            mapObject.street4.Name == this.streetQueue4[this.currentStreetIndex4];

        if (correct4) {
            mapObject.selectable4 = false;
            mapObject.guessedCorrectly4 = true;

            this.correct4 += 1;
        } else {
            var correctObject4 =
                this.map.mapObjects[this.streetQueue4[this.currentStreetIndex4]];
            correctObject4.selectable4 = false;
            correctObject4.guessedCorrectly4 = false;

            this.map.focus(correctObject4);
        }

        this.streetQueue4.splice(this.currentStreetIndex4, 1);

        this.shiftSelectedStreet4(0);

        this.guesses4 += 1;

        this.updateLabels4();

        if (this.streetQueue4.length <= 0) {
            this.endGame4();
        }
    }

    updateLabels4() {  
        document.getElementById("sgScore4").innerHTML = `${this.guesses4}/${
            Object.keys(StreetList4).length
        }`;

        document.getElementById(
            "sgCorrect4"
        ).innerHTML = `${this.correct4} Correct`; //shows left of timer

        document.getElementById("sgIncorrect4").innerHTML = `${
            this.guesses4 - this.correct4
        } Incorrect`; //shows right of timer
    }

    updateTimer4() {
        var time4 = new Date();
        var diff4 = new Date(time4.getTime() - this.startTime4.getTime());

        document.getElementById("sgTimer4").innerHTML = `${diff4
            .getMinutes()
            .toString()}:${diff4.getSeconds().toString().padStart(2, "0")}`;

        var context4 = this;
        if (this.started4)
            setTimeout(function () {
                context4.updateTimer4();
            }, 1000);
    }

    buildStreetQueue4() {
        var queue4 = [];

        for (const [key4, street4] of Object.entries(StreetList4)) {
            queue4.push(key4);
        }

        // naive shuffle
        queue4.sort(() => Math.random() - 0.5);

        this.streetQueue4 = queue4;
    }

    shiftSelectedStreet4(amount) {
        if (!this.started4) return;

        this.currentStreetIndex4 =
            (this.currentStreetIndex4 + amount) % this.streetQueue4.length;
        if (this.currentStreetIndex4 < 0)
            this.currentStreetIndex4 = this.streetQueue4.length - 1;

        document.getElementById("sgCurrentStreet4").innerHTML =
            this.streetQueue4[this.currentStreetIndex4];
    }

    startGame4() {
        if (this.started4) return;   //started = true

        this.buildStreetQueue4();	 //street name array

        this.currentStreetIndex4 = 0; //set to index 0
        this.started4 = true;		  //start = 1

        this.guesses4 = 0;
        this.correct4 = 0;
        this.startTime4 = new Date();

        this.updateLabels4();
        this.updateTimer4();

        this.shiftSelectedStreet4(0);

        document.getElementById("sgRetry4").style.display = "inline";
    }

    endGame4() {
        if (!this.started4) return;

        this.started4 = false;
        this.showEndGame4();
    }

    showEndGame4() {
        this.map.resetView();

        var overlayParent4 = document.getElementById("sgOverlay4");

        overlayParent4.style.display = "block";
        overlayParent4.className = "sg-overlay sg-overlay-fadein";

        document.getElementById("sgEndPercent4").innerHTML = `${Math.round(
            (this.correct4 / Object.keys(StreetList4).length) * 100
        )}%`;
        document.getElementById("sgEndScore4").innerHTML = `${this.correct4}/${
            Object.keys(StreetList4).length
        }`;

        var time4 = new Date();
        var diff4 = new Date(time4.getTime() - this.startTime4.getTime());

        document.getElementById("sgEndTime4").innerHTML = `${diff4
            .getMinutes()
            .toString()}:${diff4.getSeconds().toString().padStart(2, "0")}`;
    }

    retry4() {
        var overlayParent4 = document.getElementById("sgOverlay4");

        overlayParent4.style.display = "none";
        overlayParent4.className = "sg-overlay";

        this.map.clearMapObjects();

        for (const [key4, street4] of Object.entries(StreetList4)) {
            this.map.addMapObject(
                key4,
                new StreetGuesserStreetObject4(this.map, street4)
            );
        }

        this.buildStreetQueue4();

        this.startGame4();
    }
}
