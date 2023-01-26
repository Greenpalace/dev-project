var svc_ad = "localhost:5000"

$(function() {
    var elementDict = {}
    $.each(["name", "producer", "nation", "local", "varieties", "type", "use", "abv_upper", "abv_lower", "degree_upper", "degree_lower", 
            "sweet", "acidity", "body", "tannin", "price", "year", "ml"], function(_, val) {
        elementDict[val] = $(`#editPage #${val}`)
    })

    $.each(["nation","local","varieties","type","use"], (_, val) => elementDict[val].dropdown())

    var wid = 0
    var initFlag = 2

    $("#editPage #wid").on("change", function () {
        var wid = window.location.pathname.match(/\/\d+/)[0].slice(1);
        initFlag = 2
        $.ajax({
            type: "GET",
            url : `http://${svc_ad}/wine/${wid}`,
            contentType : "application/json; charset-utf-8",
            error: function() {
                console.log('error');
            },
            success : function(data){
                $.each(Object.keys(elementDict), function(_, key){
                    if (["nation","local","varieties","type","use"].includes(key))
                    {
                        elementDict[key].find(".menu").empty()
                        $.ajax({
                            type: "GET",
                            url: `http://${svc_ad}/${key}`,
                            contentType : "application/json; charset-utf-8",
                            error: function() { 
                                console.log('error');
                            },
                            success: function(response) {   
                                $.each(response, function(_, dict){
                                    var id = Object.keys(dict)[0];
                                    elementDict[key]
                                    .find(".menu")
                                    .append(`<div class="item" data-value=${id}>${dict[id]}</div>`)
                                })
                                elementDict[key]
                                .find(`.item[data-value=${data[key]}]`)
                                .trigger("click")
                            }
                        })
                    }
                    else
                    {
                        elementDict[key].val(data[key])
                    }
                });
            }
        })
    })

    elementDict.nation.dropdown('setting', 'onChange', function(){
        console.log(elementDict.nation.dropdown('get value'))
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
                console.log(initFlag)
                initFlag > 0
                ? --initFlag
                : elementDict.local.find(`.item:contains(${response.data[0]})`).trigger("click")
            } 
        })
    })

    $("#editPage #edit_btn").on("click", function(){
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
            (["nation", "local", "varieties", "type", "use"].includes(key))
            ? request[key] = elementDict[key].dropdown('get value')
            : request[key] = elementDict[key].val()
        })

        $.ajax({
            url: `http://${svc_ad}/wine/${wid}`,
            type: "PATCH",
            contentType: "application/json",
            data: JSON.stringify(request),
            error: function() {
                console.log("error")
            },
            success: function() {
                window.history.pushState({}, null, `/${wid}`);
            }
        });
    })

    $("#editPage #cancel_btn").on("click", function(){
        window.history.pushState({}, null, `/${wid}`);
    })

    elementDict.abv_lower.on("change", () => validatePairProp(elementDict.abv_l, 0, 100, elementDict.abv_h, false))
    elementDict.abv_upper.on("change", () => validatePairProp(elementDict.abv_h, 0, 100, elementDict.abv_l))
    elementDict.degree_lower.on("change", () => validatePairProp(elementDict.degree_l, 0, 100, elementDict.degree_h, false))
    elementDict.degree_upper.on("change", () => validatePairProp(elementDict.degree_h, 0, 100, elementDict.degree_l))
    elementDict.sweet.on("change", () => validateSingleProp(elementDict.sweet, 0, 5))
    elementDict.acidity.on("change", () => validateSingleProp(elementDict.acidity, 0, 5))
    elementDict.body.on("change", () => validateSingleProp(elementDict.body, 0, 5))
    elementDict.tannin.on("change", () => validateSingleProp(elementDict.tannin, 0, 5))
    elementDict.price.on("change", () => validateSingleProp(elementDict.price, 0, 1000000))
    elementDict.year.on("change", () => validateSingleProp(elementDict.tannin, 0, 2024))
    elementDict.ml.on("change", () => validateSingleProp(elementDict.ml, 0, 1000000))
})                    
