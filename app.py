from flask import Flask, Response, jsonify
import pandas as pd

app = Flask(__name__)

data_url = 'Filtered FIES2018.csv'

# DATA ENDPOINTS
@app.route('/data')
def get_data():
    df = pd.read_csv(data_url)
    # df.columns = ['country', 'category', 'consumption', 'co2']

    data_json = df.to_json(orient="records")
    return Response(data_json, mimetype="application/json")

@app.route('/data/<population>')
def get_population_data(population):
    ## TODO: Get the data filtered by the provided country in the argument
    df = pd.read_csv(data_url)
    df_group_count = df[df['Province Name']==population].count()

    #print(df_group_count)

    filtered_df= df_group_count.to_json(orient="records")
    
    return Response(filtered_df, mimetype="application/json")

# STATIC PAGES
@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(debug=True)
