(function(){

	var datosArray,
		num = 0, // 0 = home
		html;

	var MagicFinger = {
		init: function(config){
			this.url = config.url;
			this.template = config.template;
			this.secciones = config.secciones;
			this.container = config.container;
			this.back_button = config.back_button;
			this.lapices = config.lapices;
			this.grosor = config.grosor;
			this.borrar = config.borrar;
			this.footer = config.footer;
			this.tools = config.tools;
			this.header = config.header;
			this.can = $("#painting");
			
			this.reedJson();
			/*var screenWidth = window.outerWidth,
				screenHeight = window.outerHeight;
				alert(screenWidth +" x "+ screenHeight);*/

		},
		reedJson: function(){
			var self = this;

			$.ajax({
			  dataType: "json",
			  url: this.url
			}).done(function( data ){
				datosArray = data;
				self.render(datosArray);
			}).fail(function(data){
				console.log("Ha fallado la carga de json");
			});
/*
			$.getJSON(this.url, function(datos) {
				datosArray = datos;
				self.render(datosArray);
			});	*/
		},

		render: function(){
			console.log(datosArray);
			var source = this.template.html(),
			template = Handlebars.compile(source);

			//if (this.secciones.is("hidden")){
					this.header.show();
					this.secciones.show();
			//}

				this.secciones.empty();

				if (num === 0){ // si la home
					html = template(datosArray);
				}else{
					html = template(datosArray[num-1].contenido); //si es la home carga el template de secciones, si no los dibujos de la seccion selecionada
					this.footer.animate({height: '60'});
					this.goBack();
				}

				this.secciones.append(html).css("display", "none").fadeIn();
		        
		},

		goBack:function(){
			var self = this;
			this.back_button.on("click",function(){
				if ( self.tools.is(":visible") ){
					self.deleteTools( function(){
						num = 0;
						$("canvas").fadeOut(200).delay(300,function(){
							self.render(html);
						});	
					});
				}			
			});
		},

		click: function(){

			var self = this; 
			this.secciones.find("img").on("click", function(){

				if (num > 0){
					var urlImg = $(this).attr("src").replace("thumb", "canvas");
					self.canvas(urlImg);
				}else{
					num = $(this).data("num");
					self.render();
				}
	        });
	        
		},

		canvas: function(urlImg){
			var color = "#ff0000",
				grosor = 5,
				draw = false,
				xCoord, yCoord = "",
				touch = 0;

			if($("canvas").is("*")) $("canvas").remove();
				
			this.showTools();
			this.secciones.hide();
			this.header.hide();

			var canvasJquery = this.container.append("<canvas id='painting'></canvas>").children("canvas");
			canvasJquery.css("background" , 'url("' + urlImg + '")');
						/*.css("width", "600px")
						.css("height", "600px");*/
			
			var canvas = document.getElementById('painting');
			var ctx = canvas.getContext('2d');
			
			/* ancho del canvas responsive*/
			
			var screenWidth = window.innerWidth,
				screenHeight = window.innerHeight,
				medida;
				if ( screenWidth < screenHeight ) medida = screenWidth;
				else medida = screenHeight;
				if (medida > 700) medida = 600;
				
				ctx.canvas.width = medida;
				ctx.canvas.height = medida;
			
			/*$(window).on("resize", function(){
				ctx.save();
				screenWidth = window.innerWidth,
				screenHeight = window.innerHeight;

				if ( screenWidth < screenHeight ) medida = screenWidth;
				else medida = screenHeight;
				if (medida > 700) medida = 600;
				ctx.canvas.width = medida;
				ctx.canvas.height = medida;

			})*/


			ctx.strokeStyle = color;
			ctx.lineWidth = grosor;
			ctx.lineCap = "round";

			this.lapices.find("li img").on("click", function(){
				color = $(this).data("color");
				var li = $(this).parent().animate({top: "-20px", opacity: "1"},200);
				li.siblings().animate({top: "0", opacity: "0.7"},200);
				ctx.strokeStyle = color;
			});

			this.grosor.find("li").on("click", function(){
				grosor = $(this).data("grosor");
				ctx.lineWidth = grosor;
				$(this).css("border", "3px solid red");
				$(this).siblings().css("border", "none");
			});

			this.borrar.on("click", function(){ //click
				ctx.clearRect(0,0,canvas.width,canvas.height);
			});
			
			// dibujar detectando dispositivos táctiles

			if ("ontouchstart" in document.documentElement){
				
				canvas.addEventListener('touchstart', function(e){
					touch = event.targetTouches[0];
					e.preventDefault();
					draw = true;
					ctx.save();
					xCoord = touch.pageX - this.offsetLeft;
					yCoord = touch.pageY - this.offsetTop;
				},false);

				canvas.addEventListener('touchend', function(e){
					e.preventDefault();
					draw = false;
				});

				canvas.addEventListener('touchmove', function(e){
					e.preventDefault();
						if (draw === true){
							for (var i = 0; i < event.touches.length; i++) { 
						    	var touch = event.touches[i]; 
								ctx.beginPath();
								ctx.moveTo(touch.pageX - this.offsetLeft, touch.pageY - this.offsetTop);
								ctx.lineTo(xCoord, yCoord);
								ctx.stroke();
								ctx.closePath();
								touch = event.targetTouches[0];
								xCoord = touch.pageX - this.offsetLeft;
								yCoord = touch.pageY - this.offsetTop;
							}
						}
				});
				
				/*canvas.addEventListener('touchmove', function(event) { 
				    for (var i = 0; i < event.touches.length; i++) { 
					    var touch = event.touches[i]; 
					    ctx.beginPath();
					    ctx.arc(touch.pageX, touch.pageY, 20, 0, 2*Math.PI, true);
					    ctx.fill(); 
					    ctx.stroke();
				    } 
				}, false);
*/
			}else{
				  canvasJquery.on("mousedown", function(e){ //mousedown
					e.preventDefault();
					draw = true;
					ctx.save();
					xCoord = e.pageX - this.offsetLeft;
					yCoord = e.pageY - this.offsetTop;
				});


				canvasJquery.on("mouseup", function(e){ //mouseup
					e.preventDefault();
					draw = false;
				});

				canvasJquery.on("click", function(e){//click	
					e.preventDefault();
					draw = false;
				});

				canvasJquery.on("mousemove", function(e){ //mousemove
					e.preventDefault();
					if (draw === true){
						ctx.beginPath();
						ctx.moveTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
						ctx.lineTo(xCoord, yCoord);
						ctx.stroke();
						ctx.closePath();
						xCoord = e.pageX - this.offsetLeft;
						yCoord = e.pageY - this.offsetTop;
					}
				});  
			} // end else
			
		},

		showTools: function(){
			var self = this;
			self.lapices.fadeIn("fast",function(){
				self.grosor.fadeIn("fast", function(){
					self.borrar.fadeIn("fast", function(){
					});
				});
			});// fin animacion de salida de herramientas
		},

		deleteTools: function( f ){
			var self = this;

			self.borrar.fadeOut("fast",function(){
				self.grosor.fadeOut("fast", function(){
					self.lapices.fadeOut("fast", function(){
						self.footer.animate({height: '0'}, "fast");
						if (typeof f == "function") f();
					});
				});
			});// fin animacion de salida de herramientas*/
			self.lapices.find("li").css("top", "0").css("opacity","1");
			self.grosor.find("li").css("border", "none");
			color = "#ff0000";
			grosor = 5;
		}


	};//fin MagicFinger

	window.myMagic = MagicFinger.init({
		//url : "json_generator.php",
		url: "js/data2.json",
		template : $("#template"),
		secciones: $("ul.secciones"),
		container: $("div.principal"),
		back_button: $("a.volver"),
		lapices: $("div.lapices"),
		grosor: $("ul.grosor"),
		borrar: $("a.borrar"),
		footer: $("div.pie"),
		tools: $("div.herramientas"),
		header: $("div.cabecera")
	});

})();