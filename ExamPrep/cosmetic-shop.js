var cosmeticShop = (function () {
	
	var product = (function () {
		var product = {},
			typeGender = {
				men: 'men',
				women: 'women',
				unisex: 'unisex'
			};
			
			function validateProductPrice(price) {
				if (isNaN(price) || price < 0) {
					throw new Error();
				}
			}
			
			function  validateProductGender(gender) {
				if (!typeGender.hasOwnProperty(gender)) {
					throw new Error('Invalid gender');
				}
			}
			
			function validateProductName(name) {
				if (typeof name !== 'string') {
					throw new Error('Name must be string');
				}
				
				if (name.length < 3 || 10 < name.length) {
					throw new Error('Name does not have the correct length');
				}
			}
			
			function validateProductBrand(brand) {
				if (typeof brand !== 'string') {
					throw new Error('Brand must be string');
				}
				
				if (brand.length < 2 || 10 < brand.length) {
					throw new Error('Brand does not have the correct length');
				}
			}
			
			function validateProduct(price,gender,name,brand) {
				validateProductBrand(brand);
				validateProductGender(gender);
				validateProductName(name);
				validateProductPrice(price);
			}
			
			Object.defineProperty(product,'init',{
				value: function (name,brand,price,gender){
					validateProduct(price,gender,name,brand);
					
					this.name = name;
					this.brand = brand;
					this.price = price;
					this.gender = gender;
					
					return  this;
				}
			});
			
			Object.defineProperty(product,'print', {
				value: function () {
					return 'Product info' + ' ' + this.name + ' ' + this.brand + ' ' + this.price + ' ' + this.gender;
				}
			});
		
		return product;
	}());
	
	var shampoo = (function (parent) {
		var shampoo = Object.create(parent),
			usage = {
				everyday: 'everyday',
				medical: 'medical'
			};
		
		function validateShampooMilliliters(milliliters) {
			if (isNaN(milliliters) || milliliters < 0) {
				throw new Error('Inavlid milliliters');
			}
		}
		
		function validateShampooUsage(usageType) {
			if (!usage[usageType]) {
				throw new Error('Invalid usagetype');
			}
		}
		
		function validateShampoo(milliliters,usageType) {
			validateShampooMilliliters(milliliters);
			validateShampooUsage(usageType);
		}
		
		Object.defineProperty(shampoo,'init',{
			value: function (name,brand,price,gender,milliliters,usageType) {
				validateShampoo(milliliters,usageType);
				var totalPrice = price*milliliters;
				
				parent.init.call(this,name,brand,totalPrice,gender);
				this.milliliters = milliliters;
				this.usageType = usageType;
				
				return this;
			}
		});
		
		Object.defineProperty(shampoo,'print',{
			value:function () {
				return parent.print.call(this) + ' ' + this.milliliters + ' ' + this.usageType;	
			}
		});
		
		return shampoo;
	}(product));
	
	var toothpaste = (function (parent) {
		var toothpaste = Object.create(parent);
		
		function validateIngredients(ingredients) {
			if (!Array.isArray(ingredients)) {
				throw new Error('Not an array');
			}
			
			ingredients.forEach(function (ingredient) {
				if (typeof ingredient !== 'string') {
					throw new Error('Ingredient not a string');
				}
				
				if (ingredient.length < 4 || 12 < ingredient.length) {
					throw new Error('Ingredient has wrong size');	
				}
			});
		}
		
		Object.defineProperty(toothpaste,'init',{
			value: function (name,brand,price,gender,ingredients) {
				parent.init.call(this,name,brand,price,gender);
				
				validateIngredients(ingredients);
				
				this.ingredients = ingredients.join(' ');
				
				return this;
			}
		});
		
		Object.defineProperty(toothpaste,'print',{
			value: function () {
				return parent.print.call(this) + ' ' + this.ingredients;
			}
		});
		
		return  toothpaste;
	}(product));
	
	
	var category = (function () {
		var category = {},
			products = [];
			
		function validateCategoryName(name) {
			if (typeof name !== 'string') {
				throw new Error('Category name must be a string')
			}
			
			if (name.length < 2 || 15 < name.length) {
				throw new Error('Category name has wrong size');
			}
		}
		
		function sortFunc(a,b){
		 	if (a.brand < b.brand) {
					return -1;
			}
			else if (a.brand > b.brand) {
					return 1;
			}
			
			return b.price - a.price;
		}
		
		Object.defineProperty(category,'init',{
			value: function (name) {
				validateCategoryName(name);
				
				this.name = name;
				products = [];
				
				return this;
			}
		});
		
		Object.defineProperty(category,'addCosmetics',{
			value: function (product) {
				products.push(product);
				return this;
			}
		});
		
		Object.defineProperty(category,'removeCosmetics',{
			value: function (product) {
				
				var indexOfProduct = products.indexOf(product);
				
				if (indexOfProduct > -1) {
					product.splice(indexOfProduct,1);
				}
				else {
					throw new Error('Product does not exist');
				}
				
				return this;
			}
		});
		
		Object.defineProperty(category,'print',{
			value: function () {
				products.sort(sortFunc);
						
				var productsToBePrinted = products.map(function (product) {
					return product.print();
				});
				
				return productsToBePrinted.join('\n');
			}	
		});
		
		return category;
	}());
	
	var shoppingCart = (function () {
		var shoppingCart = {},
			products = [];
		
		
		Object.defineProperty(shoppingCart,'addProduct',{
			value: function (product) {
				products.push(product);
				return this;
			}
		});
		
		Object.defineProperty(shoppingCart,'removeProduct',{
			value: function (product) {
				var productIndex = products.indexOf(product);
				
				if (productIndex > -1) {
					products.splice(productIndex,1);
				}
			}
		});
		
		Object.defineProperty(shoppingCart,'totalPrice',{
			value: function () {
				return products.reduce(function (sum,product) {
					return sum + product.price;
				},0);
			}
		});
		
		Object.defineProperty(shoppingCart,'containsProduct',{
			value: function (product) {
				return products.some(function (productInCart) {
					return productInCart.name === product.name;
				});
			}
		});
		
		return shoppingCart;
	}());
	
	return {
		shoppingCart: shoppingCart,
		product: product,
		toothpaste: toothpaste,
		category: category,
		shampoo: shampoo
	};
}());