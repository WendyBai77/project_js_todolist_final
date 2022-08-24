$(document).ready(function () {
    let data = [];
    // ul為監聽對象，要監聽裡面的ul li
    const list = $('.list');
    const uncompletedNum = $('.num-uncompleted');
    //畫面暫存狀態：0-待完成 / 1-已完成 / 2-全部
    let statusNow = 2;

    //顯示 list 內容(位於各不同頁籤(0-待完成/1-已完成/2-全部)的表單status狀態
    function displayList(status) {
        //畫面表單清空
        list.empty();
        // jQuery用的是each，index-前元素的索引/object-當前的元素
        $.each(data, function (index, object) {
            //假如清單狀態不是：0-待完成&&當前元素待完成 / 1-已完成&&當前元素已完成 /2-全部，則中止
            if (status <= 1 && status != object.status) {
                return;
            }
            //資料內容(透過object.status來判斷0-待完成/1-已完成，再設定勾選/無勾選效果)
            let element;
            if (object.status == 0) {
                element = `<li data-num=${index}><div class="checkbox"></div>`;
            } else {
                element = `<li data-num=${index} class="checkbox-checked"><div class="checkbox"></div>`;
            }
            element += `<p>${object.value}</p><div class="list-delete"></div></li>`;
            // append可在被選元素的結尾(仍然在內部)插入指定內容。
            list.append(element);
        });
    }
    // 修改data陣列包物件，裡面list項目的status狀態
    // changeItemStatus($(e.target).parent()); ， listItem為.list>li
    function changeItemStatus(listItem) {
        // 修改list內項目的顯示效果(讓.list>li .checkbox-checked 新增/移除)
        listItem.toggleClass('checkbox-checked');
        // 更新暫存 list(更新暫存到1-已完成，0-待完成。menu裡面才會顯示對應的項目內容)
        // 宣告num，取出li的索引值
        let num = listItem.attr('data-num');
        // 檢查listItem是否包含checkbox-checked。搜索成功為true，否則返回false。
        if (listItem.hasClass("checkbox-checked")) {
            // li項目包含checkbox-checked時(代表已完成)，將data索引值改為1(已完成)。
            data[num].status = 1;
        }
        // li項目不包含checkbox-checked時(代表待完成)，將data索引值改為0(待完成)。
        else {
            data[num].status = 0;
        }
        // console.log('function changeItemStatus(listItem)_:data', data);
    }
    // 監測num-uncompleted(待完成項目)，並賦予值到宣告的uncompletedCNT。element是寫入畫面`<li data-num=...<div class="list-delete"></div></li>`
    function uncompletedCNT(way, element) {
        switch (way) {
            case "add":
                // 使用parseInt，將取出的待完成項目從字串轉成數字型別。
                uncompletedNum.text(parseInt(uncompletedNum.text()) + 1);
                break;
            case "change":
                // 如當下li項目，包含checkbox-checked。搜索成功為true，否則返回false。
                if ($(element).hasClass("checkbox-checked")) {
                    uncompletedNum.text(parseInt(uncompletedNum.text()) - 1);
                } else {
                    uncompletedNum.text(parseInt(uncompletedNum.text()) + 1);
                }
                break;
            case "delete":
                // 使用!將結果反向，不包含checkbox-checked。為true，反之為false。
                if (!$(element).hasClass("checkbox-checked")) {
                    uncompletedNum.text(parseInt(uncompletedNum.text()) - 1);
                }
                break;
        }
    }
    //針對點選menu的各個頁籤(全部/待完成/已完成)，新增/移除效果
    $(".menu").on('click', function (e) {
        //移除點擊menu後的效果，使用children找到子元素(子階層，僅兒子輩)的內容
        $(".menu").children().removeClass("menu-active");

        //選中menu各頁籤加上效果，透過e.target取得觸發事件的物件(了解目前所在元素位置)
        //e.target可取出<li class="menu-active" data-status="2">全部</li> <li data-status="0" class="menu-active">待完成</li> <li data-status="1" class="menu-active">已完成</li>
        $(e.target).toggleClass("menu-active");

        // 更新暫存狀態-監測.menu點擊事件，透過e.target取得觸發事件的物件(了解目前所在元素位置)，再取出data-status來判斷點選到(2-全部/0-待完成/1-已完成)
        statusNow = $(e.target).attr("data-status");
        // 更新畫面表單
        displayList(statusNow);
    });
    //監測.cart_content>.list(項目資料內容)的點擊事件
    $(".list").on('click', function (e) {
        // e.target 搭配 nodeName節點，抓到你預期要做的事情，可抓出HTML標籤位置
        if (e.target.nodeName === "P") {
            // 當標籤位置在P，找到父階層元素為.list>li
            changeItemStatus($(e.target).parent());
            // 當li.checkbox-checked>p 新增待辦事項，執行uncompletedCNT條件判斷"change"，減少/增加待完成項目
            uncompletedCNT("change", $(e.target).parent());
        }
        else if (e.target.nodeName === "DIV") {
            //如當標籤位置在DIV，以及e.target包含核取方塊div.checkbox
            if ($(e.target).hasClass("checkbox")) {
                //如當標籤位置在DIV，以及e.target包含核取方塊div.checkbox；父階層元素為.list>li         
                changeItemStatus($(e.target).parent());
                //如當標籤位置在DIV，以及e.target包含核取方塊div.checkbox；uncompletedCNT(待完成項目)執行"change"條件。父階層元素為.list>li      
                uncompletedCNT("change", $(e.target).parent());
                // console.log('uncompletedCNT("change", $(e.target).parent():',$(e.target).parent());

            } else {
                //如當標籤位置在DIV，e.target不包含div.checkbox，表示點選到div.list-delete；uncompletedCNT(待完成項目)執行"delete"條件。父階層元素為.list>li 
                uncompletedCNT("delete", $(e.target).parent());
                // 刪除單筆，抓取父階層元素.list>li的屬性data-num 
                let num = $(e.target).parent().attr('data-num');
                data.splice(num, 1);
                // data.length == 0 代表div.card main內層裡ul .list沒有任何資料，所以將div.card main加上  "list-empty"類別，來讓div.card main整個資料做隱藏
                if (data.length == 0) {
                    $(".main").addClass("list-empty");
                }
            }
        }
        // 更新畫面表單
        displayList(statusNow);
    });

    // 監聽點擊新增+按鈕(代表有新增待辦事項)
    $(".input input[type='button']").on('click', function (e) {
        let input = $(".input input[type='text']");
        if (input.val().trim() != "") {
            // 更新暫存 list(將待辦事項的值與狀態存入obj物件)
            const obj = {};
            obj.value = input.val().trim();
            //預設物件狀態為0-待完成，從陣列尾端來「新增」元素
            obj.status = "0";
            data.push(obj);
            // 寫入畫面 (如果選到頁籤"1-已完成"，無法點擊新增+按鈕 來『新增待辦事項』)
            if ($(".menu-active").attr("data-status") != "1") {
                let element = `<li data-num=${data.length - 1}><div class="checkbox"></div><p>${input.val()}</p><div class="list-delete"></div></li>`;
                list.append(element);
            }
            uncompletedCNT("add");
            // 清空input輸入待辦事項欄位
            input.val("");
        }
        if (data.length == 1) {
            $(".main").removeClass("list-empty");
        }
    });

    //監聽"清除已完成項目"點擊事件
    $(".delete-completed").on('click', function (e) {
        // 篩選出未完成項目(item.status==0，代表0-待完成)
        // 箭頭函式寫法 data = data.filter((item) => item.status == 0);
        data = data.filter(function (item) {
            return item.status == 0;
        })
        // 更新畫面表單
        displayList(statusNow);
        if (data.length == 0) {
            $(".main").addClass("list-empty");
        }
    });

    // 監測document，並使用keypress針對輸出文字符號的按鍵觸發事件
    $(document).on('keypress', function (e) {
        //使用.which屬性，指示按了哪個鍵或按鈕。再使用keyCode 13(Enter)確認是否按下Enter鍵
        if (e.which == 13) {
            //.is可依選擇器確認，如至少有一個元素匹配給定的參數，則返回 true。focus可將焦點設置在指定元素上
            if ($(".input input[type='text']").is(":focus")) {
                $(".input input[type='button']").click();
            }
        }
    });

});








