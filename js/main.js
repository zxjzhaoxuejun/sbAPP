$(function() {
	mui('footer').on('tap', 'a', function() {
		document.location.href = this.href;
	});

	mui.init();
	var slider = mui("#slider");
	slider.slider({
		interval: 4000 //每隔4秒调用一次
	});

	$("#selectCity").click(function() { //城市选择
		var _this = $(this);
		$.ajax({
			type: "get",
			url: "http://shebao.uber56.com/mapi/social/get_city", //城市列表
			async: true,
			success: function(data) {
				var cityArr = [];
				var dataJson = $.parseJSON(data);
				for(var i = 0; i < dataJson.length; i++) {
					for(var j = 0; j < dataJson[i].child.length; j++) {
						cityArr.push(dataJson[i].child[j]);
					}
				};
				sbCaclFun.citySelectFun(_this, cityArr);
			},
			error: function() {
				alert("请求城市数据异常");
			}
		});
	});
	$('#sbBtnCacl').click(function() { //计算开始
		sbCaclFun.sbCaclReturnFun();
	});
	$.ajax({////购买社保产品数据（个人）
		type:"get",
		url:"http://shebao.uber56.com/mapi/social/social_person",
		async:true,
		success:function(data){
			var buySocialPerson=$.parseJSON(data);//购买社保产品数据
			console.log($.parseJSON(data));
			for(var i=0;i<buySocialPerson.length;i++){
				buySocialPerson[i].product_name;//产品名
				buySocialPerson[i].price;//价格
				buySocialPerson[i].unit;//单位
				buySocialPerson[i].id;
				var url="http://shebao.uber56.com/mapi/social/social_person?product_id="+buySocialPerson[i].id;
				$('.person-detail-url').eq(i).attr('href',url);
				$('.sb-buy-text').eq(i).text(buySocialPerson[i].product_name+buySocialPerson[i].price+"元/人/"+buySocialPerson[i].unit)
			}
		},
		error:function(){
			alert("数据请求失败")
		}
	});
	
	
	$.ajax({////社保托管产品数据(企业)
		type:"get",
		url:"http://shebao.uber56.com/mapi/social/social_ent",
		async:true,
		success:function(data){
			var buySocialEnt=$.parseJSON(data);//购买社保产品数据（企业）
			console.log(data);
			for(var j=0;j<buySocialEnt.length;j++){
				buySocialEnt[j].product_name;//产品名
				buySocialEnt[j].price;//价格
				buySocialEnt[j].unit;//单位
				buySocialEnt[j].id;
				var url="http://shebao.uber56.com/mapi/social/social_ent?product_id="+buySocialEnt[j].id;
				$('.boss-detail-url').eq(j).attr('href',url);
				$('.sb-buy-text').eq(j).text(buySocialEnt[j].product_name+buySocialEnt[j].price+"元/人/"+buySocialEnt[j].unit)
			}
		},
		error:function(){
			alert("数据请求失败")
		}
	});
	

})


var sbCaclFun = {
	citySelectFun: function(ele, cityData) {
		var nowSelectVal = ele.children('.right-text').text(); //目前选择的值
		var nowThis = ele.children('.right-text');
		this.selectListFn(nowThis, cityData, nowSelectVal);

		$('#homeAddress').unbind('click').click(function() { //选择户籍
			var nowVal = $(this).children('.right-text').text(); //目前选择的值
			var _this = $(this).children('.right-text');
			var homeData = $(this).attr('select-list');
			if(homeData.length > 0) {
				$(this).children('.right-text').css("border", "none");
				sbCaclFun.homeAddressFun(_this, $.parseJSON(homeData), nowVal, 2);
			} else {
				//请选择城市
				alert("请选择城市")
			}
		});

		$('#sbType').unbind('click').click(function() { //参保类型
			var nowVal = $(this).children('.right-text').text(); //目前选择的值
			var _this = $(this).children('.right-text');
			var sbTypeData = $(this).attr('select-list');
			if(sbTypeData.length > 0) {
				$(this).children('.right-text').css("border", "none");
				sbCaclFun.homeAddressFun(_this, $.parseJSON(sbTypeData), nowVal, 3);
			} else {
				//请选择城市
				alert("请选择城市")
			}
		});
		var count = 1;
		$('#lowest input').unbind('click').click(function() {
			count++;
			if(count % 2 == 0) {
				var lowVal = $(this).parent().attr('select-list');
				$('#sbBaseQj').val(lowVal); //基数值
			} else {
				$('#sbBaseQj').val('');
				$('#sbBaseQj').attr('placeholder', $('#sbBaseQj').attr('select-list')); //基数区间
			}
			console.log(count)
		})

	},
	selectListFn: function(_this, cityData, nowSelectVal) {
		var thisData = cityData;
		// radio-icon-active
		var html = '';
		html += '<div class="select-alert-mode"><div class="alert-mode-bg"></div><div class="alert-list">';
		html += '<div class="mui-table-view-cell select-title"><span class="sb-news-title">请选择</span></div><ul class="mui-table-view alert-list-con not-after">';
		for(var i = 0; i < thisData.length; i++) {
			if(nowSelectVal == thisData[i].city_name) {
				html += '<li class="mui-table-view-cell select-alert-items" data-id="' + thisData[i].city_id + '"><span class="sb-news-title">' + thisData[i].city_name + '</span><span class="right-text radio-icon no-margin-right"><span class="radio-icon-active"></span></span></li>';
			} else {
				html += '<li class="mui-table-view-cell select-alert-items" data-id="' + thisData[i].city_id + '"><span class="sb-news-title">' + thisData[i].city_name + '</span><span class="right-text radio-icon no-margin-right"><span></span></span></li>';

			}
		}
		html += '</ul></div></div>';
		$('body').append(html);
		this.selectItemFun(_this, thisData, 1); //下拉数据选择
		this.closeFun(); //关闭
	},
	homeAddressFun: function(_this, typeData, nowSelectVal, num) {
		var thisData = typeData;
		var html = '';
		html += '<div class="select-alert-mode"><div class="alert-mode-bg"></div><div class="alert-list">';
		html += '<div class="mui-table-view-cell select-title"><span class="sb-news-title">请选择</span></div><ul class="mui-table-view alert-list-con not-after">';
		for(var i = 0; i < thisData.length; i++) {
			if(nowSelectVal == thisData[i].type_name) {
				html += '<li class="mui-table-view-cell select-alert-items" data-id="' + thisData[i].id + '"><span class="sb-news-title">' + thisData[i].type_name + '</span><span class="right-text radio-icon no-margin-right"><span class="radio-icon-active"></span></span></li>';
			} else {
				html += '<li class="mui-table-view-cell select-alert-items" data-id="' + thisData[i].id + '"><span class="sb-news-title">' + thisData[i].type_name + '</span><span class="right-text radio-icon no-margin-right"><span></span></span></li>';
			}
		}
		html += '</ul></div></div>';
		$('body').append(html);

		this.selectItemFun(_this, thisData, num);
		this.closeFun();
	},
	closeFun: function() { //关闭
		$('.alert-mode-bg').click(function() {
			$('.select-alert-mode').remove();
		})
	},
	selectItemFun: function(_this, thisData, num) {
		$('.select-alert-items').click(function() { //下拉数据选择
			var checkId = $(this).attr('data-id');
			var checkVal = $(this).text();
			_this.text(checkVal).css('color', '#595757');
			_this.attr('type-id', checkId);
			if(num == 1) { //城市选择
				var url="http://shebao.uber56.com/mapi/social/get_social_config?city_id="+checkId;
				$.ajax({ //请求每个城市社保比例
					type: "get",
					url: url, //城市社保列表
					async: true,
					success: function(data) {
						var cityArr = [];
						var dataJson = $.parseJSON(data);
						$('#sbType').children('.right-text').text('请选择');
						$('#sbType').children('.right-text').removeAttr('type-id');
						$('#homeAddress').children('.right-text').text('请选择');
						$('#homeAddress').children('.right-text').removeAttr('type-id');
						
						$('#homeAddress').attr('select-list', JSON.stringify(dataJson.household)); //户籍数据
						var sb_type=[{ "id": 1, "type_name": "社保" }]
						$('#sbType').attr('select-list', JSON.stringify(sb_type)); //参保类型数据
//						$('#sbType').attr('select-public', JSON.stringify(thisData[j].publicAccumulation)); //公积金缴纳比例
						$('#sbBase').attr('select-list', JSON.stringify(dataJson.paymentProportion)); //缴纳比例数据
						var lowVal = dataJson.base.lowest;
						var heigVal = dataJson.base.highest;
						$('#sbBaseQj').attr('select-list', lowVal + '-' + heigVal); //基数区间
						$('#sbBaseQj').attr('placeholder', lowVal + '-' + heigVal); //基数区间
						$('#sbBaseQj').val('');
						$('#lowestVal').attr('checked', false);
						$('#lowest').attr('select-list', lowVal).show(); //最低基数
					},
					error: function() {
						alert("请求城市数据异常");
					}
				});
//			
			} else if(num == 2) { //户籍

			} else if(num == 3) { //参保类型
				var cityVal = $('#selectCity').children('.right-text').text() + checkVal;
				$('#sbFa').text(cityVal);
			}
			$('#calcReturn').hide(); //关闭计算结果表格
			$('.select-alert-mode').remove();
		});
	},
	sbCaclReturnFun: function() { //社保计算
		var states = true;
		$('#calcForm a .right-text').each(function() {
			if($(this).attr('type-id') == undefined) {
				$(this).css({
					//						'border':'1px solid red',
					'color': 'red'
				});
				states = false;
				return false;
			}
		});
		if($('#sbBaseQj').val() == '' || $('#sbBaseQj').val().length > 7) {
			states = false;
			$('#sbBaseQj').select();
		}
		console.log(states)

		if(states) { //所有选都选择后------计算
			var typeId = $('#homeAddress .right-text').attr('type-id'); //缴纳的比例档次
			$('#calcReturnCity').text($('#selectCity .right-text').text() + '(' + $('#homeAddress .right-text').text() + ')'); //参保城市
			$('#calcReturnType').text($('#sbType .right-text').text()); //参保类型
			$('#calcReturnFa').text($('#sbFa').text()); //参保方案
			$('#calcReturnBase').text($('#sbBaseQj').val()); //社保基数
			var data = $.parseJSON($('#sbBase').attr('select-list'));
			var typeData = ''; //档次比例数据
			for(var i = 0; i < data.length; i++) {
				if(data[i].type == typeId) {
					typeData = data[i];
				}
			}
			//公积金publicAccumulation
			if($('#sbType .right-text').attr('type-id') == 2) {
				var accumulationData = $.parseJSON($('#sbType').attr('select-public'));
				var person1 = twoDecimal(accumulationData.scale_person1 * $('#sbBaseQj').val());
				var ent1 = twoDecimal(accumulationData.scale_ent1 * $('#sbBaseQj').val());
				$('#publicAccumulation span').eq(1).text(accumulationData.scale_person1);
				$('#publicAccumulation span').eq(2).text(person1);
				$('#publicAccumulation span').eq(3).text(accumulationData.scale_ent1);
				$('#publicAccumulation span').eq(4).text(ent1);
				$('#ylSb,#sySb,#gsSb,#sysSb,#ylxSb,#bcSb').hide();
				$('#publicAccumulation').show();
				//个人缴纳
				var personCount = twoDecimal(Number(person1));
				$('#calcReturnPerson').text(personCount);

				//企业缴纳
				var entCount = twoDecimal(Number(ent1));
				$('#calcReturnEnt').text(entCount);
				//总计
				$('#calcReturnCount').text(twoDecimal(Number(entCount) + Number(personCount)));
			} else {
				$('#ylSb,#sySb,#gsSb,#sysSb,#ylxSb,#bcSb').show();
				$('#publicAccumulation').hide();
				//养老保险计算
				var person1 = twoDecimal(typeData.scale_person1 * $('#sbBaseQj').val());
				var ent1 = twoDecimal(typeData.scale_ent1 * $('#sbBaseQj').val());
				$('#ylSb span').eq(1).text(typeData.scale_person1);
				$('#ylSb span').eq(2).text(person1);
				$('#ylSb span').eq(3).text(typeData.scale_ent1);
				$('#ylSb span').eq(4).text(ent1);
				//失业保险计算
				var scaleBaseVal = 0;
				if(typeData.base2 == 0) {
					scaleBaseVal = $('#sbBaseQj').val();
				} else {
					scaleBaseVal = typeData.base2;
				}
				var person2 = twoDecimal(typeData.scale_person2 * scaleBaseVal);
				var ent2 = twoDecimal(typeData.scale_ent2 * scaleBaseVal);
				$('#sySb span').eq(1).text(typeData.scale_person2);
				$('#sySb span').eq(2).text(person2);
				$('#sySb span').eq(3).text(typeData.scale_ent2);
				$('#sySb span').eq(4).text(ent2);
				//工伤保险计算
				var person3 = twoDecimal(typeData.scale_person3 * $('#sbBaseQj').val());
				var ent3 = twoDecimal(typeData.scale_ent3 * $('#sbBaseQj').val());
				$('#gsSb span').eq(1).text(typeData.scale_person3);
				$('#gsSb span').eq(2).text(person3);
				$('#gsSb span').eq(3).text(typeData.scale_ent3);
				$('#gsSb span').eq(4).text(ent3);
				//生育保险计算
				var person4 = twoDecimal(typeData.scale_person4 * $('#sbBaseQj').val());
				var ent4 = twoDecimal(typeData.scale_ent4 * $('#sbBaseQj').val());
				$('#sysSb span').eq(1).text(typeData.scale_person4);
				$('#sysSb span').eq(2).text(person4);
				$('#sysSb span').eq(3).text(typeData.scale_ent4);
				$('#sysSb span').eq(4).text(ent4);
				//医疗保险计算
				var person5 = twoDecimal(typeData.scale_person5 * $('#sbBaseQj').val());
				var ent5 = twoDecimal(typeData.scale_ent5 * $('#sbBaseQj').val());
				$('#ylxSb span').eq(1).text(typeData.scale_person5);
				$('#ylxSb span').eq(2).text(person5);
				$('#ylxSb span').eq(3).text(typeData.scale_ent5);
				$('#ylxSb span').eq(4).text(ent5);
				//补充保险计算
				var person6 = twoDecimal(typeData.scale_person6 * $('#sbBaseQj').val());
				var ent6 = twoDecimal(typeData.scale_ent6 * $('#sbBaseQj').val());
				$('#bcSb span').eq(1).text(typeData.scale_person6);
				$('#bcSb span').eq(2).text(person6);
				$('#bcSb span').eq(3).text(typeData.scale_ent6);
				$('#bcSb span').eq(4).text(ent6);
				//残保险计算

				//个人缴纳
				var personCount = twoDecimal(Number(person1) + Number(person2) + Number(person3) + Number(person4) + Number(person5) + Number(person6));
				$('#calcReturnPerson').text(personCount);

				//企业缴纳
				var entCount = twoDecimal(Number(ent1) + Number(ent2) + Number(ent3) + Number(ent4) + Number(ent5) + Number(ent6));
				$('#calcReturnEnt').text(entCount);
				//总计
				$('#calcReturnCount').text(twoDecimal(Number(entCount) + Number(personCount)));
			}
			$('#calcReturn').show();
		}

	}
}

$(function() { //选择付费方式
	$('.check-list .mui-btn').click(function() {
		$('.check-list .mui-btn').removeClass('check-color');
		$(this).addClass('check-color');

	})

})

//保留整数位
function toDecimal(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return;
	}
	//          f = Math.round(x*100)/100; /*改变保留小数点后几位（100=2,1000=3）*/
	f = Math.round(x, 0);
	return f;
}

//保留小数点后两位
function twoDecimal(x) {
	var f = parseFloat(x);
	if(isNaN(f)) {
		return;
	}
	f = Math.round(x * 100) / 100; /*改变保留小数点后几位（100=2,1000=3）*/
	//          f = Math.round(x,0);
	return f;
}