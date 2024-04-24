from configparser import ConfigParser

def config(filename="database.ini", section ="postgresql"):
    #create the file parser
    parser = ConfigParser()

    #read the config file
    parser.read(filename)
    db={}
    #if parser has a section, edit it with this, otherwise we handle it 
    if parser.has_section(section):
        params = parser.items(section)
        #each element inside the initializtion file to a part int eh db dictionary
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} is not found in the {1} file'.format(section,filename))
    return db

if __name__ == "__main__":
    config()