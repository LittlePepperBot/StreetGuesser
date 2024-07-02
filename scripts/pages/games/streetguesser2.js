var StreetList = MAP.Vinewood;

class StreetGuesserStreetObject2 extends StreetObject {
    constructor(parent2, street2) {
        super(parent2, street2);

        this.street2 = street2;

        this.selectable2 = true;

        this.guessedCorrectly2 = false;
    }

    draw(ctx, offset, zoom) {
        if (!this.hovered && this.selectable2) return;

        if (this.selectable2) {
            this.color = this.hovered || this.selected ? "orange" : "grey";
            ctx.globalAlpha = this.hovered ? 0.75 : 0.2;
        } else {
            this.color = this.guessedCorrectly2 ? "green" : "red";
            ctx.globalAlpha = 0.5;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * zoom;

        for (const segment of this.segments) {
            segment.draw(ctx);
        }
    }
}

class StreetGuesserPage2 extends Page {
	

	
    getDisplayName() {
        return "Vinewood"; //name on panel
    }

    hideFromPageList() {
        return false;   //show on panel
    }

    setup() {  //score on top 0/X 
        this.setupMap();

        document.getElementById("sgScore2").innerHTML =
            "0/" + Object.keys(StreetList).length;
    }

    setupMap() {
        this.map = new MapProvider(
            this.pageElement.querySelector(".properties-map")
        );

        for (const [key2, street2] of Object.entries(StreetList)) {
            this.map.addMapObject(
                key2,
                new StreetGuesserStreetObject2(this.map, street2)
            );
        }

        var context2 = this;

        this.map.onSelect = function (mapObject) {
            context2.onStreetSelected2(mapObject);
        };
    }

    onStreetSelected2(mapObject) {
        if (!this.started2) return;

        var correct2 =
            mapObject.street2.Name == this.streetQueue2[this.currentStreetIndex2];

        if (correct2) {
            mapObject.selectable2 = false;
            mapObject.guessedCorrectly2 = true;

            this.correct2 += 1;
        } else {
            var correctObject2 =
                this.map.mapObjects[this.streetQueue2[this.currentStreetIndex2]];
            correctObject2.selectable2 = false;
            correctObject2.guessedCorrectly2 = false;

            this.map.focus(correctObject2);
        }

        this.streetQueue2.splice(this.currentStreetIndex2, 1);

        this.shiftSelectedStreet2(0);

        this.guesses2 += 1;

        this.updateLabels2();

        if (this.streetQueue2.length <= 0) {
            this.endGame2();
        }
    }

    updateLabels2() {  
        document.getElementById("sgScore2").innerHTML = `${this.guesses2}/${
            Object.keys(StreetList).length
        }`;

        document.getElementById(
            "sgCorrect2"
        ).innerHTML = `${this.correct2} Correct`; //shows left of timer

        document.getElementById("sgIncorrect2").innerHTML = `${
            this.guesses2 - this.correct2
        } Incorrect`; //shows right of timer
    }

    updateTimer2() {
        var time2 = new Date();
        var diff2 = new Date(time2.getTime() - this.startTime2.getTime());

        document.getElementById("sgTimer2").innerHTML = `${diff2
            .getMinutes()
            .toString()}:${diff2.getSeconds().toString().padStart(2, "0")}`;

        var context2 = this;
        if (this.started2)
            setTimeout(function () {
                context2.updateTimer2();
            }, 1000);
    }

    buildStreetQueue2() {
        var queue2 = [];

        for (const [key2, street2] of Object.entries(StreetList)) {
            queue2.push(key2);
        }

        // naive shuffle
        queue2.sort(() => Math.random() - 0.5);

        this.streetQueue2 = queue2;
    }

    shiftSelectedStreet2(amount) {
        if (!this.started2) return;

        this.currentStreetIndex2 =
            (this.currentStreetIndex2 + amount) % this.streetQueue2.length;
        if (this.currentStreetIndex2 < 0)
            this.currentStreetIndex2 = this.streetQueue2.length - 1;

        document.getElementById("sgCurrentStreet2").innerHTML =
            this.streetQueue2[this.currentStreetIndex2];
    }

    startGame2() {
        if (this.started2) return;   //started = true

        this.buildStreetQueue2();	 //street name array

        this.currentStreetIndex2 = 0; //set to index 0
        this.started2 = true;		  //start = 1

        this.guesses2 = 0;
        this.correct2 = 0;
        this.startTime2 = new Date();

        this.updateLabels2();
        this.updateTimer2();

        this.shiftSelectedStreet2(0);

        document.getElementById("sgRetry2").style.display = "inline";
    }

    endGame2() {
        if (!this.started2) return;

        this.started2 = false;
        this.showEndGame2();
    }

    showEndGame2() {
        this.map.resetView();

        var overlayParent2 = document.getElementById("sgOverlay2");

        overlayParent2.style.display = "block";
        overlayParent2.className = "sg-overlay sg-overlay-fadein";

        document.getElementById("sgEndPercent2").innerHTML = `${Math.round(
            (this.correct2 / Object.keys(StreetList).length) * 100
        )}%`;
        document.getElementById("sgEndScore2").innerHTML = `${this.correct2}/${
            Object.keys(StreetList).length
        }`;

        var time2 = new Date();
        var diff2 = new Date(time2.getTime() - this.startTime2.getTime());

        document.getElementById("sgEndTime2").innerHTML = `${diff2
            .getMinutes()
            .toString()}:${diff2.getSeconds().toString().padStart(2, "0")}`;
    }

    retry2() {
        var overlayParent2 = document.getElementById("sgOverlay2");

        overlayParent2.style.display = "none";
        overlayParent2.className = "sg-overlay";

        this.map.clearMapObjects();

        for (const [key2, street2] of Object.entries(StreetList)) {
            this.map.addMapObject(
                key2,
                new StreetGuesserStreetObject2(this.map, street2)
            );
        }

        this.buildStreetQueue2();

        this.startGame2();
    }
}
