var svc_ad = "localhost:5000"

$(function() {
    var colNum = 5
    var pairDict = {}

    PutNameInput()
    PutOption('nation', () => { PutOption('type', () => { PutFlavorInput(), PutPriceInput() }) })

    var searchTarget = {}
    var totalPage = 0
    $('#result').hide()

    $('#price_lower').on("change", () => { validatePairProp($('#price_lower'), 0, 1000000, $('#price_upper'), false) })
    $('#price_upper').on("change", () => { validatePairProp($('#price_upper'), 0, 1000000, $('#price_lower')) })

    $('#sortMethod').dropdown('setting', 'onChange', searchWithSort)
    $('#ascOrDesc').dropdown('setting', 'onChange', searchWithSort)
    $('#searchButton').on("click", () => { updateSearchTarget(), searchWithSort() })

    $("#pageDropDown").dropdown('setting', "onChange", () => { onClickPageNavigationButton($('#pageDropDown').dropdown('get value'))})
    $(`#leftPageButton`).on("click", () => { onClickPageNavigationButton(searchTarget['page']-1) })
    $(`#rightPageButton`).on("click", () => { onClickPageNavigationButton(searchTarget['page']+1) })
    $(`#leftLimitPageButton`).on("click", () => { onClickPageNavigationButton(1) })
    $(`#rightLimitPageButton`).on("click", () => { onClickPageNavigationButton(totalPage) })
    for (let i = 0; i < 5; ++i)
    {
        $('#rightPageButton').before(`<a class="icon item" id="pageButton${i}"></a>`)
        $(`#pageButton${i}`).on("click", () => { onClickPageNavigationButton($(`#pageButton${i}`).attr('value')) })
    }

    function PutNameInput() {
        $('#searchTable').append(
            `<tr>
                <th class="center aligned">name</th>
                <td colspan=${colNum}>
                    <div class="ui labeled input">
                        <input id="name" type="text">
                    </div>
                </td>
            </tr>`
        )
    }

    function PutOption(val, callback) {
        pairDict[val] = {}
        $.ajax({
            type: "GET",
            url: `http://${svc_ad}/${val}`,
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
                    $('#searchTable tr:last').after(i == 0 ?
                        `<tr>
                            <th class="center aligned" rowspan="${rowNum}">${val}</th>
                        </tr>`
                        : "<tr></tr>"
                    )
                    for (let j = 0; j < colNum; j++)
                    {
                        if (colNum*i+j < response.length)
                        {
                            var dict = response[colNum*i+j]
                            var key = Object.keys(dict)[0]
                            pairDict[val][key] = dict[key]
                            $('#searchTable tr:last').append(
                                `<td class="center aligned">
                                    <div class="ui checkbox">
                                        <input type="checkbox" class=${val} value=${key}>
                                        <label>${dict[key]}</label>
                                    </div>
                                </td>`
                            )
                        }
                        else
                        {
                            $('#searchTable tr:last').append(`<td></td>`)
                        }
                    }
                }

                callback()
            }
        });
    }

    function PutFlavorInput() {
        $.each(["sweet", "acidity", "body", "tannin"], function(_, val){
            $('#searchTable').append(
                `<tr>
                    <th class="center aligned">${val}</th>
                </tr>`
            )
            for (let i = 1; i <= colNum; ++i) {
                $('#searchTable tr:last').append(i <= 5 ?
                    `
                    <td class="center aligned">
                        <div class="ui checkbox">
                            <input type="checkbox" class=${val} value=${i}>
                            <label>${i}</label>
                        </div>
                    </td>
                    `
                    : "<td></td>"
                )
            }
        })
    }
    
    function PutPriceInput() {
        $('#searchTable').append(
            `<tr>
                <th class="center aligned">price</th>
                <td colspan="${colNum}">
                    <div class="ui right labeled input">
                        <input id="price_lower" type="number"value="0">
                        <div class="ui label">￦~</div>
                    </div>
                    <div class="ui right labeled input">
                        <input id="price_upper" type="number" value="1000000">
                        <div class="ui label">￦</div>
                    </div>
                </td>
            </tr>`
        )
    }

    function updateSearchTarget() {
        searchTarget = {}
        searchTarget["name"] = $("#name").val()
        searchTarget["price_upper"] = $("#price_upper").val()
        searchTarget["price_lower"] = $("#price_lower").val()
        $.each(["nation", "type", "sweet", "acidity", "body", "tannin"], function(_, val) {
            var selected = []
            $(`.${val}:checkbox:checked`).each(function() {
                selected.push($(this).val());
            });
            searchTarget[val] = selected
        })
    }

    function search() {
        $.ajax({
            type: "GET",
            url: `http://${svc_ad}/wine`,
            data: searchTarget,
            crossDomain: true,
            error: function() {
                console.log("error");
            },
            success: function(response) {
                $('#resultTable tbody tr').remove();
                $.each(response.data, function(_, val) {
                    $('#resultTable tbody').append(
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
                    totalPage = parseInt(response.page)
                    $('#pageDropDown div .item').remove()
                    for (let i = 1; i <= totalPage; ++i)
                    {
                        $("#pageDropDown .menu").append(
                            `<div class="item" data-value=${i}>${i}</div>`
                        )
                    }
                }
                $('#pageDropDown span').text(`${searchTarget.page}`)
                $('#pageDropDown input[type="hidden"]').attr("value", `${searchTarget.page}`)
                updatePageNavigationButton()
                $('#result').show()
            }
        });
    }

    function searchWithSort() {
        if (Object.keys(searchTarget).length == 0)
        {
            return;
        }
        searchTarget["page"] = 1
        searchTarget["sort"] = parseInt($('#sortMethod').dropdown('get value')) * 2 
                                + parseInt($('#ascOrDesc').dropdown('get value'));
        search()
    }

    function updatePageNavigationButton() {
        var pageList = []
        for (let i = 0; pageList.length < (totalPage < 5 ? totalPage : 5); ++i)
        {
            var targetPage = parseInt(searchTarget.page) + parseInt((i + 1) / 2) * (i  % 2 == 0 ? 1 : -1)
            if (targetPage <= 0 || targetPage > totalPage)
                continue;
            pageList.push(targetPage)
        }
        
        pageList.sort((a,b)=>a-b)
        for (let i = 0; i < 5; ++i)
        {
            if (i < pageList.length)
            {
                var targetPage = pageList[i]
                targetPage == searchTarget.page
                ? $(`#pageButton${i}`).addClass('disabled')
                : $(`#pageButton${i}`).removeClass('disabled')
                $(`#pageButton${i}`).attr('value', targetPage).text(targetPage).show()
            }
            else
            {
                $(`#pageButton${i}`).hide()
            }
        }
    }

    function onClickPageNavigationButton(page) {
        searchTarget["page"] = Math.min(Math.max(page, 1), totalPage)
        search()
    }
});