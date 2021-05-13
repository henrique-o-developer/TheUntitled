function Sprite(img, obj) {
	//Atributos ****************
	this.mvLeft = this.mvUp = this.mvRight = this.mvDown = false;
	
	//Origem para captura da imagem a ser exibida
	this.srcX = obj.srcX
	this.srcY = obj.srcY
	//Posição no canvas onde a figura será exibida
	this.posX = obj.posX
	this.posY = obj.posY
	this.width = 24;
	this.height = 32;
	this.orSpeed = 1;
	this.speed;
	this.img = img;
	this.countAnim = 0;
    this.pX = obj.pX
	this.pY = obj.pY
	this.ctrl = false;
	this.more = obj.more
	this.cite = obj.cite
	this.cam = obj.cam
	this.items = false
	this.selectedX = 68
	this.selectedY = 51
	this.md = {code: false, num: 0}
	this.bau = 0
	this.col = 0
	this.inum = 0
	this.selected;
	this.equiped = obj.equiped
	this.ent = false
	this.moviment = true
	this.itens = obj.itens
	this.inv = obj.inv
	this.saved_points = obj.saved_points

	//Métodos *****************
	// delEquiped
	this.delEquiped = function (locale) {
		delete this.equiped[locale]
	}
	// unequip
	this.unequip = function (arrName, locale) {
		var soun = this.addItem(this.equiped[locale], arrName, false)
		if (soun = true) {
			delete this.equiped[locale] 
		} else {
			alert("não há espaço para o item")
		}
	}
	// addItem
	this.addItem = function (item, arrName, cond) {
		if (this[arrName].length == 23) {
			if (cond == true) {
				alert("sem espaço para o item")
			} else {
				return false
			}
		} else {
			this[arrName].push(item)
			return true
		}
	}
	// delItem
	this.delItem = function (ArrName, slot) {
		this[ArrName].splice(slot, 1)
	}
	// select
	this.select = function (arrName, Index) {
		this.select = this[arrName][Index]
	}
	// equip
	this.equip = function (arrName, index, locale) {
		this.equiped[locale] = this[arrName][index]
	}
	//halfs
	this.halfWidth = function() {
		return this.width / 2
	}
	this.halfHeight = function() {
		return this.height / 2
	}
	//center
	this.centerX = function() {
		return this.posX + this.halfWidth()
	}
	this.centerY = function() {
		return this.posY + this.halfHeight()
	}
	//Desenha a figura
	this.draw = function(ctx){
		ctx.drawImage(	this.img,	//Imagem de origem
						//Captura da imagem
						this.srcX,	//Origem da captura no eixo X
						this.srcY,	//Origem da captura no eixo Y
						this.width,	//Largura da imagem que será capturada
						this.height,//Altura da imagem que será capturada
						//Exibição da imagem
						this.posX, //Posição no eixo X onde a imagem será exibida 
						this.posY,	//Posição no eixo Y onde a imagem será exibida 
						this.width + this.more,	//Largura da imagem a ser exibida 
						this.height + this.more //Altura da imagem a ser exibida 
					);
		this.animation();

	}

	//Move a figura
	this.move = function(){
		if (this.ctrl) {
			this.speed = this.orSpeed * 2
		} else {
			this.speed = this.orSpeed
		}
		if(this.mvRight){
			this.posX += this.speed;
			this.srcY = this.height * 3; 
		} else
		if(this.mvLeft){
			this.posX -= this.speed;
			this.srcY = this.height * 2; 
		} else
		if(this.mvUp){
			this.posY -= this.speed;
			this.srcY = this.height * 1; 
		} else
		if(this.mvDown){
			this.posY += this.speed;
			this.srcY = this.height * 0; 
		}
	}
	
	//Anima a figura
	this.animation = function(){
		if(this.mvLeft || this.mvUp || this.mvRight || this.mvDown){
			//Caso qualquer seta seja pressionada, o contador de animação é incrementado
			this.countAnim++;
			if(this.countAnim >= 40){
				this.countAnim = 0;
			}
			this.srcX = Math.floor(this.countAnim / 5) * this.width;
		} else {
			//Caso nenhuma tecla seja pressionada, o contador de animação é zerado e a imagem do personagem parado é exibida
			this.srcX = 0;
			this.countAnim = 0;
		}
	}
}