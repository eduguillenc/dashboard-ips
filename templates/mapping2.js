var attrib = " MinPesca 2022",
    osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: attrib + "|<a href='http://www.openstreetmap.org/#map=2/23.9/-6.0&layers=C'>Mapa OpenStreet</a>"
    }),
    topo = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        attribution: attrib + "|<a href='http://thunderforest.com/'>Maps for Apps</a>"
    }),
    gray = L.tileLayer("http://basemaps.cartocdn.com/light_all/%7Bz%7D/%7Bx%7D/%7By%7D.png", {
        attribution: attrib + "|<a href='http://www.openstreetmap.org/#map=2/23.9/-6.0&layers=C'>Mapa OpenStreet</a>"
    }),
    terrain = new L.StamenTileLayer("terrain"),
    mapa = L.map("map", {
        crs: L.CRS.EPSG3857,
        center: [7.406, -65.984],
        maxZoom: 8,
        minZoom: 3,
        zoom: 6,
        attributionControl: !0,
        zoomControl: !1
    }),
    bounds = [
        [.644045387225, -73.3793879998],
        [12.1979113972, -58.145981]
    ],
    overlayerlim = new L.ImageOverlay("images/lim.png", bounds, {
        opacity: .6
    }).addTo(mapa);

function colorp(e) {
    return 100 < e ? "#67000d" : 70 < e ? "#a50f15" : 50 < e ? "#cb181d" : 30 < e ? "#ef3b2c" : 20 < e ? "#fb6a4a" : 5 < e ? "#fc9272" : "#ffffff"
}

function compesquerasInfo(e, r) {
    var t = "<table class='table table-striped table-bordered table-condensed'><tr><th>Estado</th><td>" + e.properties.ENTIDAD + "</td></tr><tr><th>Comunidades Pesqueras</th><td>" + e.properties.COM_PESQUE + "</td></tr><tr><video width='100%' height='100%' poster='images/loading.svg' type='video/mp4' src='videos/" + e.properties.ENTIDAD + ".mp4'autoplay loop></video></tr></table>",
        o = "Comunidades Pesqueras: ";
    e.properties && e.properties.COM_PESQUE ? o += t : o += 0, r.bindPopup(o), r.on({
        mouseover: highlightFeatureCP,
        mouseout: resetHighlightCP,
        click: zoomToFeature
    })
}
var compesquerasLayer = L.geoJson(compesqueras, {
    style: function(e) {
        return {
            weight: 2,
            opacity: .5,
            color: "black",
            dashArray: "2",
            fillOpacity: .9,
            fillColor: colorp(e.properties.COM_PESQUE)
        }
    },
    onEachFeature: compesquerasInfo
});

function colorz(e) {
    return 60 < e ? "#00bfff" : 45 < e ? "#61c9ff" : 30 < e ? "#8ad4ff" : 15 < e ? "#abdfff" : 10 < e ? "#c9e9ff" : 5 < e ? "#e5f4ff" : "#ffffff"
}

function zdescargasInfo(e, r) {
    var t = "<table class='table table-striped table-bordered table-condensed'><tr><th>Estado</th><td>" + e.properties.ENTIDAD + "</td></tr><tr><th>Zona de Descargas: </th><td>" + e.properties.Z_DESCARGA + "</td></tr><tr><video width='100%' height='100%' poster='images/loading.svg' type='video/mp4' src='videos/" + e.properties.ENTIDAD + ".mp4'autoplay loop></video></tr></table>",
        o = "Zonas de Descarga: ";
    e.properties && e.properties.Z_DESCARGA ? o += t : o += 0, r.bindPopup(o), r.on({
        mouseover: highlightFeatureZD,
        mouseout: resetHighlightZD,
        click: zoomToFeature
    })
}
var zdescargasLayer = L.geoJson(zdescargas, {
    style: function(e) {
        return {
            weight: 2,
            opacity: .5,
            color: "black",
            dashArray: "2",
            fillOpacity: .9,
            fillColor: colorz(e.properties.Z_DESCARGA)
        }
    },
    onEachFeature: zdescargasInfo
});
zdescargasLayer.addTo(mapa);
var baseLayers = {
        Mapamundi: terrain
    },
    overlays = {
        "<img src='images/ico.svg' width='30' height='30' /> Comunidades Pesqueras": compesquerasLayer,
        "<img src='images/cangrejo.png' width='30' height='30' /> Zonas de Descarga": zdescargasLayer
    };

function zoomToFeature(e) {
    mapa.fitBounds(e.target.getBounds())
}
L.control.layers(baseLayers, overlays, {
    collapsed: !1
}).addTo(mapa), terrain.addTo(mapa);
var info = L.control();

function highlightFeatureZD(e) {
    e = e.target;
    e.setStyle({
        weight: 5,
        color: "blue",
        dashArray: "",
        fillOpacity: .7
    }), L.Browser.ie || L.Browser.opera || L.Browser.edge || e.bringToFront(), info.updateZD(e.feature.properties)
}

function highlightFeatureCP(e) {
    e = e.target;
    e.setStyle({
        weight: 5,
        color: "red",
        dashArray: "",
        fillOpacity: .7
    }), L.Browser.ie || L.Browser.opera || L.Browser.edge || e.bringToFront(), info.updateCP(e.feature.properties)
}

function resetHighlightZD(e) {
    zdescargasLayer.resetStyle(e.target), info.updateZD()
}

function resetHighlightCP(e) {
    compesquerasLayer.resetStyle(e.target), info.updateCP()
}
info.onAdd = function(e) {
    return this._div = L.DomUtil.create("div", "info"), this.updateZD(), this.updateCP(), this._div
}, info.updateZD = function(e) {
    this._div.innerHTML = "<h4>Info Pesca</h4>" + (e ? "<b>" + e.ENTIDAD + "</b><br />" + e.Z_DESCARGA + " / ton" : "Pase por encima de un estado")
}, info.updateCP = function(e) {
    this._div.innerHTML = "<h4>Info Pesca</h4>" + (e ? "<b>" + e.ENTIDAD + "</b><br />" + e.COM_PESQUE + " / com" : "Pase por encima de un estado")
}, info.addTo(mapa);
var legendZD = L.control({
        position: "bottomright"
    }),
    legendCP = L.control({
        position: "bottomright"
    });
legendZD.onAdd = function(e) {
    for (var r, t, o = L.DomUtil.create("div", "info legend"), a = [0, 10, 20, 50, 100, 200, 500, 1e3], i = [], s = 0; s < a.length; s++) r = a[s], t = a[s + 1], i.push('<i style="background:' + colorz(r + 1) + '"></i> ' + r + (t ? "&ndash;" + t : "+"));
    return o.innerHTML = i.join("<br>"), o
}, legendCP.onAdd = function(e) {
    for (var r, t, o = L.DomUtil.create("div", "info legend"), a = [0, 10, 20, 50, 100, 200, 500, 1e3], i = [], s = 0; s < a.length; s++) r = a[s], t = a[s + 1], i.push('<i style="background:' + colorp(r + 1) + '"></i> ' + r + (t ? "&ndash;" + t : "+"));
    return o.innerHTML = i.join("<br>"), o
}, mapa.on("overlayadd", function(e) {
    e.layer == zdescargasLayer ? legendZD.addTo(this) : e.layer == compesquerasLayer && legendCP.addTo(this)
}), mapa.on("overlayremove", function(e) {
    e.layer == zdescargasLayer ? this.removeControl(legendZD) : e.layer == compesquerasLayer && this.removeControl(legendCP)
});

var attrib=" MinPesca 2022",osm=L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:attrib+"|<a href='http://www.openstreetmap.org/#map=2/23.9/-6.0&layers=C'>Mapa OpenStreet</a>"}),topo=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",{attribution:attrib+"|<a href='http://thunderforest.com/'>Maps for Apps</a>"}),gray=L.tileLayer("http://basemaps.cartocdn.com/light_all/%7Bz%7D/%7Bx%7D/%7By%7D.png",{attribution:attrib+"|<a href='http://www.openstreetmap.org/#map=2/23.9/-6.0&layers=C'>Mapa OpenStreet</a>"}),terrain=new L.StamenTileLayer("terrain"),mapa=L.map("map",{crs:L.CRS.EPSG3857,center:[7.406,-65.984],maxZoom:8,minZoom:3,zoom:6,attributionControl:!0,zoomControl:!1}),bounds=[[.644045387225,-73.3793879998],[12.1979113972,-58.145981]],overlayerlim=new L.ImageOverlay("images/lim.png",bounds,{opacity:.6}).addTo(mapa);function colorp(e){return 100<e?"#67000d":70<e?"#a50f15":50<e?"#cb181d":30<e?"#ef3b2c":20<e?"#fb6a4a":5<e?"#fc9272":"#ffffff"}function compesquerasInfo(e,r){var t="<table class='table table-striped table-bordered table-condensed'><tr><th>Estado</th><td>"+e.properties.ENTIDAD+"</td></tr><tr><th>Comunidades Pesqueras</th><td>"+e.properties.COM_PESQUE+"</td></tr><tr><video width='100%' height='100%' poster='images/loading.svg' type='video/mp4' src='videos/"+e.properties.ENTIDAD+".mp4'autoplay loop></video></tr></table>",o="Comunidades Pesqueras: ";e.properties&&e.properties.COM_PESQUE?o+=t:o+=0,r.bindPopup(o),r.on({mouseover:highlightFeatureCP,mouseout:resetHighlightCP,click:zoomToFeature})}var compesquerasLayer=L.geoJson(compesqueras,{style:function(e){return{weight:2,opacity:.5,color:"black",dashArray:"2",fillOpacity:.9,fillColor:colorp(e.properties.COM_PESQUE)}},onEachFeature:compesquerasInfo});function colorz(e){return 60<e?"#00bfff":45<e?"#61c9ff":30<e?"#8ad4ff":15<e?"#abdfff":10<e?"#c9e9ff":5<e?"#e5f4ff":"#ffffff"}function zdescargasInfo(e,r){var t="<table class='table table-striped table-bordered table-condensed'><tr><th>Estado</th><td>"+e.properties.ENTIDAD+"</td></tr><tr><th>Zona de Descargas: </th><td>"+e.properties.Z_DESCARGA+"</td></tr><tr><video width='100%' height='100%' poster='images/loading.svg' type='video/mp4' src='videos/"+e.properties.ENTIDAD+".mp4'autoplay loop></video></tr></table>",o="Zonas de Descarga: ";e.properties&&e.properties.Z_DESCARGA?o+=t:o+=0,r.bindPopup(o),r.on({mouseover:highlightFeatureZD,mouseout:resetHighlightZD,click:zoomToFeature})}var zdescargasLayer=L.geoJson(zdescargas,{style:function(e){return{weight:2,opacity:.5,color:"black",dashArray:"2",fillOpacity:.9,fillColor:colorz(e.properties.Z_DESCARGA)}},onEachFeature:zdescargasInfo});zdescargasLayer.addTo(mapa);var baseLayers={Mapamundi:terrain},overlays={"<img src='images/ico.svg' width='30' height='30' /> Comunidades Pesqueras":compesquerasLayer,"<img src='images/cangrejo.png' width='30' height='30' /> Zonas de Descarga":zdescargasLayer};function zoomToFeature(e){mapa.fitBounds(e.target.getBounds())}L.control.layers(baseLayers,overlays,{collapsed:!1}).addTo(mapa),terrain.addTo(mapa);var info=L.control();function highlightFeatureZD(e){e=e.target;e.setStyle({weight:5,color:"blue",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||L.Browser.edge||e.bringToFront(),info.updateZD(e.feature.properties)}function highlightFeatureCP(e){e=e.target;e.setStyle({weight:5,color:"red",dashArray:"",fillOpacity:.7}),L.Browser.ie||L.Browser.opera||L.Browser.edge||e.bringToFront(),info.updateCP(e.feature.properties)}function resetHighlightZD(e){zdescargasLayer.resetStyle(e.target),info.updateZD()}function resetHighlightCP(e){compesquerasLayer.resetStyle(e.target),info.updateCP()}info.onAdd=function(e){return this._div=L.DomUtil.create("div","info"),this.updateZD(),this.updateCP(),this._div},info.updateZD=function(e){this._div.innerHTML="<h4>Info Pesca</h4>"+(e?"<b>"+e.ENTIDAD+"</b><br />"+e.Z_DESCARGA+" / ton":"Pase por encima de un estado")},info.updateCP=function(e){this._div.innerHTML="<h4>Info Pesca</h4>"+(e?"<b>"+e.ENTIDAD+"</b><br />"+e.COM_PESQUE+" / com":"Pase por encima de un estado")},info.addTo(mapa);
var legendZD=L.control({position:"bottomright"}),legendCP=L.control({position:"bottomright"});
legendZD.onAdd=function(e){
    for(var r,t,o=L.DomUtil.create("div","info legend"),a=[0,10,20,50,100,200,500,1e3],i=[],s=0;s<a.length;s++)
    r=a[s],t=a[s+1],i.push('<i style="background:'+colorz(r+1)+'"></i> '+r+(t?"&ndash;"+t:"+"));
    return o.innerHTML=i.join("<br>"),o},

    legendCP.onAdd=function(e){for(var r,t,o=L.DomUtil.create("div","info legend"),a=[0,10,20,50,100,200,500,1e3],i=[],s=0;s<a.length;s++)r=a[s],t=a[s+1],i.push('<i style="background:'+colorp(r+1)+'"></i> '+r+(t?"&ndash;"+t:"+"));return o.innerHTML=i.join("<br>"),o},
    
    mapa.on("overlayadd",function(e){e.layer==zdescargasLayer?legendZD.addTo(this):e.layer==compesquerasLayer&&legendCP.addTo(this)}),mapa.on("overlayremove",function(e){e.layer==zdescargasLayer?this.removeControl(legendZD):e.layer==compesquerasLayer&&this.removeControl(legendCP)});