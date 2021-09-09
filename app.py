from flask import Flask, Response, jsonify
import pandas as pd

app = Flask(__name__)

data_url = 'Filtered FIES2018.csv'


# DATA ENDPOINTS
@app.route('/data')
def get_data():
    df = pd.read_csv(data_url)

    data_json = df.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/data/<population>')
def get_population_data(population):
    df = pd.read_csv(data_url)
    df_group_count = df[df['Province Name']==population].count()

    filtered_df= df_group_count.to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

@app.route('/filters')
def get_filters():
    df = pd.read_csv(data_url)
    df_actual=df[['Meat', 'Fish and Seafood', 'Milk, Cheese and Eggs', 'Oils and Fats','Fruit','Vegetables','Sugar, Jam and Honey, Chocolate and Confectionery','Coffee, Tea and Cocoa','Mineral Water, Softdrinks, Fruit and Vegetable Juices','Clothing and Footwear','Health','Education'
    ,'Alcoholic Beverages','Tobacco','Transport','Communication','Recreation and Culture','Special Family Occasion'
    ,'Total Income','Total Food Expenditures','Total Non-Food Expenditure','Total Expenditure']]
    df_filter = list(df_actual.columns)

    filtered_df= pd.DataFrame(df_filter).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/region/<filters>')
def get_region_filter_data(filters):
    df = pd.read_csv(data_url)
    df_actual=df[['Region Name',filters]]
    
    df_actual.columns = ['region', 'filter']

    df_true = df_actual.groupby('region').mean().reset_index()

    filtered_df= pd.DataFrame(df_true).to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

@app.route('/province/<filters>')
def get_province_filter_data(filters):
    df = pd.read_csv(data_url)
    df_actual=df[['Province Name',filters]]
    
    df_actual.columns = ['province', 'filter']

    df_true = df_actual.groupby('province').mean().reset_index()

    filtered_df= pd.DataFrame(df_true).to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

# STATIC PAGES
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
