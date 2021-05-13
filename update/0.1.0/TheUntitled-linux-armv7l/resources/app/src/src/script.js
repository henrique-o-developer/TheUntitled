const { ipcRenderer } = require("electron");
ipcRenderer.send("game-inited", false)
const EventEmitter = require("events")
const Mega = require("megadb");
const UsersDB = new Mega.crearDB("Users")
var sprites = [];
var locales = [
    {
        src: "img/casa.png",
        w: 800,
        h: 600,
        add: 15,
        view: true,
        player: true
    }, 
    {
        src: "img/casa_escura.png",
        w: 800,
        h: 600,
        add: 15,
        view: false,
        player: true
    }, 
    {
        src: "img/scene.png",
        w: 800,
        h: 600,
        add: 0,
        view: false,
        player: true
    },
    {
        src: "img/cidade noite.png",
        w: 800,
        h: 600,
        add: 0,
        view: false,
        player: true
    },
    {
        src: "img/bau.png",
        w: 800,
        h: 600,
        add: 0,
        view: false,
        player: false
    },
    {
        src: "img/invent.png",
        w: 800,
        h: 600,
        add: 0,
        view: false,
        player: false
    }
];
for (var i in locales) {
    var gameWorld = {
        img: locales[i].src,
        x: 0,
        y: 0,
        width: locales[i].w, //scene.width,
        height: locales[i].h, //scene.height,
        add: locales[i].add,
        view: locales[i].view,
        player: locales[i].player
    };
    sprites.push(gameWorld)
}

async function del(nome) {
    if (UsersDB.tiene(`all.${nome}-password`)) {
        document.getElementById("body").innerHTML = `
        <br><br><br><br><br><br><br><br><br><br><br>
        <center><button id="con"> CONFIRMAR </button>
        <button onclick="javascript: window.location.reload()"> VOLTAR </button></center>
        `

        document.getElementById("con").addEventListener('click', () => {
            UsersDB.delete(`all.${nome}-password`)
            window.location.reload()
        })
    } else {
        document.getElementById("body").innerHTML = `
            <div class="centrot">
                <form action="javascript: 1*1;"><br><br><br><br><br><br><br><br><br><br><br>
                    <center><label for="pass">Senha: </label><input type="password" required="true" name="pass" id="senha"></center>
                    <br>
                    <center>
                        <input id="con" type="submit" value=" CONFIRMAR ">
                        <input onclick="javascript: window.location.reload()" type="submit" value=" VOLTAR ">
                    </center>
                </form>
            </div>
        `

        document.getElementById("con").addEventListener('click', () => {
            var senha = document.getElementById("senha").value
            if (UsersDB.tiene(`all.${nome}-${senha}`)) {
                UsersDB.delete(`all.${nome}-${senha}`)
                window.location.reload()
            } else {
                alert("senha errada!")
                del(nome)
            }
        })
    }
}

async function create() {
    var val = document.getElementById("nome").value
    var checkbox = document.getElementById(`comSenha`)
    var senha;
    if (checkbox.checked) {
        if (document.getElementById(`senha`).value) {
            senha = document.getElementById(`senha`).value
        } else {
            return alert("coloque uma senha")
        }
    } else {
        senha = "password"
    }
    if (val) {
        if (UsersDB.tiene(`all.${val}-${senha}`)) {
            alert("este usuario já esta cadastrado!")
        } else {
            UsersDB.set(`all.${val}-${senha}`, {
                posX: 674,
                posY: 159,
                pX: 0,
                pY: 0,
                more: 0,
                cite: 2,
                cam: true,
                equiped: {},
                itens: [
                    {
                        name: "espada",
                        src: "img/espada.png",
                        type: "attack",
                        strength: 10,
                        locale: "punho"
                    },
                    {
                        name: "couraça",
                        src: "img/couraça.png",
                        type: "defence",
                        strength: 10,
                        locale: "corpo"
                    }
                ],
                srcX: 0,
                srcY: 32 * 2,
                sprites: sprites,
                inv: [],
                saved_points: [
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                    {},
                ]
            })
            jogo(val, senha)
            alert("Controles:\nsetas: mover-se, ex: mover-se para o lado\nbarra de espaço: confirmar açoes, ex: você esta na porta e clica espaço, você entra\nenter: selecionar itens no bau, ex: enter em um item\ntecla e: abrir o inventario")
        }
    }
}

async function init(nome) {
    const body = document.getElementById("body")
    if (UsersDB.tiene(`all.${nome}-password`)) {
        document.getElementById("html").style.overflow = "hidden"
    
        body.innerHTML = `
            <canvas width="400px" height="300px" id="canvas"></canvas>
        `
        jogo(nome, "password")
    } else {
        body.innerHTML = `
            <div class="centrot">
                <form action="javascript: 1*1;"><br><br><br><br><br><br><br><br><br><br><br>
                    <center><label for="name">Senha:</label>
                    <input type="password" name="name" required="true" id="senha">
                    <input type="submit" value="Jogar!" id="0"></center>
                </form>
            </div>
        `
        document.getElementById("0").addEventListener("click", () => {
            var correct = UsersDB.tiene(`all.${nome}-${document.getElementById("senha").value}`)
            console.log(nome, document.getElementById("senha").value)
            if (correct) {
                jogo(nome, document.getElementById("senha").value)
            } else {
                alert("Senha incorreta")
            }
        })
    }
}

async function jogo(nome, senha) {
    const body = document.getElementById("body")
    
    body.innerHTML = `
        <canvas width="400px" height="300px" id="canvas"></canvas>
    `
    
    //Constantes que armazenam o código de cada seta do teclado
var E = 69, LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40, SPACE = 32, INIT_W_B = 68, INIT_H_B = 51, NEW_W_B = 45, NEW_H_B = 52, ENTER = 13, INIT_W_I = 95, INIT_W_E = 26, INIT_H_E = 103;
    
var cnv = document.querySelector("#canvas");
console.log(cnv)
var	ctx = cnv.getContext("2d");
var colisoes = new Colisoes()
var spriteSheet = new Image();
spriteSheet.src = "img/img.png";
var player = await UsersDB.obtener(`all.${nome}-${senha}`)
console.log(player)
var zezim = new Sprite(spriteSheet, player);
ipcRenderer.send("game-inited", {
    "saved_points": zezim.saved_points
})
var sprites = [];

player.sprites.forEach((val) => {
    var img = new Image()
    img.src = val.img
    var gameWorld = {
        img: img,
        x: 0,
        y: 0,
        width: val.width, //scene.width,
        height: val.height, //scene.height,
        add: val.add,
        view: val.view,
        player: val.player
    }
    sprites.push(gameWorld)
})

var cam = {
    x: 0,
    y: 0,
    width: cnv.width,
    height: cnv.height,
    leftEdge: function () {
        return this.x + (this.width * 0.25)
    },
    rightEdge: function () {
        return this.x + (this.width * 0.75)
    },
    topEdge: function () {
        return this.y + (this.height * 0.25)
    },
    bottomEdge: function () {
        return this.y + (this.height * 0.75)
    }
};
sprites.forEach((val) => {
    if (val.view == true) {
        cam.x = 0 
        cam.y = 0
    }
})
window.addEventListener("keydown",keydownHandler,false);
window.addEventListener("keyup",keyupHandler,false);




    window.addEventListener('keydown', keydownHandler, false)
    window.addEventListener('keyup', keyupHandler, false)

    function keyupHandler(e) {
        switch (e.key) {
            case "ArrowRight":
                zezim.mvRight = false
                zezim.mvUp = false
                zezim.mvDown = false
                zezim.mvLeft = false
                break;   
            case "ArrowLeft":
                zezim.mvRight = false
                zezim.mvUp = false
                zezim.mvDown = false
                zezim.mvLeft = false 
                break;
            case "ArrowDown":
                zezim.mvRight = false
                zezim.mvUp = false
                zezim.mvDown = false
                zezim.mvLeft = false
                break;   
            case "ArrowUp":
                zezim.mvRight = false
                zezim.mvUp = false
                zezim.mvDown = false
                zezim.mvLeft = false
                break;
            case "Control": 
                zezim.ctrl = false
                break;    
            default:
                break;
        }
    }

    ipcRenderer.on("del", (event, arg) => {
        if (arg) {
            alert("deleted")
            zezim.saved_points.splice(arg, 1)
            zezim.saved_points.splice(arg, 0, {})
            ipcRenderer.send("game-inited", {
                "saved_points": zezim.saved_points
            })
        }
    })
    ipcRenderer.on("tel", (event, arg) => {
        if (arg) {
            alert("teleported")
            var sprs = []
            var point = zezim.saved_points[arg]
            point.sprites.forEach((val) => {
                var img = new Image()
                img.src = val.img
                var gameWorld = {
                    img: img,
                    x: 0,
                    y: 0,
                    width: val.width, //scene.width,
                    height: val.height, //scene.height,
                    add: val.add,
                    view: val.view,
                    player: val.player
                }
                sprs.push(gameWorld)
            });
            zezim.posX = point.x
            zezim.posY = point.y
            sprites = sprs
        }
    })


    ipcRenderer.on("cadaster", (event, arg) => {
        function voltar() {
            body.innerHTML = `<canvas width="400px" height="300px" id="canvas"></canvas>`
            cnv = document.getElementById("canvas")
            ctx = cnv.getContext("2d");
        }

        if (arg) {
            var nome;
            var sprs = []
            sprites.forEach((val) => {
                var gameWorld = {
                    img: `img${val.img.src.split("img")[1].replace(/%20/g, " ")}`,
                    x: val.x,
                    y: val.y,
                    width: val.width, //scene.width,
                    height: val.height, //scene.height,
                    add: val.add,
                    view: val.view,
                    player: val.player
                }
                sprs.push(gameWorld)
            })
            body.innerHTML = `<center><form action="javascript: 1*1;"><br><br><br><br><br><br><br><br><br><br><br>
                <input type="text" id="nome">
                <input type="submit" id="confirmar" value="cadastrar">
                <input type="submit" id="voltar" value="voltar">
            </form></center>`
            
            document.getElementById("confirmar").addEventListener('click', () => {
                nome = document.getElementById("nome").value
                if (nome == ``) {
                    nome = false
                } else {
                    alert("cadastrado")
                    zezim.saved_points.splice(arg, 1)
                    zezim.saved_points.splice(arg, 0, {
                        name: nome,
                        x: zezim.posX,
                        y: zezim.posY,
                        sprites: sprs
                    })
                    ipcRenderer.send("game-inited", {
                        "saved_points": zezim.saved_points
                    })
                    voltar()
                }
            })
            document.getElementById("voltar").addEventListener('click', () => {
                voltar()
            })
        }
    })    

    ipcRenderer.on('save', (event, arg) => {
        if (arg) {
            if (zezim.items == false) {
                var sprs = []
                sprites.forEach((val) => {
                    var gameWorld = {
                        img: `img${val.img.src.split("img")[1].replace(/%20/g, " ")}`,
                        x: val.x,
                        y: val.y,
                        width: val.width, //scene.width,
                        height: val.height, //scene.height,
                        add: val.add,
                        view: val.view,
                        player: val.player
                    }
                    sprs.push(gameWorld)
                })
                UsersDB.set(`all.${nome}-${senha}`, {
                    posX: zezim.posX,
                    posY: zezim.posY,
                    pX: zezim.pX,
                    pY: zezim.pY,
                    more: zezim.more,
                    cite: zezim.cite,
                    cam: zezim.cam,
                    equiped: zezim.equiped,
                    itens: zezim.itens,
                    srcX: zezim.srcX, 
                    srcY: zezim.srcY,
                    sprites: sprs,
                    inv: zezim.inv,
                    saved_points: zezim.saved_points
                })
                if (arg == `save`) {
                    alert("dados salvos")
                } else if (arg == `saveAndReload`) {
                    window.location.reload()
                }
            } else {
                alert("saia do bau/inventario para salvar!")
            }
        }
    })

    function showI(zezimm, src, conteiner, INIT_W, INIT_H) {
        var bau = -1
        var col = 0
        var rectangle = new Path2D();
        rectangle.fillStyle = "#54eb00"
        rectangle.rect(zezim.selectedX, zezim.selectedY+1, 39, 40);
        ctx.stroke(rectangle);
        zezim[conteiner].forEach((val, index) => {
            bau++
            var x = INIT_W;
            var y = INIT_H;
            if (bau == 6) {
                bau = -1
                col++
            }

            if (bau == 0) {
                x = INIT_W
                y = INIT_H
            } else {
                for (var i = 0; i < bau; i++) {
                    x += NEW_W_B
                }
                for (var i = 0; i < col; i++) {
                    y += NEW_H_B
                }
            }

            var img = new Image()
            img.src = `${val.src}`
            ctx.drawImage(img, 0, 0, 37, 40, x, y, 37, 40)
        })

        if (zezim.items == "invent") {
            Object.keys(zezim.equiped).forEach((vali) => {
                var val = zezim.equiped[vali]
                var img = new Image()
                img.src = val.src
                if (val.locale == "punho") {
                    ctx.drawImage(img, 0, 0, 37, 40, 49, 103, 37, 40)
                }
                if (val.locale == "corpo") {
                    ctx.drawImage(img, 0, 0, 37, 40, 49, 155, 37, 40)
                }
            })
        }
    } 

    function keydownHandler(e) {
        console.log(e.key)
        switch (e.key) {
            case "ArrowRight":
                zezim.mvRight = true
                zezim.mvUp = false
                zezim.mvDown = false
                zezim.mvLeft = false
                break;   
            case "ArrowLeft":
                zezim.mvRight = false
                zezim.mvUp = false
                zezim.mvDown = false
                zezim.mvLeft = true  
                break;
            case "ArrowDown":
                zezim.mvRight = false
                zezim.mvUp = false
                zezim.mvDown = true
                zezim.mvLeft = false
                break;   
            case "ArrowUp":
                zezim.mvRight = false
                zezim.mvUp = true
                zezim.mvDown = false
                zezim.mvLeft = false
                break;
            case "Control":
                zezim.ctrl = true
                break;
            case " ":
                //* condições de lugares
                if (zezim.posY >= 83 && zezim.posY <= 100 && zezim.posX >= 587 && zezim.posX <= 612 && sprites[0].view == true) {
                    zezim.posX = (29 + 47) / 2
                    zezim.posY = 99
                    zezim.srcY = 32 * 0
                    sprites[0].view = false
                    sprites[zezim.cite].view = true
                    sprites[2].view = true
                    break;
                }
                if (zezim.posY >= 97 && zezim.posY <= 110 && zezim.posX >= 29 && zezim.posX <= 47 && sprites[zezim.cite].view == true) {
                    zezim.posX = (587 + 612) / 2
                    zezim.posY = 83
                    zezim.srcY = 32 * 0
                    sprites[0].view = true
                    sprites[zezim.cite].view = false 
                    sprites[2].view = false 
                    break;
                }
                if (zezim.posX == 726 && zezim.posY >= 87 && zezim.posY <=  110 && sprites[0].view == true && zezim.srcY == 32 * 2) {
                    zezim.srcY = 32 * 1
                    setTimeout(() => {
                        zezim.srcY = 32 * 2
                        setTimeout(() => {
                            zezim.srcY = 32 * Math.floor(Math.random() * 3) + 1
                            zezim.posY = 103
                            zezim.posX = 688
                        }, 500);
                        sprites[1].view = true
                        zezim.cite = 3
                    }, 1000)
                    break;
                }
                if (zezim.posX == 688 && zezim.posY == 103 && sprites[1].view == true) {
                    setTimeout(() => {
                        zezim.srcY = 32 * 2
                        setTimeout(() => {
                            zezim.srcY = 32 * Math.floor(Math.random() * 3) + 1
                            zezim.posY = (87 + 110) / 2
                            zezim.srcY = 32 * 0
                            zezim.posX = 726
                        }, 500);
                        sprites[0].view = true
                        zezim.srcY = 32 * 3
                        sprites[1].view = false
                        zezim.cite = 2
                    }, 1000)
                    break;
                }
                if (zezim.posX == 726 && zezim.posY >= 87 && zezim.posY <=  110 && sprites[0].view == true && sprites[5].view == false && zezim.srcY == 32 * 1) {
                    sprites[4].view = true
                    sprites[0].view = false
                    cam.x = cam.y = 0
                    zezim.cam = false
                    zezim.items = "bau_casa"
                    zezim.selectedX = 68
                    zezim.selectedY = 51
                    zezim.bau = 0
                    zezim.col = 0
                    zezim.inum = 0
                    break;
                }
                if (sprites[4].view == true) {
                    sprites[4].view = false
                    sprites[0].view = true
                    zezim.cam = true
                    zezim.posX = 726
                    zezim.posY = (87 + 110) / 2
                    zezim.srcY = 32 * 1
                    zezim.items = false
                    zezim.md.code == false 
                    zezim.md.num == 0
                    break;
                }
                break;
            case "e":
                if (zezim.items == false || zezim.items == "invent") {
                    if (sprites[5].view == true) {
                        sprites[5].view = false
                        zezim.moviment = true
                        zezim.items = false
                        zezim.md.code == false 
                        zezim.md.num == 0
                    } else {
                        sprites[5].view = true
                        zezim.moviment = false
                        cam.x = cam.y = 0
                        zezim.items = "invent"
                        zezim.bau = 0
                        zezim.col = 0
                        zezim.inum = 0
                        zezim.selectedX = 95
                        zezim.selectedY = 51
                    }
                }
                break;
            default:
                break;
        }
    }

    //Quano a imagem é carregada, o programa é iniciado
    spriteSheet.onload = function(){
        init();
    }

    function init(){
        loop();
    }

    function update(){
        if (zezim.moviment) {
            zezim.move();
            if (zezim.cam = true) {
                if (zezim.posX < cam.leftEdge()) {
                    cam.x = zezim.posX - (cam.width * 0.25);
                }
                if (zezim.posX + zezim.width > cam.rightEdge()) {
                    cam.x = zezim.posX + zezim.width - (cam.width * 0.75)
                }
                if (zezim.posY < cam.topEdge()) {
                    cam.y = zezim.posY - (cam.height * 0.25)
                }
                if (zezim.posY + zezim.height > cam.bottomEdge()) {
                    cam.y = zezim.posY + zezim.height - (cam.height * 0.75)
                }
            }

            if (cam.x < 0) {
                cam.x = 0;
            }
            if (cam.x + cam.width > gameWorld.width) {
                cam.x = gameWorld.width - cam.width;
            }
            if (cam.y < 0) {
                cam.y = 0;
            }
            if (cam.y + cam.height > gameWorld.height) {
                cam.y = gameWorld.height - cam.height;
            } 

            if (zezim.posX < 0){ 
                zezim.posX = 0;
            }
            if (zezim.posX + zezim.width > gameWorld.width) {
                zezim.posX = gameWorld.width - zezim.width;
            }
            if (zezim.posY < 0) {
                zezim.posY = 0; 
            }
            if (zezim.posY + zezim.height > gameWorld.height) {
                zezim.posY = gameWorld.height - zezim.height;
            }
            
            sprites.forEach((vaul, indexi) => {
                colisoes.data.forEach((vail, index) => {
                    if (vaul.view == true && indexi == index) {
                        vail.forEach((val) => {
                            var catX = zezim.centerX() - (val.x + (val.width / 2))
                            var catY = zezim.centerY() - ((val.y - zezim.height / 4) + (val.height  / 2))
                            var sumHalfWidth = zezim.halfWidth() + (val.width / 2)
                            var sumHalfHeight = (zezim.height / 4) + (val.height / 2)
                            var sig = undefined, x = undefined, y = undefined, pass = undefined, semArg = false
                            if (val.cond) {
                                if (val.cond.x) {
                                    x = val.cond.x
                                } else {
                                    pass = true
                                    semArg = true
                                } 
                                if (val.cond.y) {
                                    y = val.cond.y
                                } else {
                                    pass = true
                                    semArg = true
                                }
                                if (val.cond.sig) {
                                    sig = val.cond.sig
                                } else {
                                    pass = true
                                    semArg = true
                                }
                            } else {
                                pass = true
                                semArg = true
                            }

                            if (semArg == false) {
                                if (sig == "==, false") {
                                    if (zezim.posX == x && zezim.posY == y) {
                                        pass = false
                                    } else {
                                        pass = true
                                    }
                                }
                            }

                            if (Math.abs(catX) < sumHalfWidth && Math.abs(catY) < sumHalfHeight && pass == true) {
                                var overlapX = sumHalfWidth - Math.abs(catX)
                                var overlapY = sumHalfHeight - Math.abs(catY)

                                if (overlapX >= overlapY) {
                                    if (catY > 0) {
                                        zezim.posY += overlapY
                                    } else {
                                        zezim.posY -= overlapY
                                    }
                                } else if (overlapX <= overlapY) {
                                    if (catX > 0) {
                                        zezim.posX += overlapX
                                    } else {
                                        zezim.posX -= overlapX
                                    }
                                }
                            }
                        })
                    }
                })
            })
        }
    }

    function draw(){
        ctx.save()
        ctx.translate(-cam.x, -cam.y)
        for (var i in sprites) {
            var spr = sprites[i];
            if (spr.view == true) {
                zezim.itens.forEach((val, index) => {
                    var x = 0;
                    var y = 0;
                    if (index == 0) {
                        x = INIT_W_B
                        y = INIT_H_B
                    }
                    var img = new Image()
                    img.src = `${val.src}`
                    ctx.drawImage(img, 0, 0, 37, 40, x, y, 37, 40)
                })
                ctx.clearRect(0, 0, cnv.width, cnv.height)
                ctx.drawImage(spr.img, 0, 0, spr.width, spr.height, spr.x, spr.y, spr.width, spr.height)
                zezim.more = spr.add
                if (spr.player == true) {
                    zezim.draw(ctx);
                }
            }
        }
        if (zezim.items == "bau_casa") {
            showI(zezim, "img/bau.png", "itens", INIT_W_B, 51)
            if (zezim.md.num != 4) {
                zezim.md.code = 1
                zezim.md.num = 4
                zezim.md.INIT_W_B = INIT_W_B
                zezim.md.h = 51
                zezim.md.itens = "itens"
                zezim.md.xMax = 293
                zezim.md.xMin = 68
                zezim.md.yMax = 207
                zezim.md.yMin = 51
                zezim.md.inf = false
            }
            document.addEventListener('keydown', function(e) {
                zezim.md.code = e.keyCode
                zezim.md.num = 4
                zezim.md.INIT_W_B = INIT_W_B
                zezim.md.h = 51
                zezim.md.itens = "itens"
                zezim.md.xMax = 293
                zezim.md.xMin = 68
                zezim.md.yMax = 207
                zezim.md.yMin = 51
            }, true);
        } else if (zezim.items == "invent") {
            showI(zezim, "img/invent.png", "itens", INIT_W_I, 51)
            if (zezim.md.num != 5) {
                zezim.md.code = 1
                zezim.md.num = 5
                zezim.md.INIT_W_B = INIT_W_I
                zezim.md.h = 51
                zezim.md.itens = "inv"
                zezim.md.xMax = 320
                zezim.md.xMin = 50
                zezim.md.yMax = 207
                zezim.md.yMin = 51
                zezim.md.inf = false
            }
            document.addEventListener('keydown', function(e) {
                zezim.md.code = e.keyCode
                zezim.md.num = 5
                zezim.md.INIT_W_B = INIT_W_I
                zezim.md.h = 51
                zezim.md.itens = "inv"
                zezim.md.xMax = 320
                zezim.md.xMin = 50
                zezim.md.yMax = 207
                zezim.md.yMin = 51
            }, true);
        }
        ctx.restore()
    }

    function loop(){
        window.requestAnimationFrame(loop,cnv);
        draw()
        update()
        if (zezim.md.code != false && zezim.md.num != 0 && zezim.items != false) {
            var code = zezim.md.code
            var x = zezim.selectedX
            var y = zezim.selectedY
            var xMax = zezim.md.xMax
            var xMin = zezim.md.xMin
            var yMax = zezim.md.yMax
            var yMin = zezim.md.yMin
            var spr = sprites[zezim.md.num]
            var inf = false
            var lista = ``
            var INIT_W_B = zezim.md.INIT_W_B
            var INIT_H_B = zezim.md.h
            var itens = zezim.md.itens


            ctx.clearRect(0, 0, cnv.width, cnv.height)
            showI(zezim, "", itens, INIT_W_B, INIT_H_B)
            ctx.drawImage(spr.img, 0, 0, spr.width, spr.height, spr.x, spr.y, spr.width, spr.height)



            if (code == UP) {
                zezim.selectedY -= NEW_H_B
                y -= NEW_H_B
                zezim.col--
                zezim.inum -= 6
            } else if (code == DOWN) {
                zezim.selectedY += NEW_H_B
                y += NEW_H_B
                zezim.col++
                zezim.inum += 6
            } else if (code == RIGHT) {
                zezim.selectedX += NEW_W_B
                x += NEW_W_B
                zezim.bau++
                if (x - NEW_W_B != 50) {
                    zezim.inum++
                }
            } else if (code == LEFT) {
                zezim.selectedX -= NEW_W_B
                x -= NEW_W_B
                zezim.bau--
                if (x != 50) {
                    zezim.inum--
                }
            } 
            if (x == 50 && y == 103) {
                zezim.md.inum = `punho`
            } else if (x == 50 && y == 155) {
                zezim.md.inum = `corpo`
            } else {
                zezim.md.inum = 2
            }
            if (code == ENTER) {
                zezim.md.inf = true
                if (zezim.md.inum == 2) {
                    console.log(zezim.inum)
                    if (!zezim[itens][zezim.inum]) {
                        lista = `não há items neste eslote`
                    } else {
                        lista = `${zezim[itens][zezim.inum].name}\ntype: ${zezim[itens][zezim.inum].type}\nstrength: ${zezim[itens][zezim.inum].strength}\nprecione 1 para equipar\nprecione 2 para deletar\nprecione 3 para selecionar`
                    }
                } else {
                    if (!zezim.equiped[zezim.md.inum]) {
                        lista = `não há items neste eslote`
                    } else {
                        lista = `${zezim.equiped[zezim.md.inum].name}\ntype: ${zezim.equiped[zezim.md.inum].type}\nstrength: ${zezim.equiped[zezim.md.inum].strength}\nprecione 1 para desequipar\nprecione 2 para deletar`
                    }
                }
                zezim.ent = true
            } else if (code == 49) {
                if (zezim.ent != false) {
                    zezim.ent = false
                    zezim.md.inf = true
                    if (zezim.md.inum == 2) {
                        lista = `Equipado!`
                        zezim.equip(itens, zezim.inum, zezim[itens][zezim.inum].locale)
                        zezim.delItem(itens, zezim.inum)
                    } else {
                        lista = `Desquipado!`
                        zezim.unequip("inv", zezim.equiped[zezim.md.inum].locale)
                    }
                }
            } else if (code == 50) {
                if (zezim.ent != false) {
                    zezim.ent = false
                    zezim.md.inf = true
                    lista = `deletado!`
                    if (zezim.md.inum == 2) {
                        zezim.delItem(itens, zezim.inum)
                    } else {
                        zezim.delEquiped(zezim.equiped[zezim.md.inum].locale)
                    }
                }
            } else if (code == 51) {
                if (zezim.ent != false) {
                    zezim.ent = false
                    zezim.md.inf = true
                    lista = `selecionado!`
                    zezim.select(itens, zezim.inum)
                    setTimeout(() => {
                        zezim.md.code = 0
                        if (!zezim[itens][zezim.inum]) {
                            lista = `não há items neste eslote`
                        } else {
                            lista = `precione 1 para equipar\nprecione 2 para deletar\nprecione 3 para selecionar`
                        }
                    }, 5000)
                }
            }

            if (x > xMax) {
                zezim.selectedX = xMax
                x = xMax
                zezim.bau--
                zezim.inum--
            }
            if (x < xMin) {
                zezim.selectedX = xMin
                x = xMin
                zezim.bau++
                zezim.inum++
            }
            if (y > yMax) {
                zezim.selectedY = yMax
                y = yMax
                zezim.col--
                zezim.inum -= 6
            }
            if (y < yMin) {
                zezim.selectedY = yMin
                y = yMin
                zezim.col++
                zezim.inum += 6
            }
        


            if (zezim.md.beforeF) {
                zezim.md.beforeF(ctx, INIT_H_B, INIT_W_B, code)
            }
            var rectangle = new Path2D();
            rectangle.fillStyle = "#54eb00"
            rectangle.rect(x, y+1, 39, 40);

            ctx.stroke(rectangle);
            showI(zezim, "", itens, INIT_W_B, INIT_H_B)
            if (zezim.md.afterF) {
                zezim.md.afterF(ctx, INIT_H_B, INIT_W_B, code)
            }

            if (zezim.md.inf == true) {
                alert(lista)
            }
            zezim.md.code = false
            zezim.md.num = 0
        }
        if (window.outerWidth < 820) {
            window.resizeTo(820, window.outerHeight);
        }
        if (window.outerHeight < 620) {
            window.resizeTo(window.outerWidth, 620)
        }
    }
}

window.addEventListener("DOMContentLoaded", async function () {
    now()
    if (!UsersDB.tiene("all")) UsersDB.set("all", {})
    var players = await UsersDB.obtener("all")
    var add = ``
    var body = document.getElementById("body")
    Object.keys(players).forEach((val, ind) => {
        add += `<input type="submit" value="${val.split("-")[0]}" onclick="init('${val.split("-")[0]}')">&nbsp;&nbsp;&nbsp;<input type="submit" value="del" onclick="del('${val.split("-")[0]}')"><br>`
    });        
    body.innerHTML = `
        <div class="centrot">
            <form action="javascript: 1*1;"><br><br><br><br><br><br><br><br><br><br><br>
                <center><label for="name">Seu Usuário:</label>
                <input type="text" name="name" required="true" id="nome">
                <input type="submit" value="Começar!" id="0" onclick="create()"></center>
                <br>
                <center><input type="checkbox" id="comSenha" name="check"><label for="check">Senha Necesaria</label></center>
                <center id="append"></center>
                <br><br><br>
                <center class="centro">${add}</center>
            </form>
        </div>
    `
    var checkbox = document.getElementById(`comSenha`)
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            document.getElementById("append").innerHTML = `<br><label for="senhaa">Senha: </label><input type="password" required="true" name="senhaa" id="senha">`
        } else {
            document.getElementById("append").innerHTML = ``

        }
    })
})

function now() {
    window.requestAnimationFrame(now)
    ipcRenderer.send(`me-da-os-dado-po`, true)
}


ipcRenderer.on('reload', (event, arg) => {
    if (arg) {
        if (confirm("Deseja mesmo atualizar?")) {
            window.location.reload()
        }
    }
})

