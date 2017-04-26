$(function(){

	$(document).ready(function(){
		tipsAlign();
		go();
        //	$("tips-div").hide();//在刚加载完时定位，但是不显示
    });

	var go=function(){
		$(".img-container").delay(1000).animate({"top":"50px"},300);
	}
	$("#search-btn").click(function(){
		var text=$("#search-text").val();
			//	console.log(text);
			//	直接执行查询
			if(text)location.href="http://cn.bing.com/search?q="+text;
			return false;
		});

	$(document).bind("click",function() {
		$("#tips-div").hide();
	});
	
	$(".bg").bind("click",function(){
		$(".bg").css("-webkit-filter","none");
	})

	/*onInput事件是一个在元素属性发生改变时触发的事件，只有对象的value发生改变时会触发该事件
	,但是注意！！通过js方式改变value不会触发该事件，这是一个html5的新事件，适用于非IE浏览器(IE9以上支持)，IE中有一个对应的onpropertychange事件，这个事件不同于onInput事件，只要元素的属性改变就会触发该事件，即使是通过js改变的
	##oninput与onpropertychange失效的情况：### 
	（1）oninput事件：a). 当脚本中改变value时，不会触发；b). 从浏览器的自动下拉提示中选取时，不会触发。 
	（2）onpropertychange事件：当input设置为disable=true后，onpropertychange不会触发。
	oninvalid事件，在表单元素的值非法时被触发。
	*/

	$("#search-text").bind("input propertychange",function(){
		var text=$(this).val();
		//console.log(text);
		//	alert("has run");
		var url="http://api.bing.com/qsonhs.aspx?q="+text;
		if(text) {
			getAjax(url, callback);
			tipsAlign();
			$("#tips-div").show();
		}else{
		//	tipsAlign();
			$("#tips-div").hide();	
		}
	});
	
	$("#search-text").bind("focus",function(){
		$(".bg").css("-webkit-filter","brightness(30%)");
	})

	var callback=function(jsonData){
                //jsonData是一个json数据格式的对象，使用常规的js方法即可以获取对象中的信息
                try {
                	// statements
                	var data = jsonData.AS.Results[0].Suggests;
                	var html = "";
                	for(var i = 0; i < data.length; i++){
                	//console.log(data);
                	html += "<li><a href="+data[i].Url+">"+data[i].Txt +"</a></li>";
                }

            } catch(e) {
                	// statements
                	console.log(e.message);
                }finally{
                	//因为这个方法可能导致错误，所以将每次必须执行代码放到finall
                	$("#tips").html(html);
                }
            };

            var getAjax=function(url,callback){
            	$.get(url,callback,"json");
            };

            $(window).resize(function(){
            	tipsAlign();
            });

		//refEle参照对齐的元素,ele需要对齐的元素
		var tipsAlign=function(){
				//offset()方法返回一个带有元素相对文档位置的对象，这个对象有一个left属性和一个top属性
		/*		var left=$("#search-text").offset().left;
				var top=$("#search-text").offset().top+$("#search-text").height();
				console.log(left);
				console.log(top);
				$("#tips-div").css("position","absolute");
				$("#tips-div").offset({left:left,top:top});//top和left数据类型为数字，不要加px
				*/

				$('#tips-div').css({
					top:$('#search-text').offset().top+$('#search-text').height(),
					left:$('#search-text').offset().left
				});
			}

			//index用于初始化li标签的位置
			var index=-1;

			$("#search-text").keydown(function(e){
				var $eles=$("li");
				var len=$eles.length;
				if (e.keyCode==40&&index<=len-1) {
					index++;
					index=(index==len?-1:index);
					if (index==-1) {
						$("search-text").focus();
						$eles.css("background","rgba(30,30,30,0.5)");
						return false;
					}
					$eles.eq(index).css("background","rgba(30,30,30,0.5)").siblings().css("background","rgba(60,60,60,0.5)");
					$("#search-text").val($("a").eq(index).html());

				}else if (e.keyCode==38&&index>=0) {
					index--;
					if (index==-1) {
						$("search-text").focus();
						$eles.css("background","rgba(30,30,30,0.5)");
						return false;
					}
					$eles.eq(index).css("background","rgba(30,30,30,0.5)").siblings().css("background","rgba(60,60,60,0.5)");
					$("#search-text").val($("a").eq(index).html());
				}
			});

		});