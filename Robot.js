var Robot = Entity.extend(function () {
	this.currState = undefined; // estado atual;

	var podeAtacar = false;

	this.states = {
		Dead: 'Dead',
		Idle: 'Idle',
        Jump: 'Jump',
        JumpMelee: 'JumpMelee',
        JumpShoot: 'JumpShoot',
        Melee: 'Melee',
        Run: 'Run',
        RunShoot: 'RunShoot',
        Shoot: 'Shoot',
        Slide: 'Slide'

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
		this.isDead = false;
		this.visible = false;
		//bot variable 
		this.bot = false;
		//Platform game properties   
		this.isOnGround = undefined;
		this.jumpForce = -10;
	
		setup();
	};

	this.update = function () {

		if (this.currState == this.states.Dead && this.currentFrame == this.frames.length - 1)
			return;

		this.currentFrame = (++this.currentFrame) % this.frames.length;

		this.width = this.frames[this.currentFrame].width * 0.5; //atualizar a altura
		this.height = this.frames[this.currentFrame].height * 0.5; // atualizar os
		this.updateSize();

		if (this.currState === this.states.Shoot && this.currentFrame == this.frames.length - 1) {
			this.parar();
		}
		//condição para saltar
		if(this.jump) animarSalto();

		if(this.bot)
		this.andarAutomatico;

	};

	var setup = function () {

		this.eStates.Dead = this.spriteSheet.getStats('Dead');
        this.eStates.Idle = this.spriteSheet.getStats('Idle');
		this.eStates.Jump = this.spriteSheet.getStats('Jump');
        this.eStates.JumpMelee = this.spriteSheet.getStats('JumpMelee');
        this.eStates.JumpShoot = this.spriteSheet.getStats('JumpShoot');
        this.eStates.Melee = this.spriteSheet.getStats('Melee');
        this.eStates.Run = this.spriteSheet.getStats('Run');
        this.eStates.RunShoot = this.spriteSheet.getStats('RunShoot');
        this.eStates.Shoot = this.spriteSheet.getStats('Shoot');
        this.eStates.Slide = this.spriteSheet.getStats('Slide');

		this.frames = this.eStates[this.currState];
		this.width = this.frames[0].width; //atualizar a altura
		this.height = this.frames[0].height; // atualizar os
		// atualizar o array de frames atual

	}.bind(this);

	this.andarAutomatico = function (){
		// andamento automatico
		if (this.currState === this.states.Run) {
			this.vx = 2;
			//if(this.x )
			this.x -= this.vx;
		}

		// se terminou a anima��o de morrer desativa-se para ser removido da memoria
		if (this.currState == this.states.Dead && this.currentFrame == this.frames.length - 1) {
			this.active = false;
		}
		if (this.energia <= 0)
			this.atingido();
	}

	this.atacar = function () {
		toogleState(this.states.Shoot);

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
		
		setTimeout(this.visible = false, 1500);
	};

	var toogleState = function (theState) {
		if (this.killed) return;
		if (this.currState != theState) {
			this.currState = theState;
			this.frames = this.eStates[theState];
			this.currentFrame = 0;
		}
	}.bind(this);
	
	
	
	var animarSalto = function () {
	//	console.log("salta");

		if (this.y > this.limit && !this.goingDown) {
			this.y += this.jumpForce;
			toogleState(this.states.Jump);
		//	console.log('jumping: ' + this.y);
		} else {
			this.goingDown = true;
			this.y -= this.jumpForce;
			if (this.y > this.jump_y) {
			//	clearInterval(this.saltar);
				this.goingDown = false;
				toogleState(this.states.Idle);
				this.jump=false;
			}
		}
	}.bind(this);

	this.saltar= function(){
		this.jump=true;
		return false;
	} 
	
});
