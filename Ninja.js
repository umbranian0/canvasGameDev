
var Ninja = Entity.extend(function () {
	this.currState = undefined; // estado atual;
	var fdr = 0;
	var podeAtacar = false;

	this.states = {
        Attack: 'Attack',
        Climb: 'Climb',
        Dead: 'Dead',
        Glide: 'Glide',
        Idle: 'Idle',
        Jump: 'Jump',
        Jump_Attack: 'Jump_Attack',
        Jump_Throw: 'Jump_Throw',
        Kunai: 'Kunai',
        Run: 'Run',
        Slide: 'Slide',
        Throw: 'Throw'
	};

	this.sounds = {};

	this.constructor = function (spriteSheet, x, y, sounds) {
		this.super();
		this.x = x;
		this.y = y;
		this.spriteSheet = spriteSheet;
		this.currState = this.states.Idle;
		this.currentFrame = 0;
		this.sounds = sounds;
		//Physics properties
		this.accelerationX = 0;
		this.accelerationY = 0;
		this.speedLimit = 5;
		this.friction = 0.96;
		this.bounce = -0.7;
		this.gravity = 0.3;
		this.jump_y = this.y;
		this.limit = 100;
		this.goingDown = false;
		//activity variables
		this.energia = 100;
		this.isDead = true;
		this.visible = false;
		//bot variable 
		this.bot = false;
		//Platform game properties   
		this.isOnGround = undefined;
		this.jumpForce = -10;
		

		setup();
	};
	this.estaAAtacar = function(){
		return (!podeAtacar);
	}
	
	this.update = function () {
		if (fdr++ % 5 !== 0) return;//mete em slow motion
		fdr = 1;
		if (this.currState == this.states.Dead && this.currentFrame == this.frames.length - 1)
			return;

		this.currentFrame = (++this.currentFrame) % this.frames.length;

		this.width = this.frames[this.currentFrame].width * 0.5; //atualizar a altura
		this.height = this.frames[this.currentFrame].height * 0.5; // atualizar os
		this.updateSize();

		if (this.currState === this.states.Attack && this.currentFrame == this.frames.length - 1) {
			this.parar();
		}
		//condição para saltar
		if (this.jump) animarSalto();

		// andamento automatico
		if (this.currState === this.states.Run) {
			this.vx = 1;
			this.x -= this.vx;
		}
		// s� pode disparar depois de terminar a anima��o de disparo anterior
		if (this.currState === this.states.Attack && this.currentFrame == this.frames.length - 1) {
			if (callback !== undefined) callback();
			this.andar(); // depois de disparar continua a andar;
			podeAtacar = true;
		}
		if (this.visible && this.isDead)
			this.y <= this.height ? this.y += this.vy : this.visible = false;
	};

	var setup = function () {
        this.eStates.Attack = this.spriteSheet.getStats(this.states.Attack);
        this.eStates.Dead = this.spriteSheet.getStats(this.states.Dead);
        this.eStates.Glide = this.spriteSheet.getStats(this.states.Glide);
        this.eStates.Idle = this.spriteSheet.getStats(this.states.Idle);
        this.eStates.Jump = this.spriteSheet.getStats(this.states.Jump);
        this.eStates.Jump_Attack = this.spriteSheet.getStats(this.states.Jump_Attack);
        this.eStates.Jump_Throw = this.spriteSheet.getStats(this.states.Jump_Throw);
        this.eStates.Kunai = this.spriteSheet.getStats(this.states.Kunai);
        this.eStates.Run = this.spriteSheet.getStats(this.states.Run);
        this.eStates.Slide = this.spriteSheet.getStats(this.states.Slide);
        this.eStates.Throw = this.spriteSheet.getStats(this.states.Throw);
        this.eStates.Climb = this.spriteSheet.getStats(this.states.Climb);

		this.frames = this.eStates[this.currState];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
		this.flipH = -1;

		// atualizar o array de frames atual


	}.bind(this);

	this.disparar = function (criarBala) {
		if (!podeAtacar)	return;
		toogleState(this.states.Attack);
		podeAtacar = false;
		var shot = Math.random() * 50;
		if (shot > 15)
			this.sounds.TIRO.play(false, 0.08);
		else
			this.sounds.TIRO2.play(false, 0.08);
		callback = criarBala;
	};

	this.atacar = function () {
		toogleState(this.states.Attack);
	};

	this.andar = function () {

		toogleState(this.states.Run);

	};

	this.parar = function () {
		toogleState(this.states.Idle);
		//	this.sounds.DISPARAR.play(false, 1);
	};

	this.morto = function () {
		toogleState(this.states.Dead);
		this.isDead = true;
		this.visible = false;
	};

	var toogleState = function (theState) {
		if (this.killed) return;
		if (this.currState != theState) {
			this.currState = theState;
			this.frames = this.eStates[theState];
			this.currentFrame = 0;
		}
	}.bind(this);



	//nao funciona...
	var animarSalto = function () {
		//	console.log("salta");

		if (this.y > this.limit && !this.goingDown) {
			this.y += this.jumpForce;
			//	console.log('jumping: ' + this.y);
		} else {
			this.goingDown = true;
			this.y -= this.jumpForce;
			if (this.y > this.jump_y) {
				//	clearInterval(this.saltar);
				this.goingDown = false;
				this.jump = false;
			}
		}
	}.bind(this);

	this.saltar = function () {
		this.jump = true;
	}

});
