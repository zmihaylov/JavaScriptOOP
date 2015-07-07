function processTravelAgencyCommands(commands) {
    'use strict';
    
    var validators = (function () {
        var validators = {
            validateNotEmptyString: function (value,methodName) {
                if (!value) {
                    throw new Error('Invalid null value. Method ' + methodName);
                }
                
                if (value === '') {
                    throw new Error('Invalid empty string. Method ' + methodName);
                }
            },
            validateDate: function (value,methodName) {
                if (!value) {
                    throw new Error('Invalid null value. Method ' + methodName);
                }
                
                if (!(value instanceof Date)) {
                    throw new Error('Invalid date object. Method ' + methodName);
                }
            },
            validateNonNegativeNumber: function (value,methodName) {
                if (isNaN(value)) {
                    throw new Error('Value is not a number. Method ' + methodName);
                }
                
                if (value < 0) {
                    throw new Error('Invalid negative number. Method ' + methodName);
                }
            }
        };
        
        return validators;
    }());
    
    var Models = (function() {
        var Destination = (function() {
            
            var Destination = {
              init: function (location, landmark) {
                  this.location = location;
                  this.landmark = landmark;
                  this.typeName = 'Destination';
                  return this;
              },
              get location(){
                  return this._location;   
              },
              set location(value){
                  validators.validateNotEmptyString(value,'destination location');
                  this._location = value;
              },
              get landmark(){
                  return this._landmark;
              },
              set landmark(value){
                  validators.validateNotEmptyString(value,'destination landmark');
                  this._landmark = value;
              },
              toString: function () {
                  return this.typeName + ': location=' + this.location + ',landmark=' + this.landmark; 
              } 
            };

            return Destination;
        }());

        var Travel = (function () {
            var Travel = {
                init: function (name, startDate, endDate, price) {
                    this.name = name;
                    this.startDate = startDate;
                    this.endDate = endDate;
                    this.price = price;
                    this.typeName = 'Travel';
                    
                    return this;
                },
                set name(value){
                    validators.validateNotEmptyString(value);
                    this._name= value;
                },
                get name(){
                    return this._name;
                },
                set endDate(value){
                    validators.validateDate(value);
                    this._endDate = value;
                },
                get endDate(){
                    return this._endDate;
                },
                set startDate(value){
                    validators.validateDate(value);
                    this._startDate = value;
                },
                get startDate(){
                    return this._startDate;
                },
                set price(value){
                    validators.validateNonNegativeNumber(value);
                    this._price = value;
                },
                get price(){
                    return this._price;
                },
                toString: function () {
                    return ' * ' + this.typeName + ': name=' + 
                                   this.name + ',start-date=' + 
                                   formatDate(this.startDate) + ',end-date=' + 
                                   formatDate(this.endDate) + ',price=' + 
                                   this.price.toFixed(2);
                }
            };
            
            return Travel;
        }());

        var Excursion = (function (parent) {
            var Excursion = Object.create(parent, {
                init:{
                    value: function (name, startDate, endDate, price, transport) {
                        parent.init.call(this,name,startDate,endDate,price);
                        this.transport = transport;
                        this._destinations = [];
                        this.typeName = 'Excursion';
                        
                        return this;
                    }
                },
                transport: {
                    get: function () {
                        return this._transport;
                    },
                    set: function (value) {
                        validators.validateNotEmptyString(value);
                        this._transport = value;
                    }
                },
                addDestination: {
                    value: function (value) {
                        if (!isValidDestination(value)) {
                            throw new Error('Invalid destination object');
                        }
                        this._destinations.push(value);
                        
                    }
                },
                removeDestination: {
                    value: function (value) {
                        if (isValidDestination(value)) {
                            this._destinations = this._destinations.filter(function (dest) {
                                return dest.location !== value.location &&
                                       dest.landmark !== value.landmark;
                            });
                        }
                    }
                },
                getDestinations: {
                    value: function () {
                        return this._destinations.slice(0);
                    }
                },
                toString: {
                    value: function () {
                        return parent.toString.call(this) + ',transport=' + this.transport + getDestinationsText(this);
                    }
                }
            });
            
            function isValidDestination(value) {
                return value.typeName === 'Destination';
            }
            
            function getDestinationsText(that) {
                if (that.typeName === 'Excursion') {
                    var destinationText = that.getDestinations.join(';') || '-';
                    return '\n ** Destinations: ' + destinationText;
                }
                return '';
            }
            
            return Excursion;
        }(Travel));

        var Vacation = (function (parent) {
            var Vacation = Object.create(parent, {
                init: {
                    value: function (name, startDate, endDate, price, location, accommodation) {
                        parent.init.call(this,name,startDate,endDate,price);
                        this.typeName = 'Vacation';
                        this.location = location;
                        this.accommodation = accommodation;
                        
                        return this;
                    }
                },
                location: {
                    get: function () {
                        return this._location;
                    },
                    set: function (value) {
                        validators.validateNotEmptyString(location);
                        this._location = value;
                    }
                },
                accommodation: {
                    get: function () {
                        return this._accommodation;
                    },
                    set: function (value) {
                        validators.validateNotEmptyString(value);
                        this._accommodation = value;
                    }
                },
                toString: {
                    value: function () {
                        var accommText = this.accommodation ? ',accommodation=' + this.accommodation : '';
                        return parent.toString.call(this) + ',location=' + this.location + accommText;
                    }
                }
            });
            
            return Vacation;
        }(Travel));

        var Cruise = (function (parent) {
            var Cruise = Object.create(parent, {
                init: {
                    value: function (name, startDate, endDate, price, transport, startDock) {
                        parent.init.call(this,name,startDate,endDate,price,'cruise liner');
                        this.startDock = startDock;
                        this.typeName = 'Cruise';
                    }
                },
                startDock: {
                    get: function () {
                        return this._startDock;
                    },
                    set: function (value) {
                        if (value) {
                            validators.validateNotEmptyString(value);
                        }
                        
                        this._startDock = value;
                    }
                },
                toString: {
                    value: function () {
                        var startDockText = this.startDock ? ',start-dock=' + this.startDock : '',
							destinationsText = this.getDestinations().join(';') || '-';
                            
                        return parent.toString.call(this) + startDockText +
							'\n ** Destinations: ' + destinationsText;
                    }
                }
            });
            
            return Cruise;
        }(Excursion));

        return {
            Destination: Destination,
            Travel: Travel,
            Excursion: Excursion,
            Vacation: Vacation,
            Cruise: Cruise
        };
    }());

    var TravellingManager = (function(){
        var _travels;
        var _destinations;

        function init() {
            _travels = [];
            _destinations = [];
        }

        var CommandProcessor = (function() {

            function processInsertCommand(command) {
                var object;

                switch (command["type"]) {
                    case "excursion":
                        object = new Models.Excursion(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
                            parseFloat(command["price"]), command["transport"]);
                        _travels.push(object);
                        break;
                    case "vacation":
                        object = new Models.Vacation(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
                            parseFloat(command["price"]), command["location"], command["accommodation"]);
                        _travels.push(object);
                        break;
                    case "cruise":
                        object = new Models.Cruise(command["name"], parseDate(command["start-date"]), parseDate(command["end-date"]),
                            parseFloat(command["price"]), command["start-dock"]);
                        _travels.push(object);
                        break;
                    case "destination":
                        object = new Models.Destination(command["location"], command["landmark"]);
                        _destinations.push(object);
                        break;
                    default:
                        throw new Error("Invalid type.");
                }

                return object.constructor.name + " created.";
            }

            function processDeleteCommand(command) {
                var object,
                    index,
                    destinations;

                switch (command["type"]) {
                    case "destination":
                        object = getDestinationByLocationAndLandmark(command["location"], command["landmark"]);
                        _travels.forEach(function(t) {
                            if (t instanceof Models.Excursion && t.getDestinations().indexOf(object) !== -1) {
                                t.removeDestination(object);
                            }
                        });
                        index = _destinations.indexOf(object);
                        _destinations.splice(index, 1);
                        break;
                    case "excursion":
                    case "vacation":
                    case "cruise":
                        object = getTravelByName(command["name"]);
                        index = _travels.indexOf(object);
                        _travels.splice(index, 1);
                        break;
                    default:
                        throw new Error("Unknown type.");
                }

                return object.constructor.name + " deleted.";
            }

            function processListCommand(command) {
                return formatTravelsQuery(_travels);
            }

            function processAddDestinationCommand(command) {
                var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
                    travel = getTravelByName(command["name"]);

                if (!(travel instanceof Models.Excursion)) {
                    throw new Error("Travel does not have destinations.");
                }
                travel.addDestination(destination);

                return "Added destination to " + travel.getName() + ".";
            }

            function processRemoveDestinationCommand(command) {
                var destination = getDestinationByLocationAndLandmark(command["location"], command["landmark"]),
                    travel = getTravelByName(command["name"]);

                if (!(travel instanceof Models.Excursion)) {
                    throw new Error("Travel does not have destinations.");
                }
                travel.removeDestination(destination);

                return "Removed destination from " + travel.getName() + ".";
            }

            function getTravelByName(name) {
                var i;

                for (i = 0; i < _travels.length; i++) {
                    if (_travels[i].getName() === name) {
                        return _travels[i];
                    }
                }
                throw new Error("No travel with such name exists.");
            }

            function getDestinationByLocationAndLandmark(location, landmark) {
                var i;

                for (i = 0; i < _destinations.length; i++) {
                    if (_destinations[i].getLocation() === location
                        && _destinations[i].getLandmark() === landmark) {
                        return _destinations[i];
                    }
                }
                throw new Error("No destination with such location and landmark exists.");
            }

            function formatTravelsQuery(travelsQuery) {
                var queryString = "";

                if (travelsQuery.length > 0) {
                    queryString += travelsQuery.join("\n");
                } else {
                    queryString = "No results.";
                }

                return queryString;
            }

            return {
                processInsertCommand: processInsertCommand,
                processDeleteCommand: processDeleteCommand,
                processListCommand: processListCommand,
                processAddDestinationCommand: processAddDestinationCommand,
                processRemoveDestinationCommand: processRemoveDestinationCommand
            };
        }());

        var Command = (function() {
            function Command(cmdLine) {
                this._cmdArgs = processCommand(cmdLine);
            }

            function processCommand(cmdLine) {
                var parameters = [],
                    matches = [],
                    pattern = /(.+?)=(.+?)[;)]/g,
                    key,
                    value,
                    split;

                split = cmdLine.split("(");
                parameters["command"] = split[0];
                while ((matches = pattern.exec(split[1])) !== null) {
                    key = matches[1];
                    value = matches[2];
                    parameters[key] = value;
                }

                return parameters;
            }

            return Command;
        }());

        function executeCommands(cmds) {
            var commandArgs = new Command(cmds)._cmdArgs,
                action = commandArgs["command"],
                output;

            switch (action) {
                case "insert":
                    output = CommandProcessor.processInsertCommand(commandArgs);
                    break;
                case "delete":
                    output = CommandProcessor.processDeleteCommand(commandArgs);
                    break;
                case "add-destination":
                    output = CommandProcessor.processAddDestinationCommand(commandArgs);
                    break;
                case "remove-destination":
                    output = CommandProcessor.processRemoveDestinationCommand(commandArgs);
                    break;
                case "list":
                    output = CommandProcessor.processListCommand(commandArgs);
                    break;
                case "filter":
                    output = CommandProcessor.processFilterTravelsCommand(commandArgs);
                    break;
                default:
                    throw new Error("Unsupported command.");
            }

            return output;
        }

        return {
            init: init,
            executeCommands: executeCommands
        };
    }());

    var parseDate = function (dateStr) {
        if (!dateStr) {
            return undefined;
        }
        var date = new Date(Date.parse(dateStr.replace(/-/g, ' ')));
        var dateFormatted = formatDate(date);
        if (dateStr != dateFormatted) {
            throw new Error("Invalid date: " + dateStr);
        }
        return date;
    };

    var formatDate = function (date) {
        var day = date.getDate();
        var monthName = date.toString().split(' ')[1];
        var year = date.getFullYear();
        return day + '-' + monthName + '-' + year;
    };

    var output = "";
    TravellingManager.init();

    commands.forEach(function(cmd) {
        var result;
        if (cmd != "") {
            try {
                result = TravellingManager.executeCommands(cmd) + "\n";
            } catch (e) {
                result = "Invalid command." + "\n";
            }
            output += result;
        }
    });

    return output;
}

// ------------------------------------------------------------
// Read the input from the console as array and process it
// Remove all below code before submitting to the judge system!
// ------------------------------------------------------------

(function() {
    var arr = [];
    if (typeof (require) == 'function') {
        // We are in node.js --> read the console input and process it
        require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        }).on('line', function(line) {
            arr.push(line);
        }).on('close', function() {
            console.log(processTravelAgencyCommands(arr));
        });
    }
})();