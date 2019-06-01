var Soldado = Entity.extend(function () {
		this.currState = undefined; // estado atual;
		 
		var podeDisparar = false;
		var vFrame = 0;
		var callback = undefined;
		this.energia = 100;
		this.sounds = {};

		this.states = {
			ANDAR: 'ANDAR',
			DISPARAR: 'DISPARAR',
			PARADO: 'PARADO',
			ATINGIDO: 'ATINGIDO'
		};

		this.constructor = function (spriteSheet, x, y, sounds) {
			this.super();
			this.x = x;
			this.y = y;
			this.spriteSheet = spriteSheet;
			this.currState = this.states.PARADO;
			this.currentFrame = 0;
			podeDisparar = true;
			setup();
			this.sounds = sounds;
		};

		this.update = function () {
			if (!this.active)
				return; //se não esta ativo não se faz nada
		 
			// usa-se uma frame virtual para diminuir o frame rate
			vFrame = vFrame < this.frames.length - 1 ? vFrame + 0.3 : 0;

			this.currentFrame = Math.floor(vFrame);

			this.width = this.frames[this.currentFrame].width; //atualizar a altura
			this.height = this.frames[this.currentFrame].height; // atualizar os
			this.updateSize();
			// andamento automatico
			if (this.currState === this.states.ANDAR) {
				this.vx = 2;
				this.x -= this.vx;
			}

			// só pode disparar depois de terminar a animação de disparo anterior
			if (this.currState === this.states.DISPARAR && this.currentFrame == this.frames.length - 1) {
				if (callback !== undefined)	callback();
				this.andar(); // depois de disparar continua a andar;
				podeDisparar = true;
			}

			// se terminou a animação de morrer desativa-se para ser removido da memoria
			if (this.currState == this.states.ATINGIDO && this.currentFrame == this.frames.length - 1) {
				this.active = false;
			}
			if (this.energia <= 0)
				this.atingido();
		};

		var setup = function () {
			this.eStates.ANDAR = 	this.spriteSheet.getStats(this.states.ANDAR);
			this.eStates.DISPARAR = this.spriteSheet.getStats(this.states.DISPARAR);
			this.eStates.PARADO = 	this.spriteSheet.getStats(this.states.PARADO);
			this.eStates.ATINGIDO = this.spriteSheet.getStats('MORRER');
			
			this.frames = this.eStates[this.currState];
			this.width = this.frames[0].width; //atualizar a altura
			this.height = this.frames[0].height; // atualizar os
			// atualizar o array de frames atual
		}
		.bind(this);

		// verifica se o soldado ainda esta a disparar
		this.estaADisparar = function () {
			return (!podeDisparar);
		};

		this.andar = function () {
			toogleState(this.states.ANDAR);
		};

		this.parar = function () {
			toogleState(this.states.PARADO);
		};

		this.disparar = function (criarBala) {
			if (!podeDisparar)	return;
			toogleState(this.states.DISPARAR);
			podeDisparar = false;
			var shot = Math.random() * 50;
			if (shot > 15)
				this.sounds.TIRO.play(false, 0.08);
			else
				this.sounds.TIRO2.play(false, 0.08);
			callback = criarBala;
		};

		this.atingido = function () {
			if (this.killed)return; //se já foi atingido não é outra vez
			toogleState(this.states.ATINGIDO);
			this.killed = true; // marca-se como morto
			this.sounds.MORRER.play(false, 2);
		};

		var toogleState = function (theState) {
			if (this.killed)
				return; // se ja foi atingido não se pode mudar o estado
			if (this.currState !== theState) {
				this.currState = theState;
				this.frames = this.eStates[theState];
				this.currentFrame = 0;
				vFrame = 0;
				podeDisparar = true;

			}
		}.bind(this);

});
