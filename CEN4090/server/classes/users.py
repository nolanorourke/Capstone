from ingredients import Ingredients
from recipe import Recipe


class User:

    # Initialize the User's Full Name and Email, w/ an Empty List of Ingredients
    def __init__(self, first_name, last_name, email):
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.ingredients = []

    # Return the User's Full Name
    def get_fullname(self):
        return self.first_name + ' ' + self.last_name

    # Return the User's Email
    def get_email(self):
        return self.email

    # Print the User's List of Ingredients
    def print_inventory(self):
        if not self.ingredients:
            print("Inventory is Empty. Try Adding Ingredients to Your Pantry!")
        else:
            for item in self.ingredients:
                print(item.print_ingredient() + ": " + str(item.print_quantity()))

    # Add 1 Quantity of the Ingredient into the User's List of Ingredients
    def add_to_pantry(self, ingredient):
        found_item = False
        if not self.ingredients:
            self.ingredients.append(Ingredients(ingredient, 1))
            return True
        for item in self.ingredients:
            if item.name == ingredient:
                item.add_to_quantity(1)
                found_item = True
        if found_item is False:
            self.ingredients.append(Ingredients(ingredient, 1))

    # Remove 1 Quantity of the Ingredient from the User's List of Ingredients
    def remove_from_pantry(self, ingredient):
        found_item = False
        if not self.ingredients:
            return False
        for item in self.ingredients:
            if item.name == ingredient:
                if item.reduce_quantity(1) == 0:
                    del self.ingredients[self.ingredients.index(item)]
                found_item = True
        if found_item is True:
            print("1 " + ingredient + " Removed")
        return True

    def clear_pantry(self):
        self.ingredients.clear()
        return True


class Chef(User):

    # Initialize the Chef w/ the User's Constructor, Also Initialize a Recipe List from the Chef
    def __init__(self, first_name, last_name, email):
        super().__init__(first_name, last_name, email)
        self.recipe_list = []

    def add_recipe(self, recipe_name, ingredient_list):
        found_item = False
        if not self.recipe_list:
            self.recipe_list.append(Recipe(recipe_name, ingredient_list))
            return True
        for item in self.recipe_list:
            if item.name == recipe_name:
                found_item = True
        if found_item is False:
            self.recipe_list.append(Recipe(recipe_name, ingredient_list))
        return True

    def print_recipe(self, recipe_name):
        found_item = False
        for item in self.recipe_list:
            if item.name == recipe_name:
                print("Ingredients for " + item.name + ":")
                item.print_recipe()
                found_item = True
        if found_item is False:
            print("Recipe Not Found")
            return False
        return True

    # Return the Chef's Full Name
    def get_fullname(self):
        return super(Chef, self).get_fullname()

    # Return the Chef's Email
    def get_email(self):
        return super(Chef, self).get_email()

    # Print the User's List of Ingredients
    def print_inventory(self):
        return super(Chef, self).print_inventory()

    # Add 1 Quantity of the Ingredient into the User's List of Ingredients
    def add_to_pantry(self, ingredient):
        return super(Chef, self).add_to_pantry(ingredient)

    # Remove 1 Quantity of the Ingredient from the User's List of Ingredients
    def remove_from_pantry(self, ingredient):
        return super(Chef, self).remove_from_pantry(ingredient)

    def clear_pantry(self):
        return super(Chef, self).clear_pantry()


class Admin(Chef):

    def __init__(self, first_name, last_name, email):
        super().__init__(first_name, last_name, email)

# Return the Chef's Full Name
    def get_fullname(self):
        return super(Admin, self).get_fullname()

    # Return the Chef's Email
    def get_email(self):
        return super(Admin, self).get_email()

    # Print the User's List of Ingredients
    def print_inventory(self):
        return super(Admin, self).print_inventory()

    # Add 1 Quantity of the Ingredient into the User's List of Ingredients
    def add_to_pantry(self, ingredient):
        return super(Admin, self).add_to_pantry(ingredient)

    # Remove 1 Quantity of the Ingredient from the User's List of Ingredients
    def remove_from_pantry(self, ingredient):
        return super(Admin, self).remove_from_pantry(ingredient)

    # Clear Everything From the Pantry
    def clear_pantry(self):
        return super(Admin, self).clear_pantry()

    # Add a Recipe to the Admin's Recipe List
    def add_recipe(self, recipe_name, ingredient_list):
        return super(Admin, self).add_recipe(recipe_name, ingredient_list)

    # Print the Contents of the Recipe
    def print_recipe(self, recipe_name):
        return super(Admin, self).print_recipe(recipe_name)
