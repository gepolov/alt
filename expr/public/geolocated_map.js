ymaps.ready(init);

function init() {
    var location = ymaps.geolocation;

    // Получение местоположения и автоматическое отображение его на карте.
    location.get({
        mapStateAutoApply: true
    })
        .then(
            function (result) {
                // Получение местоположения пользователя.
                var userAddress = result.geoObjects.get(0).properties.get('text');
                var userCoodinates = result.geoObjects.get(0).geometry.getCoordinates();
                // Пропишем полученный адрес в балуне.
                result.geoObjects.get(0).properties.set({
                    balloonContentBody: 'Адрес: ' + userAddress +
                        '<br/>Координаты:' + userCoodinates
                });
                myMap.geoObjects.add(result.geoObjects)
            },
            function (err) {
                console.log('Ошибка: ' + err)
            }
        );

    var myMap = new ymaps.Map("map", {
        center: [55.76, 37.64],
        zoom: 1
    }, {
        searchControlProvider: 'yandex#search'
    }),
        objectManager = new ymaps.ObjectManager({
            // Чтобы метки начали кластеризоваться, выставляем опцию.
            clusterize: true,
            // ObjectManager принимает те же опции, что и кластеризатор.
            gridSize: 20,
            clusterDisableClickZoom: true
        });


    myMap.geoObjects.add(objectManager);

    $.ajax({
        url: "/map/points",
        dataType: "json",
        method: "get"
    }).done(function(data) {
        objectManager.add(data);
    });

}