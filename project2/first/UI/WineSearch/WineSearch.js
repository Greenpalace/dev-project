var svc_port = 30804
var ip = "172.18.228.19";
test = {
    nation: { data: { 1: "nation1", 2: "nation2" }},
    type: { data: { 1: "type1", 2: "type2" }},
}

test2 = {
    data: [
        {
            id: 1,
            name: "name1",
            nation: 1,
            type: 1,
            sweet: 1,
            acidity: 1,
            body: 1,
            tannin: 1,
            price: 1,
        },
        {
            id: 2,
            name: "name2",
            nation: 2,
            type: 2,
            sweet: 2,
            acidity: 2,
            body: 2,
            tannin: 2,
            price: 2,
        }
    ]
}
$(function() {
    var colNum = 5
    var pairDict = {}
    $.each(["nation", "type"], function(_, val){
        pairDict[val] = {}
        $.ajax({
            type: "GET",
            url: `http://${ip}:${svc_port}/${val}`,
            contentType : "application/json; charset-utf-8",
            error: function() { 
                console.log('error');
            },
            success: function(response) {
                response = response.sort((a, b) => a[Object.keys(a)[0]] > b[Object.keys(b)[0]] ? 1 : -1)
                response.push(response.splice(response.indexOf(response.find(e => ["Missing"].includes(e[Object.keys(e)[0]]))), 1)[0]);
                response.push(response.splice(response.indexOf(response.find(e => ["Others", "Etc"].includes(e[Object.keys(e)[0]]))), 1)[0]);
                var rowNum = Math.ceil(response.length / colNum)
                for (let i = 0; i < rowNum; i++)
                {
                    $('table[name="searchTable"] tr:last').after(i == 0 ?
                        `<tr>
                            <th rowspan="${rowNum}">${val}</th>
                        </tr>`
                        : "<tr></tr>"
                    )
                    for (let j = 0; j < colNum; j++)
                    {
                        if (colNum*i+j < response.length)
                        {
                            var dict = response[5*i+j]
                            var key = Object.keys(dict)[0]
                            pairDict[val][key] = dict[key]
                            $('table[name="searchTable"] tr:last').append(
                                `<td>
                                    <label>${dict[key]}<input type="checkbox" class=${val} value=${key}></label>
                                </td>`
                            )
                        }
                        else
                        {
                            $('table[name="searchTable"] tr:last').append(`<td></td>`)
                        }
                    }
                }
            }
        });
        /*var valTd = $(`td[name="${val}Td"]`)
        $.each(Object.entries(test[val].data), function(_, [key, r_val]) {
            pairDict[val][key] = r_val
            valTd.append(
                `<label>
                    ${r_val}
                    <input type="checkbox" class=${val} value=${key}>
                </label>`
            )
        })*/
    })

    $('table[name="searchTable"] tr:last').after(
        `<tr>
            <th>price</th>
            <td colspan="${colNum}">
                <label>high <input type="number" class="price_h" min="0" max="99999999" value="99999999"></label>
                <label>low <input type="number" class="price_l" min="0" max="99999999" value="0"></label>
            </td>
        </tr>`
    )

    $.each(["sweet", "acidity", "body", "tannin"], function(_, val){
        $('table[name="searchTable"] tr:last').after(
            `<tr>
                <th>${val}</th>
            </tr>`
        )
        for (let i = 1; i <= colNum; ++i) {
            $('table[name="searchTable"] tr:last').append(i <= 5 ?
                `<td>
                    <label>${i}<input type="checkbox" class=${val} value=${i}></label>
                </td>`
                : "<td></td>"
            )
        }
    })

    var searchTarget = {}
    function updateSearchTarget() {
        searchTarget = {}
        searchTarget["name"] = $(".name").val()
        $.each(["nation", "type", "sweet", "acidity", "body", "tannin"], function(_, val) {
            var selected = []
            $(`.${val}:checkbox:checked`).each(function() {
                selected.push($(this).val());
            });
            searchTarget[val] = selected
        })
        if ($(".price_h").val() < $(".price_l").val()) {
            $(".price_h").val($(".price_l").val())
        }
        searchTarget["price_h"] = $(".price_h").val()
        searchTarget["price_l"] = $(".price_l").val()
    }

    function search() {
        $.ajax({
            type: "GET",
            url: `http://${ip}:${svc_port}/wine`,
            data: searchTarget,
            crossDomain: true,
            error: function() {
                console.log("error");
            },
            success: function(response) {
                $('table[name="resultTable"] tr:gt(0)').remove();
                $.each(response.data, function(_, val) {
                    $('table[ name="resultTable"] tr:last').after(
                        `<tr>
                            <td><a href="/${val.id}">${val.name}</a></td>
                            <td>${pairDict["nation"][val.nation]}</td>
                            <td>${pairDict["type"][val.type]}</td>
                            <td>${val.sweet}</td>
                            <td>${val.acidity}</td>
                            <td>${val.body}</td>
                            <td>${val.tannin}</td>
                            <td>${val.price}</td>
                        </tr>`
                    )
                })
                if (response.page > 0)
                {
                    $('div[name="buttonContainerDiv"]').empty()
                }
                for (let i = 1; i <= response.page; i++)
                {
                    $('div[name="buttonContainerDiv"]').append(
                        `<button type="button" name="${i}button" value=${i}>${i}</button>`
                    )
                    $(`button[name="${i}button"]`).on("click", function() {
                        searchTarget["page"] = i
                        search()
                    })
                }
            }
        });
    }

    function getSortNum() {
        return parseInt($('select[name="sortMethod"] option:selected').val()) * 2 
            + parseInt($('select[name="ascOrDesc"] option:selected').val());
    }

    $('select[name="sortMethod"]').on("change", function() {
        if (Object.keys(searchTarget).length == 0)
        {
            return;
        }
        searchTarget["page"] = 1
        searchTarget["sort"] = getSortNum()
        search()
    })

    $('select[name="ascOrDesc"]').on("change", function() {
        if (Object.keys(searchTarget).length == 0)
        {
            return;
        }
        searchTarget["page"] = 1
        searchTarget["sort"] = getSortNum()
        search()
    })


    $('button[name="searchButton"]').on("click", function() {
        updateSearchTarget()
        searchTarget["page"] = 1
        searchTarget["sort"] = getSortNum()
        search()
        
        /*$('table[name="resultTable"] tr:gt(0)').remove();
        $.each(test2.data, function(_, val) {
            $('table[name="resultTable"] tr:last').after(
                `<tr>
                    <td><a href="/${val.id}">${val.name}</a></td>
                    <td>${pairDict["nation"][val.nation]}</td>
                    <td>${pairDict["type"][val.type]}</td>
                    <td>${val.sweet}</td>
                    <td>${val.acidity}</td>
                    <td>${val.body}</td>
                    <td>${val.tannin}</td>
                    <td>${val.price}</td>
                </tr>`
            )
        })*/
    })
});
