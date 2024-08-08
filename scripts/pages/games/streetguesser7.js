var StreetList7 = MAP.InnerCityRoads;

class StreetGuesserStreetObject7 extends StreetObject {
    constructor(parent7, street7) {
        super(parent7, street7);

        this.street7 = street7;

        this.selectable7 = true;

        this.guessedCorrectly7 = false;
    }

    draw(ctx, offset, zoom) {
        if (!this.hovered && this.selectable7) return;

        if (this.selectable7) {
            this.color = this.hovered || this.selected ? "orange" : "grey";
            ctx.globalAlpha = this.hovered ? 0.75 : 0.2;
        } else {
            this.color = this.guessedCorrectly7 ? "green" : "red";
            ctx.globalAlpha = 0.5;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * zoom;

        for (const segment of this.segments) {
            segment.draw(ctx);
        }
    }
}

class StreetGuesserPage7 extends Page {
	

	
    getDisplayName() {
        return "Inner City"; //name on panel
    }

    hideFromPageList() {
        return false;   //show on panel
    }

    setup() {  //score on top 0/X 
        this.setupMap();

        document.getElementById("sgScore7").innerHTML =
            "0/" + Object.keys(StreetList7).length;
    }

    setupMap() {
        this.map = new MapProvider(
            this.pageElement.querySelector(".properties-map")
        );

        for (const [key7, street7] of Object.entries(StreetList7)) {
            this.map.addMapObject(
                key7,
                new StreetGuesserStreetObject7(this.map, street7)
            );
        }

        var context7 = this;

        this.map.onSelect = function (mapObject) {
            context7.onStreetSelected7(mapObject);
        };
    }

    onStreetSelected7(mapObject) {
        if (!this.started7) return;

        var correct7 =
            mapObject.street7.Name == this.streetQueue7[this.currentStreetIndex7];

        if (correct7) {
            mapObject.selectable7 = false;
            mapObject.guessedCorrectly7 = true;

            this.correct7 += 1;
        } else {
            var correctObject7 =
                this.map.mapObjects[this.streetQueue7[this.currentStreetIndex7]];
            correctObject7.selectable7 = false;
            correctObject7.guessedCorrectly7 = false;

            this.map.focus(correctObject7);
        }

        this.streetQueue7.splice(this.currentStreetIndex7, 1);

        this.shiftSelectedStreet7(0);

        this.guesses7 += 1;

        this.updateLabels7();

        if (this.streetQueue7.length <= 0) {
            this.endGame7();
        }
    }

    updateLabels7() {  
        document.getElementById("sgScore7").innerHTML = `${this.guesses7}/${
            Object.keys(StreetList7).length
        }`;

        document.getElementById(
            "sgCorrect7"
        ).innerHTML = `${this.correct7} Correct`; //shows left of timer

        document.getElementById("sgIncorrect7").innerHTML = `${
            this.guesses7 - this.correct7
        } Incorrect`; //shows right of timer
    }

    updateTimer7() {
        var time7 = new Date();
        var diff7 = new Date(time7.getTime() - this.startTime7.getTime());

        document.getElementById("sgTimer7").innerHTML = `${diff7
            .getMinutes()
            .toString()}:${diff7.getSeconds().toString().padStart(2, "0")}`;

        var context7 = this;
        if (this.started7)
            setTimeout(function () {
                context7.updateTimer7();
            }, 1000);
    }

    buildStreetQueue7() {
        var queue7 = [];

        for (const [key7, street7] of Object.entries(StreetList7)) {
            queue7.push(key7);
        }

        // naive shuffle
        queue7.sort(() => Math.random() - 0.5);

        this.streetQueue7 = queue7;
    }

    shiftSelectedStreet7(amount) {
        if (!this.started7) return;

        this.currentStreetIndex7 =
            (this.currentStreetIndex7 + amount) % this.streetQueue7.length;
        if (this.currentStreetIndex7 < 0)
            this.currentStreetIndex7 = this.streetQueue7.length - 1;

        document.getElementById("sgCurrentStreet7").innerHTML =
            this.streetQueue7[this.currentStreetIndex7];
    }

    startGame7() {
        if (this.started7) return;   //started = true

        this.buildStreetQueue7();	 //street name array

        this.currentStreetIndex7 = 0; //set to index 0
        this.started7 = true;		  //start = 1

        this.guesses7 = 0;
        this.correct7 = 0;
        this.startTime7 = new Date();

        this.updateLabels7();
        this.updateTimer7();

        this.shiftSelectedStreet7(0);

        document.getElementById("sgRetry7").style.display = "inline";
    }

    endGame7() {
        if (!this.started7) return;

        this.started7 = false;
        this.showEndGame7();
    }

    showEndGame7() {
        this.map.resetView();

        var overlayParent7 = document.getElementById("sgOverlay7");

        overlayParent7.style.display = "block";
        overlayParent7.className = "sg-overlay sg-overlay-fadein";

        document.getElementById("sgEndPercent7").innerHTML = `${Math.round(
            (this.correct7 / Object.keys(StreetList7).length) * 100
        )}%`;
        document.getElementById("sgEndScore7").innerHTML = `${this.correct7}/${
            Object.keys(StreetList7).length
        }`;

        var time7 = new Date();
        var diff7 = new Date(time7.getTime() - this.startTime7.getTime());

        document.getElementById("sgEndTime7").innerHTML = `${diff7
            .getMinutes()
            .toString()}:${diff7.getSeconds().toString().padStart(2, "0")}`;
    }

    retry7() {
        var overlayParent7 = document.getElementById("sgOverlay7");

        overlayParent7.style.display = "none";
        overlayParent7.className = "sg-overlay";

        this.map.clearMapObjects();

        for (const [key7, street7] of Object.entries(StreetList7)) {
            this.map.addMapObject(
                key7,
                new StreetGuesserStreetObject7(this.map, street7)
            );
        }

        this.buildStreetQueue7();

        this.startGame7();
    }
}
