from flask import Flask, render_template
import geopandas as gpd
import pandas as pd
from shapely.geometry import Polygon
import folium
import csv

app=Flask(__name__)
application = app

@app.route("/vrss2")
def vrss2():   
    return render_template("vrss2.html")

@app.route("/folium_map")
def folium_map(): 
    m = folium.Map(location = [7, -66], zoom_start = 6,scrollWheelZoom=False, dragging=True)
    vzla = gpd.read_file("static/data/venezuela.zip")
    vzla.set_geometry('geometry')
    vzla.crs = "EPSG:4326"    
    folium.GeoJson(data=vzla["geometry"]).add_to(m) 

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
    labelsg = ["one", "two", "tree", "four"]
    datag = (1,2,3,4)
    return render_template("graphs.html", dataset=datag, datasetLabels=labelsg) 


@app.route("/")
def index():   
    options = ["one", "two", "tree", "four"]
    return render_template("dashboard.html", options=options)
    
if __name__ == "__main__":
    app.run()