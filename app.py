from flask import Flask, Response, jsonify
import pandas as pd

app = Flask(__name__)

data_url = 'Filtered FIES2018.csv'

df = pd.read_csv(data_url)

# DATA ENDPOINTS
@app.route('/data')
def get_data():
    #df = pd.read_csv(data_url)

    data_json = df.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/data/<population>')
def get_population_data(population):
    #df = pd.read_csv(data_url)
    df_group_count = df[df['Province Name']==population].count()

    filtered_df= df_group_count.to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

@app.route('/filters')
def get_filters():
    #df = pd.read_csv(data_url)
    df_actual=df[['Meat', 'Fish and Seafood', 'Milk, Cheese and Eggs', 'Oils and Fats','Fruit','Vegetables','Sugar, Jam and Honey, Chocolate and Confectionery','Coffee, Tea and Cocoa','Mineral Water, Softdrinks, Fruit and Vegetable Juices','Clothing and Footwear','Health','Education'
    ,'Alcoholic Beverages','Tobacco','Transport','Communication','Recreation and Culture','Special Family Occasion'
    ,'Total Income','Total Food Expenditures','Total Non-Food Expenditure','Total Expenditure']]
    df_filter = list(df_actual.columns)

    filtered_df= pd.DataFrame(df_filter).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/filters/<filters>')
def get_filters_data(filters):
    #df = pd.read_csv(data_url)
    df_actual=df[['Region Name', 'Province Name',filters]]
    df_actual.columns = ['region', 'province', 'filter']

    # df_actual.loc[df_actual['region'] == 'Ilocos Region (Region I)'] = 'Region I'
    # df_actual.loc[df_actual['region'] == 'Cagayan Valley (Region II)'] = 'Region II'
    # df_actual.loc[df_actual['region'] == 'Central Luzon (Region III)'] = 'Region III'
    # df_actual.loc[df_actual['region'] == 'CALABARZON (Region IV-A)'] = 'Region IV-A'
    # df_actual.loc[df_actual['region'] == 'MIMAROPA (Region IV-B)'] = 'Region IV-B'
    # df_actual.loc[df_actual['region'] == 'Bicol Region (Region V)'] = 'Region V'
    # df_actual.loc[df_actual['region'] == 'Western Visayas (Region VI)'] = 'Region VI'
    # df_actual.loc[df_actual['region'] == 'Central Visayas (Region VII)'] = 'Region VII'
    # df_actual.loc[df_actual['region'] == 'Eastern Visayas (Region VIII)'] = 'Region VIII'
    # df_actual.loc[df_actual['region'] == 'Zamboanga Peninsula (Region IX)'] = 'Region IX'
    # df_actual.loc[df_actual['region'] == 'Northern Mindanao (Region X)'] = 'Region X'
    # df_actual.loc[df_actual['region'] == 'Davao Region (Region XI)'] = 'Region XI'
    # df_actual.loc[df_actual['region'] == 'SOCCSKSARGEN (Region XII)'] = 'Region XII'
    # df_actual.loc[df_actual['region'] == 'Caraga (Region XIII)'] = 'Region XIII'
    # df_actual.loc[df_actual['region'] == 'Cordillera Administrative Region (CAR)'] = 'CAR'
    # df_actual.loc[df_actual['region'] == 'Autonomous Region of Muslim Mindanao (ARMM)'] = 'ARMM'
    # df_actual.loc[df_actual['region'] == 'Metropolitan Manila'] = 'NCR'
    #df_filter = list(df_actual.columns)

    filtered_df= pd.DataFrame(df_actual).to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")


# STATIC PAGES
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
