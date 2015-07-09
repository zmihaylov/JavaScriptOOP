function solve() {
    var CONSTANTS = {
        MIN_TEXT_LENGTH: 2,
        MAX_TEXT_LENGTH: 40,
        MAX_GENRE_LENGTH: 20,
    };

    var validators = {
        validateNonEmptyString: function (val, name) {
            if (typeof val !== 'string') {
                throw new Error(name + 'is not an string');
            }

            if (!val.length) {
                throw new Error(name + 'is an empty string');
            }
        },
        validateStringLength: function (val, name, min, max) {
            this.validateNonEmptyString(val, name);

            if (val.length < min || max < val.length) {
                throw new Error(name + ' has wrong length');
            }
        },
        validateISBN: function (val, name) {
            this.validateNonEmptyString(val, name);
            if (val.length !== 10 && val.length !== 13) {
                throw new Error(name + ' has wrong size');
            }

            var isnum = /^\d+$/.test(val);

            if (!isnum) {
                throw new Error(name + ' does not contain only digits');
            }
        },
        validatePositiveNumber: function (val, name) {
            if (typeof val !== 'number') {
                throw new Error(name + ' is not a number');
            }

            if (val <= 0) {
                throw new Error(name + ' is less or equal to zero');
            }
        },
        validateRating: function (val, name) {
            this.validatePositiveNumber(val, name);

            if (val < 1 || val > 5) {
                throw new Error(name + ' has got wrong rating');
            }
        }
    };


    var item = (function () {
        var item = {},
            curentItemId = 0;

        Object.defineProperty(item, 'init', {
            value: function (name, description) {
                this.description = description;
                this.name = name;
                this._id = ++curentItemId;
                return this;
            }
        });

        Object.defineProperty(item, 'id', {
            get: function () {
                return this._id;
            }
        });

        Object.defineProperty(item, 'description', {
            get: function () {
                return this._description;
            },
            set: function (val) {
                validators.validateNonEmptyString(val, 'item description');
                this._description = val;
            }
        });

        Object.defineProperty(item, 'name', {
            get: function () {
                return this._name;
            },
            set: function (val) {
                validators.validateStringLength(val, 'item name', CONSTANTS.MIN_TEXT_LENGTH, CONSTANTS.MAX_TEXT_LENGTH);
                this._name = val;
            }
        });

        return item;
    }());

    var book = (function (parent) {
        var book = Object.create(parent);

        Object.defineProperty(book, 'init', {
            value: function (name, isbn, genre, description) {
                parent.init.call(this, name, description);
                this.isbn = isbn;
                this.genre = genre;
                return this;
            }
        });

        Object.defineProperty(book, 'isbn', {
            get: function () {
                return this._isbn;
            },
            set: function (val) {
                validators.validateISBN(val, 'book isbn');
                this._isbn = val;
            }
        });

        Object.defineProperty(book, 'genre', {
            get: function () {
                return this._genre;
            },
            set: function (val) {
                validators.validateStringLength(val, 'book genre', CONSTANTS.MIN_TEXT_LENGTH, CONSTANTS.MAX_GENRE_LENGTH);
                this._genre = val;
            }
        });

        return book;
    }(item));

    var media = (function (parent) {
        var media = Object.create(parent);

        Object.defineProperty(media, 'init', {
            value: function (name, rating, duration, description) {
                parent.init.call(this, name, description);
                this.rating = rating;
                this.duration = duration;
                return this;
            }
        });

        Object.defineProperty(media, 'rating', {
            get: function () {
                return this._rating;
            },
            set: function (val) {
                validators.validateRating(val, 'rating');
                this._rating = val;
            }
        });

        Object.defineProperty(media, 'duration', {
            get: function () {
                return this._duration;
            },
            set: function (val) {
                validators.validatePositiveNumber(val, 'duration');
                this._duration = val;
            }
        });


        return media;
    }(item));

    var catalog = (function () {
        var catalog = {},
            currentCatalogId = 0;

        Object.defineProperty(catalog, 'init', {
            value: function (name) {
                this._id = ++currentCatalogId;
                this.name = name;
                this._items = [];
                return this;
            }
        });

        Object.defineProperty(catalog, 'items', {
            get: function () {
                return this._items;
            }
        });

        Object.defineProperty(catalog, 'id', {
            get: function () {
                return this._id;
            }
        });

        Object.defineProperty(catalog, 'name', {
            get: function () {
                return this._name;
            },
            set: function (val) {
                validators.validateStringLength(val, 'catalog name', CONSTANTS.MIN_TEXT_LENGTH, CONSTANTS.MAX_TEXT_LENGTH);
                this._name = val;
            }
        });

        Object.defineProperty(catalog, 'add', {
            value: function () {
                var itemsToAdd = [],
                    len,
                    i,
                    self = this;

                if (!arguments.length) {
                    throw new Error('no arguments are passed in the add function of the catalog');
                }

                if (arguments.length === 1) {

                    if (Array.isArray(arguments[0])) {
                        itemsToAdd = arguments[0].slice();

                        if (!itemsToAdd.length) {
                            throw new Error('in the catalog the array in the add method is empty')
                        }
                    }
                    else {
                        itemsToAdd.push(arguments[0]);
                    }
                }
                else {
                    for (i = 0, len = arguments.length; i < len; i++) {
                        itemsToAdd.push(arguments[i]);
                    }
                }

                for (i = 0, len = itemsToAdd.length; i < len; i++) {
                    var currentItem = itemsToAdd[i];
                    if (currentItem.name === undefined || currentItem.id === undefined || currentItem.description === undefined) {
                        throw new Error('some of the items to add are not an instance of item');
                    }
                }

                itemsToAdd.forEach(function (item) {
                    self._items.push(item);
                });
            }
        });

        Object.defineProperty(catalog, 'find', {
            value: function (idOrOptions) {
                var itemToReturn = [],
                    self = this;
                if (typeof idOrOptions === 'object') {
                    itemToReturn = self._items.filter(function (currentItem) {
                        var equal = true;

                        for (var prop in idOrOptions) {
                            var currentItemProp = currentItem[prop];
                            var patternProp = idOrOptions[prop];

                            if (typeof currentItemProp === 'string') {
                                currentItemProp = currentItemProp.toLowerCase();
                                patternProp = patternProp.toLowerCase()
                            }

                            if (currentItemProp !== patternProp) {
                                equal = false;
                            }
                        }

                        return equal;
                    });

                    return itemToReturn;
                }
                else {
                    if (typeof idOrOptions !== 'number') {
                        throw new Error('Id is not an object');
                    }

                    itemToReturn = self._items.filter(function (currentItem) {
                        return currentItem.id === idOrOptions;
                    });

                    if (!itemToReturn[0]) {
                        return null;
                    }
                    else {
                        return itemToReturn[0];
                    }
                }
            }
        });

        Object.defineProperty(catalog, 'search', {
            value: function (pattern) {
                var self = this;
                validators.validateNonEmptyString(pattern, 'search pattern');
                pattern = pattern.toLowerCase();

                return self._items.filter(function (currentItem) {
                    var name = currentItem.name.toLowerCase();
                    var description = currentItem.description.toLowerCase();

                    if (name.indexOf(pattern) > -1 ||
                        description.indexOf(pattern) > -1) {
                        return true;
                    }

                    return false;
                });
            }
        });

        return catalog;
    }());

    var bookCatalog = (function (parent) {
        var bookCatalog = Object.create(parent);

        Object.defineProperty(bookCatalog, 'getGenres', {
            value: function () {
                var genresToReturn = {},
                    arrayOfgenresReallyToReturn = [],
                    self = this;

                for (var i = 0; i < self._items.length; i++) {
                    var currentBook = self._items[i];

                    if (!genresToReturn[currentBook.genre]) {
                        genresToReturn[currentBook.genre] = currentBook.genre.toLowerCase();
                    }
                }

                for (var prop in genresToReturn) {
                    arrayOfgenresReallyToReturn.push(genresToReturn[prop]);
                }

                return arrayOfgenresReallyToReturn;
            }
        });

        Object.defineProperty(bookCatalog, 'add', {
            value: function () {
                var itemsToAdd = [],
                    len,
                    i,
                    self = this;


                if (!arguments.length) {
                    throw new Error('no arguments are passed in the add function of the catalog');
                }

                if (arguments.length === 1) {

                    if (Array.isArray(arguments[0])) {
                        itemsToAdd = arguments[0].slice();

                        if (!itemsToAdd.length) {
                            throw new Error('in the catalog the array in the add method is empty')
                        }
                    }
                    else {
                        itemsToAdd.push(arguments[0]);
                    }
                }
                else {
                    for (i = 0, len = arguments.length; i < len; i++) {
                        itemsToAdd.push(arguments[i]);
                    }
                }

                for (i = 0, len = itemsToAdd.length; i < len; i++) {
                    var currentBook = itemsToAdd[i];
                    if (currentBook.isbn === undefined || currentBook.genre === undefined || currentBook.name === undefined || currentBook.id === undefined || currentBook.description === undefined) {
                        throw new Error('some of the items to add are not an instance of item');
                    }
                }

                itemsToAdd.forEach(function (item) {
                    self._items.push(item);
                });
            }
        });

        return bookCatalog;
    }(catalog));

    var mediaCatalog = (function (parent) {
        var mediaCatalog = Object.create(parent);

        Object.defineProperty(mediaCatalog, 'getTop', {
            value: function (count) {
                if (typeof count !== 'number') {
                    throw new Error('count is not a number');
                }

                if (count < 1) {
                    throw new Error('count is less than one');
                }

                this._items.sort(function (one,two) {
                    return one.rating - two.rating;
                });

                return this._items.map(function (currentItem) {
                    return {
                        id: currentItem.id,
                        name: currentItem.name};
                }).slice(0, count);
            }
        });

        Object.defineProperty(mediaCatalog, 'add', {
            value: function () {
                var itemsToAdd = [],
                    len,
                    i,
                    self = this;

                if (!arguments.length) {
                    throw new Error('no arguments are passed in the add function of the catalog');
                }

                if (arguments.length === 1) {

                    if (Array.isArray(arguments[0])) {
                        itemsToAdd = arguments[0].slice();

                        if (!itemsToAdd.length) {
                            throw new Error('in the catalog the array in the add method is empty')
                        }
                    }
                    else {
                        itemsToAdd.push(arguments[0]);
                    }
                }
                else {
                    for (i = 0, len = arguments.length; i < len; i++) {
                        itemsToAdd.push(arguments[i]);
                    }
                }

                for (i = 0, len = itemsToAdd.length; i < len; i++) {
                    var currentMedia = itemsToAdd[i];
                    if (currentMedia.rating === undefined || currentMedia.duration === undefined || currentMedia.name === undefined || currentMedia.id === undefined || currentMedia.description === undefined) {
                        throw new Error('some of the items to add are not an instance of item');
                    }
                }

                itemsToAdd.forEach(function (item) {
                    self._items.push(item);
                });
            }
        });

        Object.defineProperty(mediaCatalog, 'getSortedByDuration', {
            value: function () {
                return this._items.sort(function (one,two) {
                    if (one.duration > two.duration) {
                        return -1;
                    }
                    else if (one.duration < two.duration) {
                        return 1;
                    }

                    return one.id - two.id;
                });
            }
        });

        return mediaCatalog;
    }(catalog));

    return {
        getBook: function (name, isbn, genre, description) {
            return Object.create(book).init(name, isbn, genre, description);
        },
        getMedia: function (name, rating, duration, description) {
            return Object.create(media).init(name, rating, duration, description);
        },
        getBookCatalog: function (name) {
            return Object.create(bookCatalog).init(name);
        },
        getMediaCatalog: function (name) {
            return Object.create(mediaCatalog).init(name);
        }
    };
}

//var module = solve();

//var catalog = module.getBookCatalog('John\'s catalog');

//var book1 = module.getBook('The secrets of the JavaScript Ninja', '1234567890', 'IT', 'A book about JavaScript');
//var book2 = module.getBook('JavaScript: The Good Parts', '0123456789', 'IT', 'A good book about JS');
//catalog.add(book1);
//catalog.add(book2);

//var catalogMedia = module.getMediaCatalog('ti go rura');
////catalogMedia.add(book1);

//var media = module.getMedia('zlaty', 4, 4, 'nai golemiq');
//var media2 = module.getMedia('asdty', 1, 4, 'nai goasdaslemiq');
//catalogMedia.add(media);
//catalogMedia.add(media2);

//console.log(catalogMedia.getSortedByDuration());
//console.log(catalogMedia.getTop());

//console.log(catalog.find(book1.id));
////returns book1

//console.log(catalog.find({ id: book2.id, genre: 'IT' }));
////returns book2

//console.log(catalog.search('js'));
//// returns book2

//console.log(catalog.search('javascript'));
////returns book1 and book2

//console.log(catalog.search('Te sa zeleni'))
////returns []