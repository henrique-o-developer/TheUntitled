function Colisoes() {
    //! this declaration area 
    this.data = [];

    //! var declaration area 
    var scene0 = [
        {
            x: 572,
            y: 18,
            width: 199,
            height: 81
        },
        {
            x: 553,
            y: 18,
            width: 28,
            height: 214
        },
        {
            x: 582,
            y: 218,
            width: 144,
            height: 30
        },
        {
            x: 718,
            y: 254,
            width: 53,
            height: 19
        },
        {
            x: 750,
            y: 18,
            width: 6,
            height: 256
        },
        {
            x: 654,
            y: 97,
            width: 726 - 654,
            height: 159 - 97,
            cond: {
                sig: "==, false",
                x: 688,
                y: 103
            }
        },
        {
            x: 728,
            y: 93,
            width: 728 - 761,
            height: 93 - 125
        },
        {
            x: 596,
            y: 190,
            width: 637 - 596,
            height: 232 - 205
        }
    ];

    var scene1 = [];
    
    var scene2 = [
        {
            x: 25,
            y: 0,
            width: 75,
            height: 113
        },
        {
            x: 125,
            y: 0,
            width: 75,
            height: 113
        },
        {
            x: 25,
            y: 315,
            width: 100,
            height: 228
        },
        {
            x: 125,
            y: 316,
            width: 16,
            height: 43
        },
        {
            x: 0,
            y: 316,
            width: 16,
            height: 43
        },
        {
            x: 76,
            y: 429,
            width: 47,
            height: 106
        },
        {
            x: 125,
            y: 428,
            width: 49,
            height: 114
        },
        {
            x: 133,
            y: 526,
            width: 36,
            height: 35
        },
        {
            x: 8,
            y: 526,
            width: 36,
            height: 43
        },
        {
            x: 0,
            y: 570,
            width: 199,
            height: 29
        },
        {
            x: 376,
            y: 0,
            width: 148,
            height: 456
        },
        {
            x: 525,
            y: 0,
            width: 799 - 525,
            height: 141
        },
        {
            x: 525,
            y: 113,
            width: 599 - 525,
            height: 284 - 133
        },
        {
            x: 525,
            y: 285,
            width: 625 - 525,
            height: 456 - 285
        },

        {
            x: 574,
            y: 457,
            width: 600 - 574,
            height: 484 - 457
        },
        {
            x: 771,
            y: 374,
            width: 799 - 771,
            height: 427 - 374
        },
        {
            x: 750,
            y: 451,
            width: 800 - 750,
            height: 484 - 451
        }
    ];

    var scene3 = [];

    var scene4 = [];

    this.data.push(scene0)
    this.data.push(scene1)
    this.data.push(scene2)
    this.data.push(scene3)
    this.data.push(scene4)

    //! function area 
    
    this.add = function(obj) {
        this.data.push(obj)
        return "you object was pushed with sucess!"
    }

    this.print = function () {
        console.log(this.data)
    }
}