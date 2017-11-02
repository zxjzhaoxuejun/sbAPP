//请求链接配置
var configData={
	"cityUrl":"http://shebao.uber56.com/mapi/social/get_city",//城市列表
	
	"cityIdList":"http://shebao.uber56.com/mapi/social/get_social_config?city_id=", //城市社保数据列表
	
	"indexUrl":"http://shebao.uber56.com/sapi/welcome/index",//首页
	
	"Top10Url":"http://shebao.uber56.com/sapi/index/top10",//排行榜10
	
	"myIncome":"http://shebao.uber56.com/sapi/index/my_income",//我的收入
	
	"myIncomeSale":"http://shebao.uber56.com/sapi/index/income_sale",//我的收入——业务收入
	
	"myIncomeZxSale":"http://shebao.uber56.com/sapi/index/income_sale",//我的收入——直销收入
	
	"myRecoLists":"http://shebao.uber56.com/sapi/customers/my_reco_lists",//合伙人主页
	
	"myRecoListsItems":"http://shebao.uber56.com/sapi/customers/my_reco_lists",//合伙人主页-明细
	
	"ent_lists":" http://shebao.uber56.com/sapi/customers/ent_lists",//我的客户-企业客户
	
	"person_lists":"http://shebao.uber56.com/sapi/customers/person_lists",//我的客户-个人客户
	
	"createdList":"http://shebao.uber56.com/sapi/customers/created",//我的客户-新增企业/个人客户
	
	

}

$(function() {
	var PAGEINDEX=$('#pageIndexVal').val();
	
	
	mui('footer').on('tap', 'a', function() {
		document.location.href = this.href;
	});
	
	mui.plusReady(function () { 
		plus.screen.lockOrientation("portrait-primary"); 
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
			url: configData.cityUrl, //城市列表
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
	
//	mui('body').on('tap', 'a', function() {
//		document.location.href = this.href;
//		var pathName=this.href;
//		var pathNameArr=pathName.split('/');
//		var projectName=pathNameArr[pathNameArr.length-1];
	   if(PAGEINDEX==='1'){
	   	console.log(PAGEINDEX);
	   	//首页数据获取与展示
			$(function(){
				$.ajax({
					type: "get",
					url: configData.indexUrl, //首页
					async: true,
					success: function(data) {
						
						var dataJson={
								"ent_total": 0,
								"person_total": 0,
								"amount": 0,
								"agent_total": 0,
								"agent_first_total": 0
								};
								
					 data=$.extend(true, dataJson,data);
						
						
						$('#ent_total').text(data.ent_total);
						$('#person_total').text(data.person_total);
						$('#amount').text(data.amount);
						$('#agent_total').text(data.agent_total);
						$('#agent_first_total').text(data.agent_first_total);
						console.log(data)
					},
					error: function() {
						alert("请求首页数据异常");
					}
				});
			})
		}else if(PAGEINDEX==='11'){//我的收入
			//我的收入
			console.log(PAGEINDEX);
			$(function(){
				$.ajax({
					type: "get",
					url: configData.myIncome, 
					async: true,
					success: function(data) {
						var dataJson={
								  "amount": 99,
								  "amount_sale": 88,
								  "amount_profit": 11
							};
						 
						 data=$.extend(true, dataJson,data);
						 
						$('#myAmount').text('￥'+data.amount);
						var incomeData=[ //数据
						{ "value": data.amount_sale, "name": "业务收入" },
						{ "value": data.amount_profit, "name": "直销收入" },
					];
			var myChart = echarts.init(document.getElementById('myIncome'));
			var option = {
				title: {
					text: ''
				},
				tooltip: {
					//  	formatter: "{b}\n{c} ({d}%)",
				},
				series: [{
					name: '我的收入',
					type: 'pie',
					radius: ['40%', '70%'], //圆弧的半径大小
					center: ['50%', '50%'], //圆环的位置
					avoidLabelOverlap: true,
					label: {
						normal: {
							show: true,
							position: 'left',
							formatter: "{c}元\n ({d}%)",
						},
						emphasis: {
							textStyle: {
								fontSize: '12',
								fontWeight: 'bold',
							}
						}
					},
					labelLine: {
						normal: {
							show: true
						}
					},
					data: incomeData,
					itemStyle: {
						//通常情况下：
						normal: {
							show: true,
							　　　　　　　　　　　　 //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
							color: function(params) {
								var colorList = ['rgb(250,166,32)', 'rgb(252,83,32)'];
								return colorList[params.dataIndex];
							}
						},
					},
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart.setOption(option);
			
			//业务收入
			$('#ywIncome').text('￥'+incomeData[0].value);
			//直销收入
			$('#zxIncome').text('￥'+incomeData[1].value);
			//更新时间
			var nowTime=new Date();
			var myTime=nowTime.getFullYear()+'-'+(nowTime.getMonth()+1)+'-'+nowTime.getDate()+' '+nowTime.getHours()+':'+nowTime.getMinutes();  
			$('.update-time').text(myTime);
						
						
						console.log(data)
					},
					error: function() {
						alert("请求我的收入数据异常");
					}
				});
			})
			
		}else if(PAGEINDEX==='23'){//我的排名
			//我的收入
			console.log(PAGEINDEX);
			$(function(){
				$.ajax({
					type: "get",
					url: configData.Top10Url, 
					async: true,
					success: function(data) {
						$('#ranking').text(data.ranking);
						var html='';
						for(var i=0;i<data.lists.length;i++){
						html+='<div class="top-lists za-row"><div class="za-col-4"><span>"'+data.lists[i].id+'"</span></div><div class="za-col-5"><span>"'+data.lists[i].name+'"</span></div>';
				        html+='<div class="za-col-5"><span>"'+data.lists[i].ent_total+'"</span></div><div class="za-col-5"><span>"'+data.lists[i].person_total+'"</span></div><div class="za-col-5"><span>"'+data.lists[i].amount+'"</span></div></div>';
						}
						
						$('#tableLists').after(html);
						
						console.log(data)
					},
					error: function() {
						alert("请求我的排名数据异常");
					}
				});
			})
			
		}else if(PAGEINDEX==='16'){//业务收入
			console.log(PAGEINDEX);
			$(function(){
				$.ajax({
					type: "get",
					url: configData.myIncomeSale, 
					async: true,
					success: function(data) {
						var dataJson={
							  "lists": [
							      {"month": 100, "amount": "99", "amount_sale": "88", "amount_profit": "11"},
							      {"month": 100, "amount": "99", "amount_sale": "88", "amount_profit": "12"}
							   ]
							};
						 
						 data=$.extend(true, dataJson,data);
						 
						 var html='';
						 
						for(var i=0;i<data.lists.length;i++){
							html+='<li class="months"><div class="month-income"><div class="month-list">'+
							'<span class="month-items">10</span><span>月收入</span>'+
							'<span class="month-num">'+ data.lists[i].month+'</span></div>'+
					        '<div class="month-money">'+ data.lists[i].amount+'</div></div>'+
					        '<div class="month-user">'+
						    '<span class="m-title">签单奖</span>'+
							'<span class="m-title">'+ data.lists[i].amount_sale+'</span>'+
							'<span class="m-title" style="margin-left: 50px;">提成</span>'+
							'<span class="m-title">'+ data.lists[i].amount_profit+'</span></div></li>';
						}
						
						$('#tableLists').append(html);
						
					},
					error: function() {
						alert("请求数据异常");
					}
				});
			})
		}else if(PAGEINDEX==='25'){//直销收入
			console.log(PAGEINDEX);
			$(function(){
				$.ajax({
					type: "get",
					url: configData.myIncomeZxSale, 
					async: true,
					success: function(data) {
						var dataJson={
							  "lists": [
							      {"month": 100, "amount": "99", "amount_sale": "88", "amount_profit": "11"},
							      {"month": 100, "amount": "99", "amount_sale": "88", "amount_profit": "12"}
							   ]
							};
						 
						 data=$.extend(true, dataJson,data);
						 
						 var html='';
						 
						for(var i=0;i<data.lists.length;i++){
							html+='<li class="months"><div class="month-income"><div class="month-list">'+
							'<span class="month-items">10</span><span>月收入</span>'+
							'<span class="month-num">'+ data.lists[i].month+'</span></div>'+
					        '<div class="month-money">'+ data.lists[i].amount+'</div></div>'+
					        '<div class="month-user">'+
						    '<span class="m-title">一级</span>'+
							'<span class="m-title">'+ data.lists[i].amount_sale+'</span>'+
							'<span class="m-title" style="margin-left: 50px;">二级</span>'+
							'<span class="m-title">'+ data.lists[i].amount_profit+'</span></div></li>';
						}
						
						$('#tableLists').append(html);
						
					},
					error: function() {
						alert("请求数据异常");
					}
				});
			})
		}
	 

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
				var url=configData.cityIdList+checkId;
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