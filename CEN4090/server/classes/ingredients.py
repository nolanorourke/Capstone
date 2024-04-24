class Ingredients:

    def __init__(self, name, amount):
        self.name = name
        self.quantity = amount

    def add_to_quantity(self, amount):
        self.quantity += amount
        return self.quantity

    def reduce_quantity(self, amount):
        self.quantity -= amount
        return self.quantity

    def print_ingredient(self):
        return self.name

    def print_quantity(self):
        return self.quantity
      
