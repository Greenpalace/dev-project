var svc_ad = "localhost:5000"

$(function() {
    var elementDict = {}
    $.each(["name", "producer", "nation", "local", "varieties", "type", "use", "abv_h", "abv_l", "degree_h", "degree_l", 
            "sweet", "acidity", "body", "tannin", "price", "year", "ml"], function(_, val) {
        elementDict[val] = $(`#addPage #${val}`)
    })

    $.each(["nation", "local", "varieties", "type", "use"], function(_,val){
        elementDict[val].dropdown()
        elementDict[val].find(".menu").empty()
        $.ajax({
            type: "GET",
            url: `http://${svc_ad}/${val}`,
            contentType : "application/json; charset-utf-8",
            error: function() { 
                console.log('error');
            },
            success: function(response) {   
                $.each(response, function(_,dict){
                    var key = Object.keys(dict)[0];
                    elementDict[val]
                    .find(".menu")
                    .append(`<div class="item" data-value=${key}>${dict[key]}</div>`)
                })
                if (val != "local")
                    elementDict[val]
                    .find(".item:first")
                    .trigger("click")
            }
        })
    });

    elementDict.nation.dropdown('setting', 'onChange', function(){
        elementDict.local.find(".item").hide()
        $.ajax({
            type: "GET",
            url: `http://${svc_ad}/localbynation`,
            data: {"nation": elementDict.nation.dropdown('get value')},
            contentType : "application/json;",
            error : function(){
                console.log('error');
            },
            success : function(response){
                response.data.sort()
                $.each(response.data, function(_, d){
                    elementDict.local.find(`.item:contains(${d})`).show();
                })
                elementDict.local.find(`.item:contains(${response.data[0]})`).trigger("click")
            } 
        })
    })

    $("#addPage #add_btn").on("click", function(){
        $.each(["name", "producer"], function(_, val) {
            if (elementDict[val].val() == "") {
                alert(`put ${val}`)
                elementDict[val].focus();
                return;
            }
        })
        $.each(["nation", "local", "varieties", "type", "use"], function(_, val) {
            if (elementDict[val].dropdown('get value') == "") {
                alert(`put ${val}`)
                elementDict[val].focus();
                return;
            }
        })

        var request = {}
        $.each(Object.keys(elementDict), function(_, key){
            ["nation", "local", "varieties", "type", "use"].includes(key)
            ? request[key] = elementDict[key].dropdown('get value')
            : request[key] = elementDict[key].val()
        })

        $.ajax({
            url: `http://${svc_ad}/wine`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(request),
            error: function() {
                console.log("error")
            },
            success: () => {
                window.history.pushState({}, null, "/");
            }
        });
    })

    $("#addPage #cancel_btn").on("click", function(){
        window.history.pushState({}, null, "/");
    })

    elementDict.abv_l.on("change", () => validatePairProp(elementDict.abv_l, 0, 100, elementDict.abv_h, false))
    elementDict.abv_h.on("change", () => validatePairProp(elementDict.abv_h, 0, 100, elementDict.abv_l))
    elementDict.degree_l.on("change", () => validatePairProp(elementDict.degree_l, 0, 100, elementDict.degree_h, false))
    elementDict.degree_h.on("change", () => validatePairProp(elementDict.degree_h, 0, 100, elementDict.degree_l))
    elementDict.sweet.on("change", () => validateSingleProp(elementDict.sweet, 0, 5))
    elementDict.acidity.on("change", () => validateSingleProp(elementDict.acidity, 0, 5))
    elementDict.body.on("change", () => validateSingleProp(elementDict.body, 0, 5))
    elementDict.tannin.on("change", () => validateSingleProp(elementDict.tannin, 0, 5))
    elementDict.price.on("change", () => validateSingleProp(elementDict.price, 0, 1000000))
    elementDict.year.on("change", () => validateSingleProp(elementDict.tannin, 0, 2024))
    elementDict.ml.on("change", () => validateSingleProp(elementDict.ml, 0, 1000000))
})                    
