function processEstatesAgencyCommands(commands) {
	'use strict';
	
	var validators = (function () {
		var validators = {
			validateNonEmptyString: function (value,methodName) {
				if (typeof value !== 'string') {
					throw new Error('Value must be a string. Method ' + methodName);
				}
				
				if (value === '') {
					throw new Error('Invalid empty string. Method ' + methodName);
				}	
			},
			validateIntegerInRange: function (value,minValue,maxValue,methodName) {
				validateInteger(value,methodName);
				
				if (typeof minValue !== 'number' || typeof maxValue !== 'number') {
					throw new Error('Range values must be valid numbers. Method ' + methodName);
				}
				
				if (value < minValue || maxValue < value) {
					throw new Error('Value is out of the given range. Method ' + methodName);
				}
			},
			validateBoolean: function (value,methodName) {
				if (typeof value !== 'boolean') {
					throw new Error('Invalid non-boolean value. Method ' + methodName);
				}
			},
			validatePositeveInteger: function (value,methodName) {
				validateInteger(value,methodName);
				
				if (value < 0) {
					throw new Error('Invalid negative value. Method ' + methodName);
				}
			},
			validateObject: function (value) {
				if (!value) {
					throw new Error('Object is null');
				}
			}
		};
		
		function validateInteger(value,methodName) {
			validateNumber(value,methodName);
			if (!(value%1)) {
				throw new Error('Number must be an integer. Method ' + methodName);
			}
		}
		
		function validateNumber(value,methodName) {
			if (isNaN(value)) {
				throw new Error('Value must be a number. Method ' + methodName);
			}
		}
		
		return validators;
	}());
	
	
	var estate = (function () {
		var estate = {
			init: function (name, area, location, isFurnitured) {
				validators.validateBoolean(isFurnitured, 'estate furniture');
				validators.validateNonEmptyString(name, 'estate name');
				validators.validateIntegerInRange(area,1,10000,'estate area');
				validators.validateNonEmptyString(location,'estate location');
				
				this.name = name;
				this.area = area;
				this.location = location;
				this.isFurnitured = isFurnitured;
				
				return this;
			},
			typeName: 'Estate',
			set name(value){
				validators.validateNonEmptyString(value,'estate name');
				this._name = value;
			},
			get name(){
				return this._name;
			},
			set area(value){
				validators.validateIntegerInRange(value,1,10000,'estate area');
				this._area = value;
			},
			get area(){
				return this._area;
			},
			set location(value){
				validators.validateNonEmptyString(location,'estate location');
				this._location = value;
			},
			get location(){
				return this._location;
			},
			set isFurnitured(value){
				validators.validateBoolean(value,'estate furniture');
				this._isFurnitured = value;
			},
			get isFurnitured(){
				return this._isFurnitured;
			},
			toString: function () {
				var isFurnituredText = this.isFurnitured ? 'Yes' : 'No';
				
				return this.typeName + ': Name = ' + this.name + ', Area = ' + this.area + ', Location = ' + this.location + ', Furnitured = ' + isFurnituredText;;
			}
		};
		
		return estate;
	}());
	
	var buildingEstate = (function (parent) {
		var buildingEstate = Object.create(parent);
		
		Object.defineProperties(buildingEstate,{
			init: {
				value: function (name, area, location, isFurnitured, rooms, hasElevator) {
					parent.init.call(this,name,area,location,isFurnitured);
					validators.validateBoolean(hasElevator,'building estate elevator');
					validators.validateIntegerInRange(rooms,1,100,'building estate rooms');
					return this;
				}
			},
			typeName: {
				value: 'Building estate'
			},
			rooms: {
				set: function (value) {
					validators.validateIntegerInRange(validators,1,100,'building estate rooms');
					this._rooms = value;
				},
				get: function () {
					return this._rooms;
				}
			},
			hasElevator: {
				set: function (value) {
					validators.validateBoolean(value,'building estate elevator');
					this._hasElevator = value;
				},
				get: function () {
					return this._hasElevator;
				}
			},
			toString: {
				value: function () {
					var elevatorText = this.hasElevator ? 'Yes' : 'No';
					return parent.toString.call(this) + ', Rooms: ' + this.rooms + ', Elevator: ' + elevatorText;
				}
			}
		});
		
		return buildingEstate;
	}(estate));
	
	var apartment = (function (parent) {
		var apartment = Object.create(parent);
		
		Object.defineProperties(apartment,{
			init: {
				value: function (name, area, location, isFurnitured, rooms, hasElevator) {
					parent.init.call(this,name, area, location, isFurnitured, rooms, hasElevator);
					return this;
				}
			},
			typeName: {
				value: 'Apartment'
			}
		});
		
		return apartment;
	}(buildingEstate));
	
	var office = (function (parent) {
		var office = Object.create(parent);
		
		Object.defineProperties(office, {
			init: {
				value: function (name, area, location, isFurnitured, rooms, hasElevator) {
					parent.init.call(this,name, area, location, isFurnitured, rooms, hasElevator);
					return this;
				}
			},
			typeName: {
				value: 'Office'
			}
		});
		
		return office;
	}(buildingEstate));
	
	var house = (function (parent) {
		var house = Object.create(parent);
		
		Object.defineProperties(house, {
			init: {
				value: function (name, area, location, isFurnitured, floors) {
					validators.validateIntegerInRange(floors,1,10,'house floors');
					parent.init.call(this,area,location,isFurnitured);
					this.floors = floors;
					
					return this;
				}
			},
			floors: {
				set: function (value) {
					validators.validateIntegerInRange(value,1,10,'house floors');
					this._floors= value;
				},
				get: function () {
					return this._floors;
				}
			},
			toString: function () {
				return parent.toString.call(this) + ', Floors: ' + this.floors;
			},
			typeName:{
				value: 'House'
			}
		});
		
		return house;
	}(estate));
	
	var garage = (function (parent) {
		var garage = Object.create(parent);
		
		Object.defineProperties(garage, {
			init: {
				value: function (name, area, location, isFurnitured, width, height) {
					validators.validateIntegerInRange(width,1,500,'garage width');
					validators.validateIntegerInRange(height,1,500,'garage height');
					parent.init.call(this,name, area, location, isFurnitured);
					this.width = width;
					this.height = height;
					return this;
				}
			},
			width: {
				set: function (value) {
					validators.validateIntegerInRange(value,1,500,'garage width');
					this._width = value;
				},
				get: function () {
					return this._width;
				}
			},
			height: {
				set: function (value) {
					validators.validateIntegerInRange(value,1,500,'garage height');
					this._height = value;
				},
				get: function () {
					return this._height;
				}
			},
			toString: {
				value: function () {
					return parent.toString.call(this) + ', Width: ' + this.width + ', Height: ' + this.height;
				}
			},
			typeName: {
				value: 'Garage'
			}
		});
		
		return garage;
	}(estate));
	
	var offer = (function () {
		var offer = {
			init: function (estate, price) {
				validators.validatePositeveInteger(price,'offer');
				validators.validateObject(estate);
				this.estate = estate;
				this.price = price;
				
				return this;
			},
			typeName: 'Offer',
			set estate(value){
				validators.validateObject(value);
				this._estate= value;
			},
			get estate(){
				return this._estate;
			},
			set price(value){
				validators.validatePositeveInteger(value);
				this._price= value;
			},
			get price(){
				return this._price;
			},
			toString: function () {
				return this.typeName + ': Estate = ' + this.estate.name + ', Location = ' + this.estate.location + ', Price = ' + this.price;;
			}
		};
		
		return offer;
	}());
	
	var rentOffer = (function (parent) {
		var rentOffer = Object.create(parent);
		
		Object.defineProperties(rentOffer, {
			init: {
				value: function (estate, price) {
					parent.init.call(this,estate,price);
					return this;
				}
			},
			typeName: {
				value: 'Rent '
			}
		});
		
		return rentOffer;
	}(offer));
	
	var saleOffer = (function (parent) {
		var saleOffer = Object.create(parent);
		
		Object.defineProperties(saleOffer, {
			init: {
				value: function (estate,price) {
					parent.call.init(this,estate,price);
					return this;
				}
			},
			typeName: {
				value: 'Sale'
			}
		});
		
		return saleOffer;
	}(offer));
	
	var EstatesEngine = (function() {
		var _estates;
		var _uniqueEstateNames;
		var _offers;

		function initialize() {
			_estates = [];
			_uniqueEstateNames = {};
			_offers = [];
		}

		function executeCommand(command) {
			var cmdParts = command.split(' ');
			var cmdName = cmdParts[0];
			var cmdArgs = cmdParts.splice(1);
			switch (cmdName) {
				case 'create':
					return executeCreateCommand(cmdArgs);
				case 'status':
					return executeStatusCommand();
				case 'find-sales-by-location':
					return executeFindSalesByLocationCommand(cmdArgs[0]);
				case 'find-rents-by-location':
					return executeFindRentsByLocationCommand(cmdArgs[0]);
				case 'find-rents-by-price':
					return executeFindRentsByPriceCommand(cmdArgs[0], cmdArgs[1]);
				default:
					throw new Error('Unknown command: ' + cmdName);
			}
		}

		function executeCreateCommand(cmdArgs) {
			var objType = cmdArgs[0];
			switch (objType) {
				case 'Apartment':
					var apart = Object.create(apartment)
						.init(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
							parseBoolean(cmdArgs[4]), Number(cmdArgs[5]), parseBoolean(cmdArgs[6]));
					addEstate(apart);
					break;
				case 'Office':
					var off = Object.create(office)
						.init(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
							parseBoolean(cmdArgs[4]), Number(cmdArgs[5]), parseBoolean(cmdArgs[6]));
					addEstate(off);
					break;
				case 'House':
					var hou = Object.create(house)
						.init(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
							parseBoolean(cmdArgs[4]), Number(cmdArgs[5]));
					addEstate(hou);
					break;
				case 'Garage':
					var gara = Object.create(garage)
						.init(cmdArgs[1], Number(cmdArgs[2]), cmdArgs[3],
							parseBoolean(cmdArgs[4]), Number(cmdArgs[5]), Number(cmdArgs[6]));
					addEstate(gara);
					break;
				case 'RentOffer':
					var est = findEstateByName(cmdArgs[1]);
					var rentOff = Object.create(rentOffer)
						.init(est, Number(cmdArgs[2]));
					addOffer(rentOff);
					break;
				case 'SaleOffer':
					est = findEstateByName(cmdArgs[1]);
					var saleOff = Object.create(saleOffer)
						.init(est, Number(cmdArgs[2]));
					addOffer(saleOff);
					break;
				default:
					throw new Error('Unknown object to create: ' + objType);
			}
			return objType + ' created.';
		}

		function parseBoolean(value) {
			switch (value) {
				case "true":
					return true;
				case "false":
					return false;
				default:
					throw new Error("Invalid boolean value: " + value);
			}
		}

		function findEstateByName(estateName) {
			for (var i = 0; i < _estates.length; i++) {
				if (_estates[i].name === estateName) {
					return _estates[i];
				}
			}
			return undefined;
		}

		function addEstate(estate) {
			if (_uniqueEstateNames[estate.name]) {
				throw new Error('Duplicated estate name: ' + estate.name);
			}
			_uniqueEstateNames[estate.name] = true;
			_estates.push(estate);
		}

		function addOffer(offer) {
			_offers.push(offer);
		}

		function executeStatusCommand() {
			var result = '',
				i;
			if (_estates.length > 0) {
				result += 'Estates:\n';
				for (i = 0; i < _estates.length; i++) {
					result += "  " + _estates[i].toString() + '\n';
				}
			} else {
				result += 'No estates\n';
			}

			if (_offers.length > 0) {
				result += 'Offers:\n';
				for (i = 0; i < _offers.length; i++) {
					result += "  " + _offers[i].toString() + '\n';
				}
			} else {
				result += 'No offers\n';
			}

			return result.trim();
		}

		function executeFindSalesByLocationCommand(location) {
			if (!location) {
				throw new Error("Location cannot be empty.");
			}
			var selectedOffers = _offers.filter(function(offer) {
				return offer.estate.location === location &&
					offer.typeName === 'Sale';
			});

			selectedOffers = selectedOffers.sort(function(a, b) {
				return a.estate.name.localeCompare(b.estate.name);
			});

			return formatQueryResults(selectedOffers);
		}

		function executeFindRentsByLocationCommand(location) {
			if (!location) {
				throw new Error('Location cannot be empty');
			}
			var selectedOffers = _offers.filter(function(item) {
				return (item.estate.location === location) &&
					(item.typeName === 'Rent');
			});

			selectedOffers = selectedOffers.sort(function(a, b) {
				return a.estate.name.localeCompare(b.estate.name);
			});
			return formatQueryResults(selectedOffers);
		}

		function executeFindRentsByPriceCommand(minPrice, maxPrice) {
			var selectedOffers;
			minPrice = Number(minPrice);
			maxPrice = Number(maxPrice);

			validators.validatePositiveInteger(minPrice);
			validators.validatePositiveInteger(maxPrice);			

			if (isNaN(minPrice) || isNaN(maxPrice)) {
				throw new Error('Invalid price range arguments');
			}

			selectedOffers = _offers.filter(function(item) {
				var type = item.typeName;
				return type === "Rent" &&
					item.price >= minPrice &&
					item.price <= maxPrice;
			});

			return formatQueryResults(selectedOffers.sort(function(a, b) {
				if (a.price < b.price) {
					return -1;
				} else if (a.price > b.price) {
					return 1;
				} else {
					return a.estate.name.localeCompare(b.estate.name);
				}
			}));
		}

		function formatQueryResults(offers) {
			var result = '';
			if (offers.length == 0) {
				result += 'No Results\n';
			} else {
				result += 'Query Results:\n';
				for (var i = 0; i < offers.length; i++) {
					var offer = offers[i];
					result += '  [Estate: ' + offer.estate.name +
						', Location: ' + offer.estate.location +
						', Price: ' + offer.price + ']\n';
				}
			}
			return result.trim();
		}

		return {
			initialize: initialize,
			executeCommand: executeCommand
		};
	}());


	// Process the input commands and return the results
	var results = '';
	EstatesEngine.initialize();
	commands.forEach(function(cmd) {
		if (cmd != '') {
			try {
				var cmdResult = EstatesEngine.executeCommand(cmd);
				results += cmdResult + '\n';
			} catch (err) {
				//console.log(err);
				results += 'Invalid command.\n';
			}
		}
	});
	return results.trim();
}

(function() {
	var arr = [];
	if (typeof(require) == 'function') {
		// We are in node.js --> read the console input and process it
		require('readline').createInterface({
			input: process.stdin,
			output: process.stdout
		}).on('line', function(line) {
			arr.push(line);
		}).on('close', function() {
			console.log(processEstatesAgencyCommands(arr));
		});
	}
})();