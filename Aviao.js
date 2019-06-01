var Aviao = Entity.extend(function () {
		this.currState = undefined; // estado atual;
		var podeDisparar = false;
		this.energia = 100;
		this.states = {
			VOAR: 'VOAR',
			DISPARAR: 'DISPARAR',
			LOOP: 'LOOP',
			ATINGIDO: 'ATINGIDO'
		};
		
		this.sounds = {};

		this.constructor = function (spriteSheet, x, y, sounds) {
			this.super();
			this.x = x;
			this.y = y;
			this.spriteSheet = spriteSheet;
			this.currState = this.states.VOAR;
			this.currentFrame = 0;
			this.isColliding = false;
			this.sounds = sounds;
			this.sounds.VOAR.play(true, 1);
			setup();

			this.sounds.VOAR.play(true, 1);
		};

		this.update = function () {
			if (!this.active)return;
			
			if (this.currState == this.states.ATINGIDO && this.currentFrame == this.frames.length - 1) {
				this.active = false;
			}

			this.currentFrame = (++this.currentFrame)%this.frames.length;
			
			this.width = this.frames[this.currentFrame].width; //atualizar a altura
			this.height = this.frames[this.currentFrame].height; // atualizar os
			this.updateSize();

			this.vx = 5;
			this.x -= this.vx;

			if (this.currState === this.states.DISPARAR && this.currentFrame === this.frames.length - 1) {
				this.voar();
			}

			if (this.currState === this.states.LOOP && this.currentFrame === this.frames.length - 1) {
				this.voar();
			}
			
			if (this.energia <= 0)this.atingido();

		};

		var setup = function () {

			this.eStates.VOAR = 	this.spriteSheet.getStats(this.states.VOAR);
			this.eStates.DISPARAR = this.spriteSheet.getStats(this.states.DISPARAR);
			this.eStates.LOOP = 	this.spriteSheet.getStats(this.states.LOOP);
			this.eStates.ATINGIDO = this.spriteSheet.getStats('EXPLODIR');
			 
			
			this.frames = this.eStates[this.currState];
			this.width  = this.frames[0].width; //atualizar a altura
			this.height = this.frames[0].height; // atualizar os

			// atualizar o array de frames atual

		}.bind(this);

		this.voar = function () {
			toogleState(this.states.VOAR);
		}

		this.loop = function () {
			toogleState(this.states.LOOP);
		}

		this.disparar = function () {
			toogleState(this.states.DISPARAR);

		}

		this.atingido = function () {
			if (this.killed)return;
			toogleState(this.states.ATINGIDO);
			this.killed = true;
			this.sounds.VOAR.stop();
			this.sounds.EXPLOSION.play(false, 1);
		}

		var toogleState = function (theState) {
			if (this.killed)return;
			if (this.currState != theState) {
				this.currState = theState;
				 
				this.frames = this.eStates[theState];
				this.currentFrame = 0;
			}
		}.bind(this);

});
