var StreetList5 = MAP.Grapeseed;

class StreetGuesserStreetObject5 extends StreetObject {
    constructor(parent5, street5) {
        super(parent5, street5);

        this.street5 = street5;

        this.selectable5 = true;

        this.guessedCorrectly5 = false;
    }

    draw(ctx, offset, zoom) {
        if (!this.hovered && this.selectable5) return;

        if (this.selectable5) {
            this.color = this.hovered || this.selected ? "orange" : "grey";
            ctx.globalAlpha = this.hovered ? 0.75 : 0.2;
        } else {
            this.color = this.guessedCorrectly5 ? "green" : "red";
            ctx.globalAlpha = 0.5;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * zoom;

        for (const segment of this.segments) {
            segment.draw(ctx);
        }
    }
}

class StreetGuesserPage5 extends Page {
	

	
    getDisplayName() {
        return "Sandy Shores"; //name on panel
    }

    hideFromPageList() {
        return false;   //show on panel
    }

    setup() {  //score on top 0/X 
        this.setupMap();

        document.getElementById("sgScore5").innerHTML =
            "0/" + Object.keys(StreetList5).length;
    }

    setupMap() {
        this.map = new MapProvider(
            this.pageElement.querySelector(".properties-map")
        );

        for (const [key5, street5] of Object.entries(StreetList5)) {
            this.map.addMapObject(
                key5,
                new StreetGuesserStreetObject5(this.map, street5)
            );
        }

        var context5 = this;

        this.map.onSelect = function (mapObject) {
            context5.onStreetSelected5(mapObject);
        };
    }

    onStreetSelected5(mapObject) {
        if (!this.started5) return;

        var correct5 =
            mapObject.street5.Name == this.streetQueue5[this.currentStreetIndex5];

        if (correct5) {
            mapObject.selectable5 = false;
            mapObject.guessedCorrectly5 = true;

            this.correct5 += 1;
        } else {
            var correctObject5 =
                this.map.mapObjects[this.streetQueue5[this.currentStreetIndex5]];
            correctObject5.selectable5 = false;
            correctObject5.guessedCorrectly5 = false;

            this.map.focus(correctObject5);
        }

        this.streetQueue5.splice(this.currentStreetIndex5, 1);

        this.shiftSelectedStreet5(0);

        this.guesses5 += 1;

        this.updateLabels5();

        if (this.streetQueue5.length <= 0) {
            this.endGame5();
        }
    }

    updateLabels5() {  
        document.getElementById("sgScore5").innerHTML = `${this.guesses5}/${
            Object.keys(StreetList5).length
        }`;

        document.getElementById(
            "sgCorrect5"
        ).innerHTML = `${this.correct5} Correct`; //shows left of timer

        document.getElementById("sgIncorrect5").innerHTML = `${
            this.guesses5 - this.correct5
        } Incorrect`; //shows right of timer
    }

    updateTimer5() {
        var time5 = new Date();
        var diff5 = new Date(time5.getTime() - this.startTime5.getTime());

        document.getElementById("sgTimer5").innerHTML = `${diff5
            .getMinutes()
            .toString()}:${diff5.getSeconds().toString().padStart(2, "0")}`;

        var context5 = this;
        if (this.started5)
            setTimeout(function () {
                context5.updateTimer5();
            }, 1000);
    }

    buildStreetQueue5() {
        var queue5 = [];

        for (const [key5, street5] of Object.entries(StreetList5)) {
            queue5.push(key5);
        }

        // naive shuffle
        queue5.sort(() => Math.random() - 0.5);

        this.streetQueue5 = queue5;
    }

    shiftSelectedStreet5(amount) {
        if (!this.started5) return;

        this.currentStreetIndex5 =
            (this.currentStreetIndex5 + amount) % this.streetQueue5.length;
        if (this.currentStreetIndex5 < 0)
            this.currentStreetIndex5 = this.streetQueue5.length - 1;

        document.getElementById("sgCurrentStreet5").innerHTML =
            this.streetQueue5[this.currentStreetIndex5];
    }

    startGame5() {
        if (this.started5) return;   //started = true

        this.buildStreetQueue5();	 //street name array

        this.currentStreetIndex5 = 0; //set to index 0
        this.started5 = true;		  //start = 1

        this.guesses5 = 0;
        this.correct5 = 0;
        this.startTime5 = new Date();

        this.updateLabels5();
        this.updateTimer5();

        this.shiftSelectedStreet5(0);

        document.getElementById("sgRetry5").style.display = "inline";
    }

    endGame5() {
        if (!this.started5) return;

        this.started5 = false;
        this.showEndGame5();
    }

    showEndGame5() {
        this.map.resetView();

        var overlayParent5 = document.getElementById("sgOverlay5");

        overlayParent5.style.display = "block";
        overlayParent5.className = "sg-overlay sg-overlay-fadein";

        document.getElementById("sgEndPercent5").innerHTML = `${Math.round(
            (this.correct5 / Object.keys(StreetList5).length) * 100
        )}%`;
        document.getElementById("sgEndScore5").innerHTML = `${this.correct5}/${
            Object.keys(StreetList5).length
        }`;

        var time5 = new Date();
        var diff5 = new Date(time5.getTime() - this.startTime5.getTime());

        document.getElementById("sgEndTime5").innerHTML = `${diff5
            .getMinutes()
            .toString()}:${diff5.getSeconds().toString().padStart(2, "0")}`;
    }

    retry5() {
        var overlayParent5 = document.getElementById("sgOverlay5");

        overlayParent5.style.display = "none";
        overlayParent5.className = "sg-overlay";

        this.map.clearMapObjects();

        for (const [key5, street5] of Object.entries(StreetList5)) {
            this.map.addMapObject(
                key5,
                new StreetGuesserStreetObject5(this.map, street5)
            );
        }

        this.buildStreetQueue5();

        this.startGame5();
    }
}
