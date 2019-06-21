// Animated tank.js
(function () { //não apagar

	var canvas; // representação genérica dos canvas
	//variaveis para a camera dinamica
	var gameWorld = undefined;
	var camera = undefined;
	var oBackground;
	//count dos loops para adicionar os inimigos
	var countBackgroundLoops = 0;
	var previousCountBackgroundLoops = 1;
	//contador para o niveis
	var gamelevelCounter = 0;

	//guarda material necessario para o jogo
	var canvases = {
		background: {
			canvas: null,
			ctx: null
		}, // canvas, drawingSurface (contex2d)
		entities: {
			canvas: null,
			ctx: null
		},
		components: {
			canvas: null,
			ctx: null
		}
	};//canvases

	var entities = [];
	var teclas = new Array(255);
	//variaveis para os objetos do jogo
	var oPlayer = undefined;
	var enemyFemale;
	var boss;

	var enemyFemaleArray = [];
	//arrays para testes de colisão
	var ataquesAliados = [];
	var ataquesInimigos = [];

	//degbug
	var debugMode = true;
	var andou = false;

	//componenetes do jogo
	var barraEnergiaEnemy = undefined;
	var barraEnergiaHero = undefined;
	var gameLevel = undefined;
	//animações de entrada
	var animationHandler;
	var loadInfo = undefined;
	var assetsLoadInfo = undefined;
	var assetsLoaded = 0;
	var assets = [];
	//arrrays de sons
	var GameSounds = {
		MISSIL: {},
		AVIAO: {},
		SOLDADO: {},
		TANQUE: {},
		BALA: {},
		BALASOLDADO: {},
		AMBIENTE: {}
	};//game sounds

	var gameState = undefined;
	var GameStates = {
		RUNNING: 1,
		PAUSED: 2,
		STOPED: 3,
		LOADING: 4,
		LOADED: 5
	}//gameStates


	window.addEventListener("load", init, false);

	function init() {
		//trazer variaveis do HTML
		canvases.background.canvas = document.querySelector("#canvasBack");
		canvases.background.ctx = canvases.background.canvas.getContext("2d");

		canvases.entities.canvas = document.querySelector("#canvasEnt");
		canvases.entities.ctx = canvases.entities.canvas.getContext("2d");

		canvases.components.canvas = document.querySelector("#canvasComp");
		canvases.components.ctx = canvases.components.canvas.getContext("2d");

		// canvas é uma referencia global genérica para as definições globais dos canvas (largura e altura)
		canvas = canvases.entities.canvas; //
		load();
	}//init


	function load() {
		loadInfo = document.querySelector("#loadInfo");
		assetsLoadInfo = document.querySelector("#assetLoaded");

		gameState = GameStates.LOADING;

		loadSpriteSheet();
		loadSounds();
		// carregar os sons

	}//load


	function loadSounds() {

		gSoundManager.loadAsync("sounds/tiroSoldado.mp3", function (so) {
			GameSounds.SOLDADO.TIRO = so;
			loaded("sounds/tiroSoldado.mp3")
		});
		assets.push(GameSounds.SOLDADO.TIRO);

		gSoundManager.loadAsync("sounds/introDoom.mp3", function (so) {
			GameSounds.AMBIENTE.INTRO = so;
			loaded("sounds/introDoom.mp3")
		});
		assets.push(GameSounds.AMBIENTE.INTRO);

		gSoundManager.loadAsync("sounds/final.mp3", function (so) {
			GameSounds.AMBIENTE.FINAL = so;
			loaded("sounds/final.mp3")
		});
		assets.push(GameSounds.AMBIENTE.FINAL);

	}//loadSounds

	function loadSpriteSheet() {

		let spBackground = new SpriteSheet();
		spBackground.load("assets//background_2.png", "assets//background_2.json", loaded);
		assets.push(spBackground);

		let spriteMale = new SpriteSheet();
		spriteMale.load("assets//male.png", "assets//male.json", loaded);
		assets.push(spriteMale);

		let spriteRobot = new SpriteSheet();
		spriteRobot.load("assets//robot.png", "assets//robot.json", loaded);
		assets.push(spriteRobot);

		let spriteFemale = new SpriteSheet();
		spriteFemale.load("assets//female.png", "assets//female.json", loaded);
		assets.push(spriteFemale);

		let spriteAtaque = new SpriteSheet();
		spriteAtaque.load("assets//ataque.png", "assets//ataque.json", loaded);
		assets.push(spriteAtaque);

		let spriteNinja = new SpriteSheet();
		spriteNinja.load("assets//ninja.png", "assets//ninja.json", loaded);
		assets.push(spriteNinja);
	}//loadSpriteSheet

	//load assets
	function loaded(assetName) {
		if (gamelevelCounter === 0) {
			assetsLoaded++;
			assetsLoadInfo.innerHTML = "Loading: " + assetName;
			if (assetsLoaded < assets.length) return;

			assets.splice(0); // apagar o array auxiliar usado para o load

			// Se já conseguimos chegar aqui, os assets estão carregados! Podemos começar a criar 
			// e configurar os elementos do jogo
			assetsLoadInfo.innerHTML = "Game Loaded! Press any key when are ready...";


			gameState = GameStates.LOADED;
			window.addEventListener("keypress", setupGame, false); // espera por uma tecla pressionada para começar
		}
		//iniciar musica
		GameSounds.AMBIENTE.INTRO.play(true, 1);

	}//loaded

	function setupGame() {

		window.removeEventListener("keypress", setupGame, false);

		loadInfo.classList.toggle("hidden"); // esconder a informaçao de loading

		chargeBackground();	//carregar background

		//aplica definições para a camera de jogo 
		setUpGameCamera();
		// instancia os spritesheets necessarios para o jogo
		setUpSprites();

		//criar os componentes informativos e temporizadores
		setUpGameComponents();
		//alguns efeitos 
		canvases.background.canvas.fadeIn(1000);

		gSoundManager.stopAll(); //p�ram-se todos os  sons

		gameState = GameStates.RUNNING;

		update();

		window.addEventListener("keydown", keyDownHandler, false);
		window.addEventListener("keyup", keyUpHandler, false);

	}//setUpGame

	function setUpGameComponents() {
		//criar os componentes informativos e temporizadores
		barraEnergiaHero = new EnergyBar(5, 5, 120, 12, canvases.components.ctx, 'Hero\'s Life Level ', "black", "black", "red");

		barraEnergiaEnemy = new EnergyBar(canvas.width - 135, 5, 120, 12, canvases.components.ctx, 'Enemy\'s Life Level', "black", "black", "blue");

	
	}//*set up components

	function chargeBackground() {
		switch (gamelevelCounter) {
			case 0:
				oBackground = new Background(
					gSpriteSheets['assets//background_2.png'], 0, 0);
				break;
			case 1:
				levelPauseAndResumeByLevel(2);
				break;
			case 2:
				levelPauseAndResumeByLevel(3);
				break;

			case 3:
				levelPauseAndResumeByLevel(4);
				break;

			case 4:
				levelPauseAndResumeByLevel(5);
				break;

			case 5:
				levelPauseAndResumeByLevel(6);
				break;
		}
		1
		gameLevel = new GameLevelCounter((canvas.width >> 1) + 400  , 10, 30, 50, canvases.components.ctx, '', "red", "black", "white", (gamelevelCounter + 1) );

	}//chargeBackground

	//not finished
	function levelPauseAndResumeByLevel(level) {
		//pausing game
		gameState = GameStates.STOPED;
		oPlayer.visible = false;

		oPlayer.parar();
		//change level
		oBackground.changeBackground(level);
		countBackgroundLoops = 0;
		previousCountBackgroundLoops = 0;
		//resuming game
		gameState = GameStates.RUNNING;
		oPlayer.visible = true;
	}//levelPauseAndResume


	function setUpSprites() {
		// criar as entidades
		oPlayer = new Robot(gSpriteSheets['assets//robot.png'], camera.x + 100, canvas.height - 150, GameSounds.TANQUE);
		enemyFemale = new Zombies(gSpriteSheets['assets//female.png'], camera.width - 100, canvas.height - 150, GameSounds.TANQUE);
		enemyMale = new Zombies(gSpriteSheets['assets//male.png'], camera.width - 100, canvas.height - 150, GameSounds.TANQUE);
		boss = new Ninja(gSpriteSheets['assets//ninja.png'], camera.width - 200, canvas.height - 250, GameSounds.TANQUE);

		//player vars
		oPlayer.visible = true;
		//armazenar entidades
		entities.push(oBackground);
		entities.push(oPlayer);
		entities.push(enemyFemale);
		entities.push(enemyMale);
		entities.push(boss);

	}//setUpSprites


	function setUpGameCamera() {

		// ajustar os canvas ao tamanho da janela
		canvases.background.canvas.width = window.innerWidth;
		canvases.background.canvas.height = oBackground.height;
		canvases.entities.canvas.width = window.innerWidth;
		canvases.entities.canvas.height = oBackground.height;
		canvases.components.canvas.width = window.innerWidth;
		canvases.components.canvas.height = oBackground.height;
		oBackground.x = -150;
		
		//dar load da camera e do Game world de forma a fazer o mapa dinamico
		// 1 -  criar o gameWorld
		gameWorld = new GameWorld(0, 0, canvas.width, canvas.height);

		// 2 - criar e configurar a c�mara 
		camera = new Camera(0, gameWorld.height * 0.5,
			gameWorld.width, gameWorld.height * 0.5);

	
	}//setUpGameCamera

	//função que para o jogo. É chamada pelo timer, quando a contagem chega a zero
	function stopGame() {
		cancelAnimationFrame(animationHandler);
		gameState = GameStates.STOPED;
		
		gSoundManager.stopAll(); //p�ram-se todos os  sons
		GameSounds.AMBIENTE.FINAL.play(true, 0.25);
		canvases.background.canvas.colorize("#614719");
		canvases.entities.canvas.colorize("#614719");
		canvases.components.canvas.grayScale();
		canvases.components.canvas.fadeOut(2000);
	}//stopGame

	// tratamento dos inputs
	function keyDownHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = true;
		//
		if (teclas[keyboard.SPACE]) {
			oPlayer.jump = true;
		}

	}//keyDown

	function keyUpHandler(e) {
		var codTecla = e.keyCode;
		teclas[codTecla] = false;

		switch (codTecla) {
			case keyboard.LSHIFT, keyboard.RSHIFT:

				oPlayer.podeAtacar = true;
				break;
		}

		oPlayer.parar();
		//para o background quando para de carregar
		oBackground.parar();
	}//keyup


	// função que verifica as colisões
	//nao esta completa
	function checkColisions() {

		//validação para incrementar niveis
		if (countBackgroundLoops == 10) {
			gamelevelCounter++;

			gameLevel.switchLevel(gamelevelCounter);
			//voltar a carregar o jogo
			chargeBackground();
		}

		if (!enemyFemale.visible && !enemyMale.visible && !boss.visible) {//no enemyFemaley on game

			checkCameraBounds();//collisao da camera

		} else {//enemyFemale is visible
			barraEnergiaEnemy.render();

			oBackground.x = oBackground.x;

			if (!enemyFemale.isDead || !enemyMale.isDead || !boss.isDead) {//se nao estiver morto
				oPlayer.blockRectangle(enemyFemale);
				oPlayer.blockRectangle(enemyMale);
				oPlayer.blockRectangle(boss);

			}//bloqueia contra o inimigo

			else if (!enemyFemale.estaAAtacar() || !enemyMale.estaAAtacar() || !boss.estaAAtacar()) {//permite os bots atacarem
				if (!enemyFemale.isDead)
					enemyFemale.andar();
				if (!enemyMale.isDead)
					enemyMale.andar();
				if (!boss.isDead)
					boss.andar();
			}

			//colisao entre balas inimigas e player
			/*		for (var i = 0; i < ataquesInimigos.length; i++) {
						if (oPlayer.hitTestRectangle(ataquesInimigos[i] && !oPlayer.isColliding && !ataquesInimigos[i].isColliding)) {
							oPlayer.isColliding = true;
							ataquesInimigos[i].isColliding = true;
		
						} else {
							ataquesInimigos[i].isColliding = false;
						}
		
						if (oPlayer.hitTestRectangle(ataquesInimigos[i]) && !oPlayer.isDead) {
							oPlayer.energia -= ataquesInimigos[i].damageLevel;
							barraEnergiaHero.update(oPlayer.energia);
		
						}
		
					}*/
			for (var i = 0; i < ataquesAliados.length; i++) {

				if ((!ataquesAliados[i].isColliding && enemyFemale.hitTestRectangle(ataquesAliados[i]) && enemyFemale.visible)
					|| (!ataquesAliados[i].isColliding && enemyMale.hitTestRectangle(ataquesAliados[i]) && enemyMale.visible)
					|| (!ataquesAliados[i].isColliding && boss.hitTestRectangle(ataquesAliados[i]) && boss.visible)) {
					
					if (!enemyFemale.isDead) {//inimigo vivo
						enemyFemale.isColliding = true;
						enemyFemale.energia == 0 ? enemyFemale.morto(canvas) : null;
						ataquesAliados[i].Muzzle();
					} else if (!enemyMale.isDead) {//inimigo 2
						enemyMale.isColliding = true;
						enemyMale.energia == 0 ? enemyMale.morto(canvas) : null;
						ataquesAliados[i].Muzzle();
					} else if (!boss.isDead) {//BOSS	
						boss.isColliding = true;
						boss.energia == 0 ? boss.morto(canvas) : null;
						ataquesAliados[i].Muzzle();
					}
				} else {
					ataquesAliados[i].isColliding = false;
				}

				if (ataquesAliados[i].right() < 0 || //remove balas que saiem para fora
					ataquesAliados[i].left() > canvas.width ||
					ataquesAliados[i].bottom() < 0 ||
					ataquesAliados[i].top() > canvas.height) {
					ataquesAliados[i].active = false;
				}
				//tira vida aos enemyFemales
				if ((enemyFemale.hitTestRectangle(ataquesAliados[i]) && !enemyFemale.isDead)
					|| (enemyMale.hitTestRectangle(ataquesAliados[i]) && !enemyMale.isDead)) {

					(!enemyFemale.isDead ? enemyFemale.energia -= ataquesAliados[i].damageLevel : enemyMale.energia -= ataquesAliados[i].damageLevel);
					barraEnergiaEnemy.update(!enemyFemale.isDead ? enemyFemale.energia : enemyMale.energia);

				}

				if (boss.hitTestRectangle(ataquesAliados[i]) && !boss.isDead) {
					boss.energia -= ataquesAliados[i].damageLevel;
					barraEnergiaEnemy.update(boss.energia);

				}


			}

		}
	}//checkColisions


	function checkCameraBounds() {

		//reposicionar o background consoante a posição do tanque
		if (oPlayer.dir === -1) {
			if (oBackground.x <= (Math.floor(oBackground.width / 3)) * - 2) {
				countBackgroundLoops++;
				oBackground.x = 0;
			}//direita
		} else if (oPlayer.dir === 1) {
			if (oBackground.x >= 0) {
				oBackground.x = (Math.floor(oBackground.width / 3)) * - 2;
			}//esquera
		}

		// 3 - animar o background se o tanque atingir os limites interiores da c�mara
		//     a uma velocidade de 1/3 da velocidade do tanque	
		if (oPlayer.x + oPlayer.width - 10 > camera.rightInnerBoundary()) {
			oPlayer.x = camera.rightInnerBoundary() - oPlayer.width;
			oBackground.vx = oPlayer.vx / 3 * - 1;

		}


	}//checkCameraBounds

	function setAccelerationAndFriction(obj, direction) {
		if (direction === "left") {
			obj.accelerationX = -0.2;
			obj.friction = 1;
		} else if (direction === "right") {//case right
			obj.accelerationX = 0.2;
			obj.friction = 1;
		}
	}//setAcelerationAndFriction


	// Ciclo de jogo. Chamada a cada refrescamento do browser (sempres que possível)
	function update() {
		if (gameState == GameStates.RUNNING) {
			//execute game play validations
			gamePlay();

			//update das entidades
			for (var i = 0; i < entities.length; i++) {
				entities[i].update();
			}
			//set zombie to visible
			if (countBackgroundLoops == previousCountBackgroundLoops) {//adiciona o inimigo

				if (countBackgroundLoops !== 0 && countBackgroundLoops < 10) {
					if (countBackgroundLoops % 2 === 0) {
						enemyMale.x = canvas.width;
						enemyMale.andar();
						enemyMale.visible = true;
						enemyMale.isDead = false;
						enemyMale.energia = 50;
						barraEnergiaEnemy.update(enemyMale.energia);
					} else if (countBackgroundLoops % 2 !== 0 && countBackgroundLoops !== 9) {
						enemyFemale.x = canvas.width;
						enemyFemale.andar();
						enemyFemale.visible = true;
						enemyFemale.isDead = false;
						enemyFemale.energia = 50;
						barraEnergiaEnemy.update(enemyFemale.energia);
					} else if (countBackgroundLoops === 9) {
						boss.x = canvas.width;
						boss.andar();
						boss.visible = true;
						boss.isDead = false;
						enemyMale.energia = 100;
						barraEnergiaEnemy.update(boss.energia);
					}
				}
				previousCountBackgroundLoops++;
			}

			checkColisions();
			clearArrays();
			// se o soldado morre para o jogo
			if (!oPlayer.active) {
				stopGame();
			} else {
				animationHandler = requestAnimationFrame(update, canvas);
			};
			render();
		}//running game

	}//update

	function gamePlay() {
		//Create the animation loop
		if (teclas[keyboard.LEFT] && oPlayer.x > 0) {
			oPlayer.andar();
			oPlayer.x -= oPlayer.vx;
			oPlayer.dir = 1;
			oPlayer.flipH = -1;
			setAccelerationAndFriction("left");
		}
		if (teclas[keyboard.RIGHT] &&
			(oPlayer.x < camera.width - oPlayer.width || (enemyFemale.isDead === true && enemyMale.isDead === true))) {
			oPlayer.andar();
			oPlayer.x += oPlayer.vx;
			oPlayer.dir = -1;
			oPlayer.flipH = 1;
			setAccelerationAndFriction("right");
		}
		if (teclas[keyboard.UP])
			oPlayer.y = oPlayer.y - oPlayer.vy < canvas.height - 150 ? canvas.height - 150 : oPlayer.y - oPlayer.vy;
		if (teclas[keyboard.DOWN])
			oPlayer.y = oPlayer.bottom() + oPlayer.vy > canvas.height ? canvas.height - oPlayer.height : oPlayer.y + oPlayer.vy;

		if (oPlayer.podeAtacar) {
			ataqueDoJogador();
		}//atacar

		//Space
		if (oPlayer.jump) {
			oPlayer.saltar();
		}//salta

		//ataque automatico do zombie
		if (!enemyFemale.isDead || !enemyMale.isDead || !boss.isDead) {
			boss.isDead ?
				!enemyMale.isDead ? enemyMale.andar() : enemyFemale.andar() //boss morto enemys vivos
				:
				boss.andar();

			if (ataquesInimigos.length <= 1)

				boss.isDead ?
					!enemyMale.isDead ? criarBala(enemyMale) : criarBala(enemyFemale) //boss morto enemys vivos
					:
					criarBala(boss);
		}


	}//gamePlay

	function criarBala(enemy) {
		enemy.atacar();

		let aBala = new Bala(gSpriteSheets['assets//ataque.png'],
			enemy.x - 30,
			enemy.y + enemy.height / 2.5,
			10,//bullet demage
			1,
			null);
		aBala.flipH = -1;
		entities.push(aBala);
		ataquesInimigos.push(aBala);
		enemy.andar();

	}

	function ataqueDoJogador() {
		oPlayer.atacar();
		GameSounds.SOLDADO.TIRO.play(false, 1);
		var ataque = new Ataque(gSpriteSheets['assets//ataque.png']
			, !enemyFemale.isDead ? enemyFemale.x + 30 : enemyMale.x + 30 //aponta para o inimigo
			, !enemyFemale.isDead ? enemyFemale.y + 50 : enemyMale.y + 50);

		entities.push(ataque);

		//status == atack
		//criar novo ataque
		let aBala = new Bala(gSpriteSheets['assets//ataque.png'],
			oPlayer.x - 30,
			oPlayer.y + oPlayer.height / 2.5,
			10,//bullet demage
			oPlayer.dir,
			null);
		entities.push(aBala);
		ataquesAliados.push(aBala);
		oPlayer.podeAtacar = false;
	}//ataque do jogador

	// Limpeza das entidades desativadas

	function clearArrays() {
		entities = entities.filter(filterByActive);
		ataquesAliados = ataquesAliados.filter(filterByActive);
		ataquesInimigos = ataquesInimigos.filter(filterByActive);
	}//clearArrays

	function filterByActive(obj) {
		if (obj.active == true)
			return obj;
	}//filterByActive

	// Desenho dos elementos gráficos
	function render() {

		canvases.entities.ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa canvas
		canvases.background.ctx.clearRect(0, 0, canvas.width, canvas.height); //limpa canvas

		for (var i = 1; i < entities.length; i++) {
			var entity = entities[i];
			//entidades fora do canvas não se desenham
			if (entity.right() > 0 && entity.bottom() > 0 &&
				entity.left() < canvas.width && entity.top() < canvas.height) {

				entities[i].render(canvases.entities.ctx);

				if (debugMode) entities[i].drawColisionBoundaries(canvases.entities.ctx, false, false, "blue", "red");
			}
		}
		//desenha o frame da camera 

		//renderiza a camera dinamica

		oBackground.render(canvases.background.ctx);
		barraEnergiaHero.render();
		gameLevel.render();
	}//Render


})(); // não apagar
