$(function () {
    $('.logo.top').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated zoomIn');
    });
    $('.logotitle').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $(this).removeClass('animated zoomIn');
    });

    // $('.logo.bottom .main-house').addClass('animated zoomIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    //     $(this).removeClass('animated zoomIn');
    // }).ready(function () {
    //     $('.logo.bottom .left-house').addClass('animated fadeInLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    //         $(this).removeClass('animated fadeInLeft');
    //     });
    //     $('.logo.bottom .right-house').addClass('animated fadeInRight').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
    //         $(this).removeClass('animated fadeInRight');
    //     });

    // });
    $('#myCarousel').carousel({ interval: 3000 });//每隔5秒自动轮播 

    //地图操作
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hyeTIyNyIsImEiOiJjbDA3d2R3ODgwMWxiM2RtbnZ0bzlsdnR4In0.KLY-Y74kzR-S8C5AFFJc6Q'; // 替换为您的 Mapbox 访问令牌
    // 创建地图实例
    var map = new mapboxgl.Map({
        container: 'map', // 指定地图容器的 ID
        style: 'mapbox://styles/mapbox/streets-v11', // 指定地图样式
        center: [116.313348, 39.9621], // 指定地图中心点的经纬度坐标
        zoom: 15, // 指定地图缩放级别
        pixelRatio: window.devicePixelRatio || 1,
    });
    // 添加缩放控件
    //https://map.baidu.com/?newmap=1&qt=ext&uid='建筑物uid'&ext_ver=new&ie=utf-8&l=11
    map.addControl(new mapboxgl.NavigationControl());
    // 添加宾馆掩膜数据
    map.on('load', function() {
        map.addSource('building', {
            type: 'geojson',
            data: '../geodata/Hotel_json.geojson' // 建筑物数据的文件路径
        });

        map.addLayer({
            id: 'building-mask',
            type: 'fill',
            source: 'building',
            paint: {
                'fill-color': '#69b8e0', // 设置遮罩的颜色
                'fill-opacity': 0.5, // 设置遮罩的透明度
                // 'fill-extrusion-outline-color': '#2f2d2d', // 设置边框的颜色
                // 'fill-extrusion-outline-width': 2 // 设置边框的宽度
            }
        });

    });
    map.on('idle',function(){
        map.resize()
    })
    // 创建一个新的标记
    var marker = new mapboxgl.Marker({color: 'red'})
        .setLngLat([116.313348, 39.9621]) // 设置标记的经纬度坐标
        .addTo(map); // 将标记添加到地图上

    // var barWidth = $("#navigationBar").width();
    // $(".nav-item").css({ "width": barWidth / 8 });

    // console.log($("#navigationBar"))
    // console.log($(".nav-link"))
    // for (i = 0; i < $(".nav-link").length; i++) {
    //     var padding = (barWidth / 8 - $(".nav-link")[i].width()) / 2;
    //     $(".nav-link")[i].css({ "padding-left": padding, "padding-right": padding })
    // }

});

$(".nav-item").click(function () {

    $(".nav-item.active").each(function () {
        $($(this).children('a').data("href")).hide();
        $(this).removeClass("active");
    });
    $(this).addClass("active");
    $($(this).children('a').data("href")).fadeIn();
});
$('#toRegistr').click(function (){
    sessionStorage.setItem("from","pageA");
})



