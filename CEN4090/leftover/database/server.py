from flask import Flask, request, redirect, session,jsonify
from flask_cors import CORS
import psycopg2
from config import config
from flask_jwt_extended import JWTManager
import hashlib
import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])
app.secret_key = 'This_is_cool!' # Change this to a real secret key

def get_db_connection():
    params = config()
    return psycopg2.connect(**params)

def get_user_info(username):
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT usename, rolname from pg_user \
                INNER JOIN pg_auth_members ON pg_user.usesysid = pg_auth_members.member \
                INNER JOIN pg_roles ON pg_roles.oid = pg_auth_members.roleid \
                WHERE pg_user.usename = '" + str(username) + "'")
        user = cur.fetchone()
        if user:
            user_info = {
                'username': user[0],
                'role': user[1]
            }
            return user_info
        elif username == 'postgres':
            user_info = {
                'username': 'postgres',
                'role': 'admin'
            }
            return user_info
        else:
            return None  # User not found
    except Exception as e:
        print(f"Error fetching user info: {e}")
        return None
    finally:
        cur.close()
        conn.close()

@app.route('/check_session', methods=['GET'])
def check_session():
    if 'username' in session:
        # Fetch the user-specific information.
        user_info = get_user_info(session['username']) 
        return jsonify(user_info)     
    else:
        return jsonify({'message': 'No active session'})
    
@app.route('/logout', methods=['POST'])
def logout_user():
    session.pop('username', None)
    return jsonify({'message': 'User logged out'})

@app.route('/foods', methods=['GET'])
def get_foods():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM Foods ORDER BY food_name")
    foods = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{'food_name': food[0], 'food_type': food[1]} for food in foods])

@app.route('/addingredient', methods=['POST'])
def add_food():
    print("Attempting to Add Ingredient")
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    data['food_name'] = data['food_name'].title()
    data['category'] = data['category'].title()
    print(data)
    try:
        print("Checking if Ingredient in DB")
        cur.execute("SELECT food_name FROM Foods WHERE food_name = '" + str(data['food_name']) + "'")
        food = cur.fetchone()
        print("Extracted Ingredient Name")
        if food is None:
            print("Adding Ingredient to DB")
            cur.execute("INSERT INTO Foods(food_name, food_type) VALUES(%s, %s)", (str(data['food_name']), str(data['category'])))
            conn.commit()
            print("Ingredient Added Successfully")
            return jsonify({'message': 'Ingredient Added Successfully'}), 200
        elif food[0] == str(data['food_name']):
            print("Ingredient Already Exists")
            return jsonify({'message': 'Ingredient Already Exists'}), 404
    except Exception as e:
        print(f"Error Adding Ingredient: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/deleteingredient', methods=['POST'])
def remove_food():
    print("Attempting to Delete Ingredient")
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    try:
        cur.execute("SELECT food_name FROM Foods WHERE food_name = '" + str(data['food_name']) + "'")
        food = cur.fetchone()
        if food[0] != str(data['food_name']):
            print("Ingredient Doesn't Exist")
            return jsonify({'message': 'Ingredient Does Not Exist'}), 404
        cur.execute("DELETE FROM Foods WHERE food_name = '" + str(data['food_name']) + "'")
        conn.commit()
        print("Ingredient Removed Successfully")
        return jsonify({'message': 'Ingredient Removed'})
    except Exception as e:
        print(f"Error Removing Ingredient: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

#defines what happens when we make this call
@app.route('/getReports', methods=['GET'])
def get_reports():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    username = session['username']
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Query the database to retrieve report submitted
        cur.execute("SELECT report_id, title, FROM Reports")
        reports = cur.fetchall()

        # Construct the response JSON
        submitted_reports = [{'report_id': report[0], 'title': report[1]} for report in submitted_reports]

        return jsonify(submitted_reports), 200
    except Exception as e:
        print(f"Error fetching submitted reports: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/pantry/items', methods=['GET'])
def get_pantry_items():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    username = session['username']
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT pf.food_name \
            FROM Pantry_Food pf \
            JOIN Pantry p ON pf.pantry_id = p.pantry_id \
            WHERE p.ownername = %s \
        ", (username,))
        items = [{'food_name': item[0]} for item in cur.fetchall()]
        return jsonify(items)
    except Exception as e:
        print(f"Error fetching pantry items: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/getcustomers', methods=['GET'])
def get_customers():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT usename, rolname \
                FROM pg_user \
                INNER JOIN pg_auth_members ON pg_user.usesysid = pg_auth_members.member \
                INNER JOIN pg_roles ON pg_roles.oid = pg_auth_members.roleid \
                WHERE pg_roles.rolname = 'customer'")
    customers = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{'user_name': customer[0], 'role': customer[1]} for customer in customers])

@app.route('/deleteuser', methods=['POST'])
def delete_user():
    conn  = get_db_connection()
    cur = conn.cursor()
    data = request.json
    print(data)
    try:
        cur.execute("SELECT username FROM Users WHERE username = '" + str(data['user_name']) + "'")
        user = cur.fetchone()
        print("user = ", user)
        cur.execute("SELECT pantry_id FROM Pantry WHERE ownername = '" + str(user[0]) + "'")
        pantryID = cur.fetchone()
        print("pantryID = ", pantryID)
        cur.execute("SELECT pantry_food_id FROM Pantry_Food WHERE pantry_id = " + str(pantryID[0]))
        foods = cur.fetchall()
        if foods is not None:
            for food in foods:
                cur.execute("DELETE FROM Pantry_Ingredients WHERE pantry_food_id = " + str(food[0]))
                conn.commit()
                cur.execute("DELETE FROM Pantry_Food WHERE pantry_id = " + str(pantryID[0]))
                conn.commit()
        print("Deleted Pantry Items")
        cur.execute("DELETE FROM Pantry WHERE ownername = '" + str(user[0]) + "'")
        conn.commit()
        print("Deleted User's Pantry")
        cur.execute("DELETE FROM Users WHERE username = '" + str(data['user_name']) + "'")
        conn.commit()
        print("Removed User From Users Table")
        cur.execute("DROP USER " + str(data['user_name']))
        conn.commit()
        print("Removed User from DB")
        return jsonify({'message': 'User Successully Removed'}), 200
    except Exception as e:
        print(f"Error Removing User: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()


@app.route('/getchefs', methods=['GET'])
def get_chefs():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT usename, rolname \
                FROM pg_user \
                INNER JOIN pg_auth_members ON pg_user.usesysid = pg_auth_members.member \
                INNER JOIN pg_roles ON pg_roles.oid = pg_auth_members.roleid \
                WHERE pg_roles.rolname = 'chef'")
    chefs = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{'user_name': chef[0], 'role': chef[1]} for chef in chefs])

@app.route('/deletechefrole', methods=['POST'])
def revoke_chef_role():
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    print(data)
    try:
        cur.execute("SELECT * FROM Recipes WHERE author = '" + str(data['chef_name']) + "'")
        recipes = cur.fetchall()
        print(recipes)
        for recipe in recipes:
            cur.execute("DELETE FROM Recipe_Foods WHERE recipe_id = " + str(recipe[0]))
            conn.commit()
            cur.execute("DELETE FROM Recipe_Ingredients WHERE recipe_id = " + str(recipe[0]))
            conn.commit()
            cur.execute("DELETE FROM Steps WHERE recipe_id = " + str(recipe[0]))
            conn.commit()
            print("Delete Data Pertaining Recipes")
        cur.execute("DELETE FROM Recipes WHERE author = '" + str(data['chef_name']) + "'")
        conn.commit()
        print("Removed Recipes Made by the Chef")
        cur.execute("REVOKE chef FROM " + str(data['chef_name']))
        conn.commit()
        print("Revoked Chef Role From User")
        cur.execute("GRANT customer TO " + str(data['chef_name']))
        conn.commit()
        print("Made Chef into a Normal User")
        return jsonify({'message': 'Revoke Chef Role From User'}), 200
    except Exception as e:
        print(f"Error Revoking Chef Role From User: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/recipes', methods=['GET'])
def get_recipes():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT recipe_name, author FROM Recipes")
    recipes = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{'recipe_name': recipe[0], 'author': recipe[1]} for recipe in recipes])

@app.route('/deletechefrecipe', methods=['POST'])
def delete_recipe():
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    print(data)
    try:

        cur.execute("SELECT * FROM Recipes WHERE recipe_name = '" + str(data['recipe_name']) + "'")
        recipe = cur.fetchone()
        print(recipe)
        cur.execute("DELETE FROM Recipe_Foods WHERE recipe_id = " + str(recipe[0]))
        conn.commit()
        cur.execute("DELETE FROM Recipe_Ingredients WHERE recipe_id = " + str(recipe[0]))
        conn.commit()
        cur.execute("DELETE FROM Steps WHERE recipe_id = " + str(recipe[0]))
        conn.commit()
        print("Deleted Data Pertaining Recipes")
        cur.execute("DELETE FROM Recipes WHERE recipe_name = '" + str(data['recipe_name']) + "'")
        conn.commit()
        print("Deleted Recipe")
        return jsonify({'message': 'Recipe Successfully Removed'}), 200
    except Exception as e:
        print(f"Error Removing Recipe: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()


@app.route('/deleterecipe', methods=['POST'])
def deleterecipe():
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    print(data)
    try:

        cur.execute("SELECT * FROM Recipes WHERE recipe_id = '" + str(data['recipe_id']) + "'")
        recipe = cur.fetchone()
        print(recipe)
        cur.execute("DELETE FROM Recipe_Foods WHERE recipe_id = " + str(recipe[0]))
        conn.commit()
        cur.execute("DELETE FROM Recipe_Ingredients WHERE recipe_id = " + str(recipe[0]))
        conn.commit()
        cur.execute("DELETE FROM Steps WHERE recipe_id = " + str(recipe[0]))
        conn.commit()
        print("Deleted Data Pertaining Recipes")
        cur.execute("DELETE FROM Recipes WHERE recipe_id = '" + str(data['recipe_id']) + "'")
        conn.commit()
        print("Deleted Recipe")
        return jsonify({'message': 'Recipe Successfully Removed'}), 200
    except Exception as e:
        print(f"Error Removing Recipe: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()



@app.route('/addrecipe', methods=['POST'])
def add_recipe():
    conn = get_db_connection()
    cur = conn.cursor()
    data = request.json
    try:
        current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        # Insert the recipe into the Recipes table
        cur.execute("INSERT INTO Recipes (recipe_name, time_added, author) VALUES (%s, %s, %s)",
                    (data['recipe_name'], current_time, session['username']))
        # Get the recipe_id of the inserted recipe

        cur.execute("SELECT lastval()")
        recipe_id = cur.fetchone()[0]

        # Insert ingredients into Recipe_Ingredients table
        for ingredient in data['ingredients']:
            cur.execute("INSERT INTO Recipe_Ingredients (recipe_id, ing_name, quantity, measurement) VALUES (%s, %s, %s, %s)",
                        (recipe_id, ingredient['ing_name'], ingredient['quantity'], ingredient['measurement']))

        for ingredient in data['ingredients']:
            cur.execute("INSERT INTO Recipe_Foods (recipe_id, food_name) VALUES (%s, %s)",
                        (recipe_id, ingredient['ing_name']))

        # Insert steps into Steps table
        for index, step in enumerate(data['steps'], 1):
            cur.execute("INSERT INTO Steps (recipe_id, step_number, step_description) VALUES (%s, %s, %s)",
                        (recipe_id, index, step['step_description']))

        conn.commit()
        return jsonify({'message': 'Recipe added successfully', 'recipe_id': recipe_id}), 200
    except Exception as e:
        print(f"Error adding recipe: {e}")
        conn.rollback()
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/getchefrecipes', methods=['GET'])
def get_chef_recipes():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    username = session['username']
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Query the database to retrieve recipes created by the chef
        cur.execute("SELECT recipe_id, recipe_name FROM Recipes WHERE author = %s", (username,))
        recipes = cur.fetchall()

        # Construct the response JSON
        chef_recipes = [{'recipe_id': recipe[0], 'recipe_name': recipe[1]} for recipe in recipes]

        return jsonify(chef_recipes), 200
    except Exception as e:
        print(f"Error fetching chef recipes: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/pantry/add', methods=['POST'])
def add_to_pantry():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    username = session['username']
    data = request.json
    food_name = data['food_name']

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute("SELECT food_name FROM Foods WHERE food_name = %s", (food_name,))
        if not cur.fetchone():
            return jsonify({'error': 'Food not found'}), 404

        cur.execute("SELECT pantry_id FROM Pantry WHERE ownername = %s", (username,))
        result = cur.fetchone()
        if not result:
            return jsonify({'error': 'Pantry not found'}), 404

        pantry_id = result[0]

        
        cur.execute("INSERT INTO Pantry_Food (pantry_id, food_name) VALUES (%s, %s) ON CONFLICT DO NOTHING", (pantry_id, food_name))
        conn.commit()
        return jsonify({'message': f'{food_name} added to pantry'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/pantry/remove', methods=['POST'])
def remove_from_pantry():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    username = session['username']
    data = request.json
    food_name = data['food_name']

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Get the pantry_id for the current user
        cur.execute("SELECT pantry_id FROM Pantry WHERE ownername = %s", (username,))
        result = cur.fetchone()
        if not result:
            return jsonify({'error': 'Pantry not found'}), 404
        pantry_id = result[0]

        # Check if the food item is in the user's pantry
        cur.execute("SELECT pantry_food_id FROM Pantry_Food WHERE pantry_id = %s AND food_name = %s", (pantry_id, food_name))
        if not cur.fetchone():
            return jsonify({'error': 'Food not found in pantry'}), 404

        # Remove the food item from the user's pantry
        cur.execute("DELETE FROM Pantry_Food WHERE pantry_id = %s AND food_name = %s", (pantry_id, food_name))
        conn.commit()
        return jsonify({'message': f'{food_name} removed from pantry'}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/recipes/available', methods=['GET'])
def get_available_recipes():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    username = session['username']
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute("SELECT r.recipe_id, r.recipe_name \
        FROM Recipes r \
        WHERE NOT EXISTS ( \
            SELECT 1 \
            FROM Recipe_Ingredients ri \
            WHERE ri.recipe_id = r.recipe_id \
            AND NOT EXISTS ( \
                SELECT 1 \
                FROM Pantry_Food pf \
                INNER JOIN Pantry p ON pf.pantry_id = p.pantry_id \
                WHERE p.ownername = %s AND pf.food_name = ri.ing_name \
            ) \
        ) \
        ", (username,))
        
        recipes = [{'recipe_id': row[0], 'recipe_name': row[1]} for row in cur.fetchall()]
        return jsonify(recipes)
    except Exception as e:
        print(f"Error fetching available recipes: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/select_recipe/<int:recipe_id>', methods=['POST'])
def select_recipe(recipe_id):
    print("Selecting recipe ID:", recipe_id)  # Debug print
    if 'username' in session:
        session['selected_recipe_id'] = recipe_id
        print("Recipe selected successfully, ID stored in session:", session['selected_recipe_id'])  # Confirm success
        return jsonify({'success': True}), 200
    else:
        print("Failed to select recipe, no username in session")  # Identify failure
        return jsonify({'error': 'Unauthorized'}), 401
    
@app.route('/recipe', methods=['GET'])
def get_recipe_details():
    if 'username' not in session or 'selected_recipe_id' not in session:
        return jsonify({'error': 'No recipe selected or unauthorized'}), 401

    recipe_id = session['selected_recipe_id']
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # Fetch recipe details along with the author's name
        cur.execute("SELECT r.recipe_name, u.first_name, u.last_name, r.time_added \
        FROM Recipes r \
        JOIN Users u ON r.author = u.username \
        WHERE r.recipe_id = %s \
        ", (recipe_id,))
        recipe = cur.fetchone()

        # Fetch ingredients for the selected recipe
        cur.execute("SELECT ing_name, quantity, measurement \
        FROM Recipe_Ingredients \
        WHERE recipe_id = %s \
        ", (recipe_id,))
        ingredients = cur.fetchall()

        # Fetch steps for the selected recipe
        cur.execute("SELECT step_number, step_description \
        FROM Steps \
        WHERE recipe_id = %s \
        ORDER BY step_number \
        ", (recipe_id,))
        steps = cur.fetchall()

        recipe_details = {
            'recipe_name': recipe[0],
            'author': f"{recipe[1]} {recipe[2]}",
            'time_added': recipe[3],
            'ingredients': [{'food_name': ing[0], 'quantity': ing[1], 'measurement': ing[2]} for ing in ingredients],
            'steps': [{'step_number': step[0], 'description': step[1]} for step in steps]
        }

        return jsonify(recipe_details)

    except Exception as e:
        print(f"Error fetching recipe details: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500

    finally:
        cur.close()
        conn.close()

# This is our pages for which we need the users to stay on
@app.route('/login', methods=['POST'])
def login_user():
    print("On Login Page")
    conn = get_db_connection()
    cur = conn.cursor()
    # Extract form data from the request
    data = request.json
    try:
        # Check if the username exists
        cur.execute("SELECT rolname, rolpassword FROM pg_authid WHERE rolname = '" + str(data['username']) + "'")
        existing_user = cur.fetchone()
        print(data)
        if existing_user:
            print("User Exists, Check Password")
            # Encrypt the Password, Concatenated w/ 'md5'
            hashed_pw = str(data['password']) + str(data['username'])
            hashed_pw = hashlib.md5(hashed_pw.encode())
            hashed_pw = hashed_pw.hexdigest()
            hashed_pw = 'md5' + hashed_pw
            # Check if the password is correct
            if existing_user[1] == hashed_pw:
                session['username'] = data['username']
                return {'message': 'Login successful', 'username': data['username']}, 200
            else:
                return {'message': 'Incorrect password'}, 401  # Unauthorized
        else:
            return {'message': 'User not found'}, 404  # Not Found
    except Exception as e:
        return {'message': 'Internal Server Error', 'error': str(e)}, 500  # Internal Server Error
    finally:
        cur.close()
        conn.close()

@app.route('/register', methods=['POST'])
def register_user():
    print("On Register Page")
    conn = get_db_connection()
    cur = conn.cursor()
    # Extract form data from the request
    data = request.json
    try:
        print("Trying SELECT Query to Find Identical User")
        cur.execute(
            "SELECT usename FROM pg_user WHERE usename = '" + str(data['username']) + "'")
        existing_user = cur.fetchone()
        print("Fetched User")
        if existing_user:
            print("Username Taken")
            return jsonify({'message': 'username already taken'}), 403
        else:
            print("Username Not Taken")
            cur.execute("CREATE USER \"" + str(data['username']) + "\" WITH PASSWORD '" + str(data['password']) + "'")
            conn.commit()
            print("Executed CREATE USER Query")
            if data['isChef'] is True:
                cur.execute("GRANT chef TO \"" + str(data['username']) + "\"")
            else:
                cur.execute("GRANT customer TO \"" + str(data['username']) + "\"")
            conn.commit()
            print("Executed GRANT Permissions Query")
            cur.execute("INSERT INTO Users(username, email_address, first_name, last_name) \
                        VALUES ('" + str(data['username']) + "', '" + str(data['email']) + "', '" \
                        + str(data['firstName']) + "', '" + str(data['lastName']) + "')")
            conn.commit()
            print("Executed INSERT Query")
            cur.execute("INSERT INTO Pantry(ownername) VALUES (%s)", (data['username'],))
            conn.commit()
            print("Pantry created for user")
            session['username'] = data['username']
            print("Created User")
            return jsonify({'message': 'User created successfully', 'username': data['username']}), 201
    except Exception as e:
        conn.rollback()
        return {'Error': str(e)}, 500
    finally:
        cur.close()
        conn.close()

@app.route('/user', methods=['GET'])
def welcome_user():  # Removed the username parameter
    # First, check if the user is logged in by looking in the session.
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401

    username = session['username']  # Correctly fetch the username from the session

    # Fetch the user-specific information.
    user_info = get_user_info(username)
    
    if user_info:
        return jsonify(user_info)
    else:
        return jsonify({'error': 'User not found'}), 404
    
if __name__ == '__main__':
    app.run(debug=True, port=8080)
