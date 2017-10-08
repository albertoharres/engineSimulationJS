var output = {
	_potency: 50,
	_isRunning: false,
	_isOver: false,
	_changed: false,
	fuel: {
		$el: ($("#fuel ul")),
		$bar: ($("#fuel li")),
		value: 0,
		max: 10,
		_changed: false,
		set: function(value){
			this.value = value;
			this._changed = true;
		},
		render: function() {
			var self = this;
			this.$bar.each(function(index) {
				if(index >= self.value){
					$(this).addClass("inactive");
				} else {
					$(this).removeClass("inactive");
				}
			});
			this._changed = false; 
		}
	},
	time: {
		$el: ($("#time .variable span")),
		value: 0,
		_changed: false,
		set: function(value){
			this.value = value;
			this._changed = true;
		},
		render: function() {
			this.$el.text(this.value/10 + " seg");
			this._changed = false; 
		}

	},
	distance: {
		$el: ($("#distance .variable span")),
		value: 0,
		_changed: false,
		set: function(value){
			this.value = value;
			this._changed = true;
		},
		render: function() {
			var self = this;
			this.$el.text(this.value + " km");
			this._changed = false; 
		}
	},	
	init: function(){
		this._changed = true;
	},
	addEvents: function(){		
	},
	start: function(potency){		
		this._potency = potency;
		this._isRunning = true; 
		this.reset();
		this.update();
	},
	update: function(){				
		var self = this;
		function setValues(isFirst = false){					
			if(self._isRunning){
				if(!isFirst ){					
					var fuel = (((self._potency*self._potency)/120)/60)*1.5;
					console.log("fuel", fuel);
					self.fuel.set(self.fuel.value - fuel);					
					
					console.log("FUEL DOWN: ", self.fuel.value)
					
					self.time.set(self.time.value + 15);
					var distance = ((self._potency/60)*10)*1.5;
					self.distance.set(self.distance.value + distance );
					self._changed = true;
				}				
				if(self.fuel.value <= 0){										
					self._isRunning = false;
					self._isOver = true;
				} else {
					setTimeout(setValues, 1500);
				}								
			}
		}
		setValues(true);		
	},
	reset: function(){		
		this.fuel.set(10);
		this.time.set(0);
		this.distance.set(0);
		this._changed = true;
	},
	render: function(){		
		if(this.fuel._changed) this.fuel.render();
		if(this.time._changed) this.time.render();
		if(this.distance._changed) this.distance.render();
		this._changed = false;
	}
}

var input = {					
	$el: ($("#input")),
	$slider: ($("#potency .arrow")),	
	$button: ($("#activate")),
	$dragging: null,
	_potency: 0,
	_isEnabled: true,
	init: function(){
		this.addEvents();
		this.setPotency(50);
	},
	addEvents: function(){
		var self = this;
		// start button
		this.$button.on("click", function(e){
			if(self._isEnabled){
				self.$el.toggleClass("disabled");
				self._isEnabled = false;				
			}
		});

		$(document).on('input', '#slider', function() {
		    self._potency =  $(this).val();
			console.log("$(this).val()", self._potency);
		});
	},
	enable: function(){
		if(!this._isEnabled){			
			this.$el.toggleClass("disabled");
			this._isEnabled = true;
		}
	},
	setPotency: function(value){
		console.log("value", value);
		$("#slider").value = value;
		this._potency = value;
	},
	getPotency: function(){
		return this._potency;
	},
}

var App = {
	init: function(){
		console.log("Init!");						
		this.addEvents();
		this.render();
		input.init();
		output.init();
	},
	addEvents: function(){
		var self = this;
		input.$button.on("click", function(e){
			if(input._isEnabled){
				output.start(input.getPotency());
			} else {
				console.log("input now disabled");
			}
		});
	},
	render: function(timestamp){
		var self = this;
		if(output._changed) output.render();
		if(!input._isEnabled && output._isOver) {
			input.enable();	
		}
		window.requestAnimationFrame( function(timestamp) {
			self.render(timestamp);
		} );
	}
}

App.init();