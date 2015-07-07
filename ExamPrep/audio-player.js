function solve() {
    var module = (function () {
        var module = {
            getPlayer: function (name) {
                return Object.create(player).init(name);
            },
            getPlaylist: function (name) {
                return Object.create(playlist).init(name);
            },
            getAudio: function (title, author, length) {
                return Object.create(audio).init(title, audio, length);
            },
            getVideo: function (title, author, imdbRating) {
                return Object.create(video).init(title, author, imdbRating);
            }
        },
        playlistIds = 0,
        playerIds = 0,
        playableIds = 0,
        validator,
        CONSTANTS = {
            TEXT_MIN_LENGTH: 3,
            TEXT_MAX_LENGTH: 25,
            IMDB_MIN: 1,
            IMDB_MAX: 5
        };

        validator = {
            validateUndefined: function (val, name) {
                if (val === undefined) {
                    throw new Error(name + ' is undefined');
                }
            },
            validateNumber: function (val, name) {
                if (typeof val !== 'number') {
                    throw new Error(name + ' must be a number');
                }
            },
            validateIfObject: function (val, name) {
                name = name || 'Value';

                if (typeof val !== 'object') {
                    throw new Error();
                }
            },
            validateString: function (val, name) {
                name = name || 'Value';
                this.validateUndefined(val, name);

                if (typeof val !== 'string') {
                    throw new Error(name + ' must be string');
                }

                if (val.length < CONSTANTS.TEXT_MIN_LENGTH || CONSTANTS.TEXT_MAX_LENGTH < val.length) {
                    throw new Error(name + ' not the correct size');
                }
            },
            validatePositiveNumber: function (val, name) {
                name = name || 'Value';
                this.validateUndefined(val, name);
                this.validateNumber(val, name);

                if (val <= 0) {
                    throw new Error(name + ' must be positive number');
                }
            },
            validateImdbRating: function (val) {
                this.validateUndefined(val, 'imdb rating');
                this.validateNumber(val, 'imdb rating');

                if (val < CONSTANTS.IMDB_MIN || CONSTANTS.IMDB_MAX < val) {
                    throw new Error('Invalid rating');
                }
            }
        };


        var player = (function () {
            var player = {},
                playlists = [];

            Object.defineProperty(player, 'init', {
                value: function (name) {
                    this.name = name;
                    this._id = ++playerIds;
                    playlists = [];
                    return this;
                }
            });

            Object.defineProperty(player, 'id', {
                get: function () {
                    return this._id;
                }
            });

            Object.defineProperty(player, 'name', {
                get: function () {
                    return this._name;
                },
                set: function (val) {
                    validator.validateString(val, 'player name');
                    this._name = val;
                }
            });

            Object.defineProperty(player, 'getPlayer', {
                value: function (name) {
                    return Object.create(this).init(name);
                }
            });

            Object.defineProperty(player, 'addPlaylist', {
                value: function (playlistToAdd) {
                    //if (!playlist.isPrototypeOf(playlistToAdd)) {
                    //    throw new Error('playlistToAdd is not prototype of playlist');
                    //}
                    playlists.push(playlistToAdd);
                    return this;
                }
            });

            Object.defineProperty(player, 'getPlaylistById', {
                value: function (id) {
                    var playlistToReturn = playlists.filter(function (currentPlaylist) {
                        return currentPlaylist.id === id;
                    });

                    if (playlistToReturn.length) {
                        return playlistToReturn[0];
                    }
                    else {
                        return null;
                    }
                }
            });

            Object.defineProperty(player, 'removePlaylist', {
                value: function (playlistOrId) {
                    var playlistToRemove,
                        indexOfPlaylistToBeRemoved;

                    if (playlist.isPrototypeOf(playlistOrId)) {
                        playlistToRemove = findById(playlistOrId.id, playlists);
                    }
                    else {
                        playlistToRemove = findById(playlistOrId, playlists);
                    }

                    if (!playlistToRemove) {
                        throw new Error('No such playlist to remove');
                    }

                    indexOfPlaylistToBeRemoved = playlists.indexOf(playlistToRemove);
                    playlists.splice(indexOfPlaylistToBeRemoved, 1);

                    return this;
                }
            });

            Object.defineProperty(player, 'listPlaylists', {
                value: function (page, size) {
                    return list(page, size, playlists);
                }
            });

            Object.defineProperty(player, 'contains', {
                value: function (playable, playlist) {
                    if (playlist.getPlayableById(playable.id)) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });

            return player;
        }());

        var playlist = (function () {
            var playlist = {},
                playables = [];

            Object.defineProperty(playlist, 'init', {
                value: function (name) {
                    this.name = name;
                    this._id = ++playlistIds;
                    playables = []
                    return this;
                }
            });

            Object.defineProperty(playlist, 'id', {
                get: function () {
                    return this._id;
                }
            });

            Object.defineProperty(playlist, 'name', {
                get: function () {
                    return this._name;
                },
                set: function (val) {
                    validator.validateString(val, 'playlist name');
                    this._name = val;
                }
            });

            Object.defineProperty(playlist, 'addPlayable', {
                value: function (playable) {
                    playables.push(playable);
                    return this;
                }
            });

            Object.defineProperty(playlist, 'getPlayableById', {
                value: function (id) {
                    var foundPlayable = findById(id, playables);

                    if (foundPlayable) {
                        return foundPlayable;
                    }
                    else {
                        return null;
                    }
                }
            });

            Object.defineProperty(playlist, 'removePlayable', {
                value: function (playableOrId) {
                    var playableToRemove,
                        indexOfPlayableToRemove;
                    if (playable.isPrototypeOf(playableOrId)) {
                        playableToRemove = findById(playableOrId.id, playables);
                    }
                    else {
                        playableToRemove = findById(playableOrId, playables);
                    }

                    if (playableToRemove === undefined) {
                        throw new Error('No playable to remove');
                    }

                    indexOfPlayableToRemove = playables.indexOf(playableToRemove);
                    playables.splice(indexOfPlayableToRemove, 1);

                    return this;
                }
            });

            Object.defineProperty(playlist, 'listPlaylables', {
                value: function (page, size) {
                    return list(page, size, playables);
                }
            });

            return playlist;
        }());


        var playable = (function () {
            var playable = {};

            Object.defineProperty(playable, 'init', {
                value: function (title, author) {
                    this.title = title;
                    this.author = author;
                    this._id = ++playableIds;
                    return this;
                }
            });

            Object.defineProperty(playable, 'id', {
                get: function () {
                    return this._id;
                }
            });

            Object.defineProperty(playable, 'title', {
                get: function () {
                    return this._title;
                },
                set: function (val) {
                    validator.validateString(val, 'playable title');
                    this._title = val;
                }
            });

            Object.defineProperty(playable, 'author', {
                get: function () {
                    return this._author;
                },
                set: function (val) {
                    validator.validateString(val, 'playable author');
                    this._author = val;
                }
            });

            Object.defineProperty(playable, 'play', {
                value: function () {
                    return this.id + '. ' + this.title + ' - ' + this.author;
                }
            });

            return playable;
        }());

        var audio = (function (parent) {
            var audio = Object.create(parent);

            Object.defineProperty(audio, 'init', {
                value: function (title, author, length) {
                    parent.init.call(this, title, author);
                    this.length = length;
                    return this;
                }
            });

            Object.defineProperty(audio, 'length', {
                get: function () {
                    return this._length;
                },
                set: function (val) {
                    validator.validatePositiveNumber(val, 'audio length');
                    this._length = val;
                }
            });

            Object.defineProperty(audio, 'play', {
                value: function () {
                    return parent.play.call(this) + ' - ' + this.length;
                }

            });

            return audio;
        }(playable));

        var video = (function (parent) {
            var video = Object.create(parent);

            Object.defineProperty(video, 'init', {
                value: function (title, author, imdbRating) {
                    parent.init.call(this, title, author);
                    this.imdbRating = imdbRating;
                    return this;
                }
            });

            Object.defineProperty(video, 'imdbRating', {
                get: function () {
                    return this._imdbRating;
                },
                set: function (val) {
                    validator.validateImdbRating(val);
                    this._imdbRating = val;
                }
            });

            Object.defineProperty(video, 'play', {
                value: function () {
                    return parent.play.call(this) + ' - ' + this.imdbRating;
                }

            });

            return video;
        }(playable));

        function list(page, size, currentArray) {
            var arrayInUse = currentArray.slice(0);

            if (page < 0 || size <= 0 || page * size > currentArray.length) {
                throw new Error('Wrong page or size');
            }

            return arrayInUse.splice(page * size, size);
        }

        function findById(id, currentPlaySth) {
            var foundById = currentPlaySth.filter(function (current) {
                return current.id === id;
            });

            return foundById[0];
        }

        return module;
    }());

    return module;
}