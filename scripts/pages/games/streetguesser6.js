var StreetList6 = MAP.Paleto;

class StreetGuesserStreetObject6 extends StreetObject {
    constructor(parent6, street6) {
        super(parent6, street6);

        this.street6 = street6;

        this.selectable6 = true;

        this.guessedCorrectly6 = false;
    }

    draw(ctx, offset, zoom) {
        if (!this.hovered && this.selectable6) return;

        if (this.selectable6) {
            this.color = this.hovered || this.selected ? "orange" : "grey";
            ctx.globalAlpha = this.hovered ? 0.75 : 0.2;
        } else {
            this.color = this.guessedCorrectly6 ? "green" : "red";
            ctx.globalAlpha = 0.5;
        }

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2 * zoom;

        for (const segment of this.segments) {
            segment.draw(ctx);
        }
    }
}

class StreetGuesserPage6 extends Page {
	

	
    getDisplayName() {
        return "Paleto"; //name on panel
    }

    hideFromPageList() {
        return false;   //show on panel
    }

    setup() {  //score on top 0/X 
        this.setupMap();

        document.getElementById("sgScore6").innerHTML =
            "0/" + Object.keys(StreetList6).length;
    }

    setupMap() {
        this.map = new MapProvider(
            this.pageElement.querySelector(".properties-map")
        );

        for (const [key6, street6] of Object.entries(StreetList6)) {
            this.map.addMapObject(
                key6,
                new StreetGuesserStreetObject6(this.map, street6)
            );
        }

        var context6 = this;

        this.map.onSelect = function (mapObject) {
            context6.onStreetSelected6(mapObject);
        };
    }

    onStreetSelected6(mapObject) {
        if (!this.started6) return;

        var correct6 =
            mapObject.street6.Name == this.streetQueue6[this.currentStreetIndex6];

        if (correct6) {
            mapObject.selectable6 = false;
            mapObject.guessedCorrectly6 = true;

            this.correct6 += 1;
        } else {
            var correctObject6 =
                this.map.mapObjects[this.streetQueue6[this.currentStreetIndex6]];
            correctObject6.selectable6 = false;
            correctObject6.guessedCorrectly6 = false;

            this.map.focus(correctObject6);
        }

        this.streetQueue6.splice(this.currentStreetIndex6, 1);

        this.shiftSelectedStreet6(0);

        this.guesses6 += 1;

        this.updateLabels6();

        if (this.streetQueue6.length <= 0) {
            this.endGame6();
        }
    }

    updateLabels6() {  
        document.getElementById("sgScore6").innerHTML = `${this.guesses6}/${
            Object.keys(StreetList6).length
        }`;

        document.getElementById(
            "sgCorrect6"
        ).innerHTML = `${this.correct6} Correct`; //shows left of timer

        document.getElementById("sgIncorrect6").innerHTML = `${
            this.guesses6 - this.correct6
        } Incorrect`; //shows right of timer
    }

    updateTimer6() {
        var time6 = new Date();
        var diff6 = new Date(time6.getTime() - this.startTime6.getTime());

        document.getElementById("sgTimer6").innerHTML = `${diff6
            .getMinutes()
            .toString()}:${diff6.getSeconds().toString().padStart(2, "0")}`;

        var context6 = this;
        if (this.started6)
            setTimeout(function () {
                context6.updateTimer6();
            }, 1000);
    }

    buildStreetQueue6() {
        var queue6 = [];

        for (const [key6, street6] of Object.entries(StreetList6)) {
            queue6.push(key6);
        }

        // naive shuffle
        queue6.sort(() => Math.random() - 0.5);

        this.streetQueue6 = queue6;
    }

    shiftSelectedStreet6(amount) {
        if (!this.started6) return;

        this.currentStreetIndex6 =
            (this.currentStreetIndex6 + amount) % this.streetQueue6.length;
        if (this.currentStreetIndex6 < 0)
            this.currentStreetIndex6 = this.streetQueue6.length - 1;

        document.getElementById("sgCurrentStreet6").innerHTML =
            this.streetQueue6[this.currentStreetIndex6];
    }

    startGame6() {
        if (this.started6) return;   //started = true

        this.buildStreetQueue6();	 //street name array

        this.currentStreetIndex6 = 0; //set to index 0
        this.started6 = true;		  //start = 1

        this.guesses6 = 0;
        this.correct6 = 0;
        this.startTime6 = new Date();

        this.updateLabels6();
        this.updateTimer6();

        this.shiftSelectedStreet6(0);

        document.getElementById("sgRetry6").style.display = "inline";
    }

    endGame6() {
        if (!this.started6) return;

        this.started6 = false;
        this.showEndGame6();
    }

    showEndGame6() {
        this.map.resetView();

        var overlayParent6 = document.getElementById("sgOverlay6");

        overlayParent6.style.display = "block";
        overlayParent6.className = "sg-overlay sg-overlay-fadein";

        document.getElementById("sgEndPercent6").innerHTML = `${Math.round(
            (this.correct6 / Object.keys(StreetList6).length) * 100
        )}%`;
        document.getElementById("sgEndScore6").innerHTML = `${this.correct6}/${
            Object.keys(StreetList6).length
        }`;

        var time6 = new Date();
        var diff6 = new Date(time6.getTime() - this.startTime6.getTime());

        document.getElementById("sgEndTime6").innerHTML = `${diff6
            .getMinutes()
            .toString()}:${diff6.getSeconds().toString().padStart(2, "0")}`;
    }

    retry6() {
        var overlayParent6 = document.getElementById("sgOverlay6");

        overlayParent6.style.display = "none";
        overlayParent6.className = "sg-overlay";

        this.map.clearMapObjects();

        for (const [key6, street6] of Object.entries(StreetList6)) {
            this.map.addMapObject(
                key6,
                new StreetGuesserStreetObject6(this.map, street6)
            );
        }

        this.buildStreetQueue6();

        this.startGame6();
    }
}
