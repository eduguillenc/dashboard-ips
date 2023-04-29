from flask import Flask, render_template
import geopandas as gpd
import pandas as pd
from shapely.geometry import Polygon
import folium
import csv

app=Flask(__name__)

@app.route("/vrss2")
def vrss2():   
    #carga con geopandas el shapefile de estados de venezuela
    m = folium.Map(location = [7, -66], zoom_start = 8,scrollWheelZoom=False, dragging=True)
    vzla = gpd.read_file("static/data/exterior.zip")
    vzla.set_geometry('geometry')
    vzla.crs = "EPSG:4326"
    orbitas = pd.read_csv("static/data/orbitas.csv")
    orbitas['centroide'] = gpd.points_from_xy(orbitas.long_central, orbitas.lat_central)
    orbitas['ul'] = gpd.points_from_xy(orbitas.data_ul_long, orbitas.data_ul_lat)
    orbitas['ur'] = gpd.points_from_xy(orbitas.data_ur_long, orbitas.data_ur_lat)
    orbitas['lr'] = gpd.points_from_xy(orbitas.data_lr_long, orbitas.data_lr_lat)
    orbitas['ll'] = gpd.points_from_xy(orbitas.data_ll_long, orbitas.data_ll_lat)
    orbitas['footprint'] = 0
    orbitas = gpd.GeoDataFrame(orbitas, geometry='centroide')
    orbitas.crs = "EPSG:4326"
    #combinacion del punto central dentro del poligono
    gdf=gpd.sjoin(vzla, orbitas, how="right")
    ruta="static/data/vrss2/"
    lescenas =folium.FeatureGroup(name='Escenas', show=True)
    #cargar huellas 
    for i, g in gdf.iterrows():
        gdf.footprint[i] = Polygon([gdf.ul[i], gdf.ur[i],gdf.lr[i],gdf.ll[i]])
    #crear capas huellas en el mapa
    for i, g in gdf.iterrows():    
        datageo = gpd.GeoSeries(g["footprint"]).simplify(tolerance=0.001)        
        geo_json = folium.GeoJson(data=datageo.to_json(), style_function=lambda x: {"fillColor": "orange"})
        folium.Popup("sceneId:"+str(g["escena"])+"<br>"+"Archivo:<a href='"+ ruta+ str(g["nombre_comprimido"])+"' target='_blank'>Descarga</a>").add_to(geo_json)
        geo_json.add_to(lescenas)
    m.add_child(lescenas)
    folium.TileLayer('openstreetmap').add_to(m)
    folium.TileLayer('Stamen Terrain').add_to(m)
    folium.LayerControl().add_to(m)
    m.save("templates/vrss2.html")
    return render_template("vrss2.html")

@app.route("/folium_map")
def folium_map(): 
    m = folium.Map(location = [7, -66], zoom_start = 6,scrollWheelZoom=False, dragging=True)
    vzla = gpd.read_file("static/data/venezuela.zip")
    vzla.set_geometry('geometry')
    vzla.crs = "EPSG:4326"    
    folium.GeoJson(data=vzla["geometry"]).add_to(m) 
    #vzla.to_file('static/data/vzla.geojson', driver='GeoJSON')
    # url = ("https://raw.githubusercontent.com/python-visualization/folium/main/examples/data")
    # state_geo = f"{url}/us-states.json"
    # state_unemployment = f"{url}/US_Unemployment_Oct2012.csv"
    # state_data = pd.read_csv(state_unemployment)
    # m = folium.Map(location=[48, -102], zoom_start=3,scrollWheelZoom=False)
    # folium.Choropleth(
    # geo_data=state_geo,
    # name="choropleth",
    # data=state_data,
    # columns=["State", "Unemployment"],
    # key_on="feature.id",
    # fill_color="YlGn",
    # fill_opacity=0.7,
    # line_opacity=0.2,
    # legend_name="Unemployment Rate (%)").add_to(m)
    return render_template("folium_map.html", map = m._repr_html_())

@app.route("/mapping")
def mapping():   
    markers=[{"lat":7,"lon":-66,"popup":'This is the middle of the map.'}]
    return render_template("mapping.html",
                           markers = markers)

@app.route("/datatables")
def datatables():
    with open("static/data/orbitas.csv", newline="") as f:
        reader = csv.reader(f)
        data = list(reader)
    return render_template("datatables.html", headings=data[0], data=data[1:])

@app.route("/dashboard")
def dashboard():
    with open("static/data/orbitas.csv", newline="") as f:
        reader = csv.reader(f)
        data = list(reader)
    return render_template("datatables.html", headings=data[0], data=data[1:]) 

@app.route("/graphs")
def graphs():
    vzla = gpd.read_file("static/data/exterior.zip")
    vzla.set_geometry('geometry')
    vzla.crs = "EPSG:4326"
    orbitas = pd.read_csv("static/data/orbitas.csv")
    orbitas['centroide'] = gpd.points_from_xy(orbitas.long_central, orbitas.lat_central)
    orbitas['ul'] = gpd.points_from_xy(orbitas.data_ul_long, orbitas.data_ul_lat)
    orbitas['ur'] = gpd.points_from_xy(orbitas.data_ur_long, orbitas.data_ur_lat)
    orbitas['lr'] = gpd.points_from_xy(orbitas.data_lr_long, orbitas.data_lr_lat)
    orbitas['ll'] = gpd.points_from_xy(orbitas.data_ll_long, orbitas.data_ll_lat)
    orbitas['footprint'] = 0
    orbitas = gpd.GeoDataFrame(orbitas, geometry='centroide')
    orbitas.crs = "EPSG:4326"
    gdf=gpd.sjoin(vzla, orbitas, how="right")
    tables=[gdf.to_html(classes='data')]
    titles=gdf.columns.values
    gdf = gdf.rename(columns={"ano":"year", "mes":"month", "dia":"day"})
    gdf["date"] = pd.to_datetime(gdf[["year", "month", "day"]]).dt.date
    #datag= gdf['date'].tolist()
    #labelsg= gdf.columns.tolist() 
    total_escenas = gdf.shape[0]
    nubes_promedio = round(gdf["porcentaje_nubes"].mean(), 2)
    roll_promedio = round(gdf["angulo_roll"].mean(), 2) 
    datag = (total_escenas,nubes_promedio,roll_promedio) 
    labelsg = ("total_escenas","nubes_promedio","roll_promedio") 
    return render_template("graphs.html", dataset=datag, datasetLabels=labelsg) 


@app.route("/")
def index():   
    options = ["one", "two", "tree", "four"]
    return render_template("dashboard.html", options=options)
    
if __name__ == "__main__":
    app.run(debug=True)
    
    
