from flask import Flask, Response
import pandas as pd

app = Flask(__name__)

data_url = 'Filtered FIES2018.csv'

# DATA ENDPOINTS
@app.route('/data')
def get_data():
    df = pd.read_csv(data_url)

    data_json = df.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/descriptions/<filter>')
def get_desc(filter):
    df = pd.read_csv("Filter Descriptions.csv")

    gk = df.groupby('filter')

    gg = gk.get_group(filter)

    data_json = gg.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/wage/<region>')
def get_wage(region):
    df = pd.read_csv("Minimum Wage.csv")

    gk = df.groupby('region')

    gg = gk.get_group(region)

    data_json = gg.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/prov/<population>')
def get_prov_population_data(population):
    df = pd.read_csv(data_url)

    df_actual=df[['Province Name',population]]
    
    df_actual.columns = ['province', 'filter']

    df_true = df_actual.groupby('province').mean().reset_index()

    df_group_count = df[['Province Name']]
    df_group_count = df_group_count.groupby('Province Name').size().reset_index()

    df_group_count.columns = ['province', 'count']

    test = pd.merge(df_true,df_group_count)

    filtered_df= test.to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

@app.route('/reg/<population>')
def get_region_population_data(population):
    df = pd.read_csv(data_url)

    df_actual=df[['Region Name',population]]
    
    df_actual.columns = ['region', 'filter']

    df_true = df_actual.groupby('region').mean().reset_index()

    df_group_count = df[['Region Name']]
    df_group_count = df_group_count.groupby('Region Name').size().reset_index()

    df_group_count.columns = ['region', 'count']

    test = pd.merge(df_true,df_group_count)

    filtered_df= test.to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

@app.route('/filters')
def get_filters():
    df = pd.read_csv(data_url)
    df_actual=df[['Total Expenditure','Total Income','Total Food Expenditures','Total Non-Food Expenditure','Health'
    ,'Education','Clothing and Footwear','Transport','Communication','Mineral Water, Softdrinks, Fruit and Vegetable Juices', 'Meat', 'Fish and Seafood'
    , 'Milk, Cheese and Eggs', 'Oils and Fats','Fruit','Vegetables','Sugar, Jam and Honey, Chocolate and Confectionery','Coffee, Tea and Cocoa'
    ,'Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion', 'Income Difference']]
    df_filter = list(df_actual.columns)
    df_filter.append("Essential/Non Essential")

    filtered_df= pd.DataFrame(df_filter).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/histogram/nonessentials')
def get_histogram_nonessentials():
    df = pd.read_csv(data_url)

    group=[]
    nonessential = pd.DataFrame(group)

    nonessential['filter'] = df['Sugar, Jam and Honey, Chocolate and Confectionery']+df['Alcoholic Beverages']+df['Tobacco']+df['Recreation and Culture']+df['Special Family Occasion']

    filtered_df= pd.DataFrame(nonessential).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/histogram/essentials')
def get_histogram_essentials():
    df = pd.read_csv(data_url)

    group=[]
    essential = pd.DataFrame(group)

    essential['filter'] = df['Health']+df['Alcoholic Beverages']+df['Education']+df['Clothing and Footwear']+df['Transport']+df['Communication']+df['Mineral Water, Softdrinks, Fruit and Vegetable Juices']+df['Meat']+df['Fish and Seafood']+df['Milk, Cheese and Eggs']+df['Oils and Fats']+df['Fruit']+df['Vegetables']+df['Coffee, Tea and Cocoa']

    filtered_df= pd.DataFrame(essential).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/region/nonessentials')
def get_region_nonessentials():
    df = pd.read_csv(data_url)
    df_nonessential=df[['Region Name','Province Name','Sugar, Jam and Honey, Chocolate and Confectionery','Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion']]
    df_essential = df[['Region Name','Province Name','Total Expenditure','Total Income','Total Food Expenditures','Total Non-Food Expenditure','Health'
    ,'Education','Clothing and Footwear','Transport','Communication','Mineral Water, Softdrinks, Fruit and Vegetable Juices', 'Meat', 'Fish and Seafood'
    , 'Milk, Cheese and Eggs', 'Oils and Fats','Fruit','Vegetables','Coffee, Tea and Cocoa']]

    df_test = df_nonessential.groupby('Region Name')['Sugar, Jam and Honey, Chocolate and Confectionery','Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion'].mean()

    ss = pd.DataFrame(df_test)
    sss = ss[['Sugar, Jam and Honey, Chocolate and Confectionery','Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion']].mean(axis=1).reset_index()
    sss.columns = ['region', 'filter']

    filtered_df= pd.DataFrame(sss).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/region/essentials')
def get_region_essentials():
    df = pd.read_csv(data_url)
    df_essential = df[['Region Name','Province Name','Total Expenditure','Total Income','Total Food Expenditures','Total Non-Food Expenditure','Health'
    ,'Education','Clothing and Footwear','Transport','Communication','Mineral Water, Softdrinks, Fruit and Vegetable Juices', 'Meat', 'Fish and Seafood'
    , 'Milk, Cheese and Eggs', 'Oils and Fats','Fruit','Vegetables','Coffee, Tea and Cocoa']]
    df_essential["Food & Water"]=df_essential['Mineral Water, Softdrinks, Fruit and Vegetable Juices']+df_essential['Meat']+df_essential['Coffee, Tea and Cocoa']+df_essential['Fish and Seafood']+df_essential['Milk, Cheese and Eggs']+df_essential['Oils and Fats']+df_essential['Fruit']+df_essential['Vegetables']

    df_test = df_essential.groupby('Region Name')['Health','Education','Clothing and Footwear','Transport','Communication','Food & Water'].mean()

    ss = pd.DataFrame(df_test)
    sss = ss[['Health','Education','Clothing and Footwear','Transport','Communication','Food & Water']].mean(axis=1).reset_index()
    sss.columns = ['region', 'filter']

    filtered_df= pd.DataFrame(sss).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")
    
@app.route('/province/nonessentials')
def get_province_nonessentials():
    df = pd.read_csv(data_url)
    df_nonessential=df[['Region Name','Province Name','Sugar, Jam and Honey, Chocolate and Confectionery','Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion']]

    df_test = df_nonessential.groupby('Province Name')['Sugar, Jam and Honey, Chocolate and Confectionery','Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion'].mean()

    ss = pd.DataFrame(df_test)
    sss = ss[['Sugar, Jam and Honey, Chocolate and Confectionery','Alcoholic Beverages','Tobacco','Recreation and Culture','Special Family Occasion']].mean(axis=1).reset_index()
    sss.columns = ['province', 'filter']

    filtered_df= pd.DataFrame(sss).to_json(orient="records")

    return Response(filtered_df, mimetype="application/json")

@app.route('/province/essentials')
def get_province_essentials():
    df = pd.read_csv(data_url)
    df_essential = df[['Region Name','Province Name','Total Expenditure','Total Income','Total Food Expenditures','Total Non-Food Expenditure','Health'
    ,'Education','Clothing and Footwear','Transport','Communication','Mineral Water, Softdrinks, Fruit and Vegetable Juices', 'Meat', 'Fish and Seafood'
    , 'Milk, Cheese and Eggs', 'Oils and Fats','Fruit','Vegetables','Coffee, Tea and Cocoa']]
    df_essential["Food & Water"]=df_essential['Mineral Water, Softdrinks, Fruit and Vegetable Juices']+df_essential['Meat']+df_essential['Coffee, Tea and Cocoa']+df_essential['Fish and Seafood']+df_essential['Milk, Cheese and Eggs']+df_essential['Oils and Fats']+df_essential['Fruit']+df_essential['Vegetables']

    df_test = df_essential.groupby('Province Name')['Health','Education','Clothing and Footwear','Transport','Communication','Food & Water'].mean()

    ss = pd.DataFrame(df_test)
    sss = ss[['Health','Education','Clothing and Footwear','Transport','Communication','Food & Water']].mean(axis=1).reset_index()
    sss.columns = ['province', 'filter']

    filtered_df= pd.DataFrame(sss).to_json(orient="records")

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

@app.route('/histo/<filters>')
def get_histogram_data(filters):
    df = pd.read_csv(data_url)
    df_actual=df[filters]

    df_actual=pd.DataFrame(df_actual)

    df_actual=df_actual.rename(columns = {filters:'filter'})

    filtered_df= pd.DataFrame(df_actual).to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

# STATIC PAGES
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
