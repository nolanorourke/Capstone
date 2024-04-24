from ingredients import Ingredients


class Recipe:
    def __init__(self, name, ingredient_list):
        self.name = name
        self.ingredient_list = ingredient_list

    def print_recipe(self):
        for item in self.ingredient_list:
            print(item.print_ingredient() + ": " + str(item.print_quantity()))
        return True
