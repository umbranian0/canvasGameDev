var Missil = Entity.extend(function () {

		var explosionY; // variavel utilizada para centrar a explosao
		this.damageLevel = 0;
		this.states = {
			ATIVO: 'ATIVO',
			EXPLODIR: 'EXPLODIR'
		};

		this.constructor = function (spriteSheet, x, y, damageLevel, sounds) {
			this.super();
			this.spriteSheet = spriteSheet; // spriteSheet
			this.x = x; //posX inicial
			this.y = y; // posY inicial
			this.currentState = this.states.ATIVO; //estado inicial
			this.currentFrame = 0; //frame inicial
			this.vx = 5;
			this.vy = 3;
			this.damageLevel = damageLevel;
			this.sounds = sounds;
			setup();
			explosionY = this.y;
			this.sounds.LAUNCH.play(false, 1);
		};

		this.update = function () {
			if (!this.active)
				return;

			if (this.currState === this.states.EXPLODIR && this.currentFrame === 0) {
				explosionY = this.y - this.height / 2; // centrar a explosão
			}

			this.x -= this.vx;
			this.vx += this.vx > 0 ? 0.5 : 0;

			if (this.currState !== this.states.EXPLODIR)
				this.y += this.vy;
			else
				this.y = explosionY;

			this.width = this.frames[this.currentFrame].width;
			this.height = this.frames[this.currentFrame].height;
			this.updateSize();

			if (this.currState == this.states.EXPLODIR && this.currentFrame == this.frames.length - 1)
				this.active = false;

			if (this.currentFrame < this.frames.length - 1)
				this.currentFrame++;
			else
				this.currentFrame = 0;
		};

		var setup = function () {
			this.eStates.ATIVO 		= this.spriteSheet.getStats(this.states.ATIVO);
			this.eStates.EXPLODIR 	= this.spriteSheet.getStats('DETONACAO');
			 
			this.frames = this.eStates[this.currentState];
			this.width = this.frames[0].width;
			this.height = this.frames[0].height;

		}.bind(this);

		this.explodir = function () {
			if (!this.active) return;
			toogleState(this.states.EXPLODIR);
			this.vx = 0;
			this.sounds.EXPLOSION.play(false, 1);
		};

		var toogleState = function (theState) {
			if (this.currState !== theState) {
				this.currState = theState;
				this.frames = this.eStates[this.currState];
				this.currentFrame = 0;
			}
		}.bind(this);

	});
