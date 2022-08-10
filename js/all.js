$(document).ready(function () {
    /* 漢堡選單 */
    $('.fa-solid.fa-bars.showmenu').click(function (e) { 
        console.log('click');
        $('body').toggleClass('menu-show');
    });

    /* 商品追蹤效果 */
    $('.like-icon').click(function (e) { 
        console.log('click');
        e.preventDefault();
        /*this可針對目前點擊來做動作，再用find找到子元素的內容，選擇.fa-heart讓兩顆愛心分別都可切換顯示/隱藏。*/
        $(this).find('.fa-heart').toggle();
    });
    
    /* 加入購物車_顯示數字 */
    let count = 0;
	$('.add-cart').click(function(e){
        console.log('click');
		e.preventDefault();
		count = count + 1;
		if(count > 10){
			$('.count').html('10+')
		}
		else{
			$('.count').html(count)
		}
	});
});

