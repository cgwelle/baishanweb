(function(prefix_url){
	if(!document.getElementById('majorelCss')){
		let link = document.createElement('link');
		link.id = 'majorelCss';
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = prefix_url + '/libs/majorel.css';
		link.media = 'all';
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	if(document.getElementById("majorelIframe") != null) {
		return;
	}
	let contentBox = document.createElement('iframe');
	contentBox.id = 'majorelIframe';
	contentBox.src = 'javascript:false';
	 document.body.appendChild(contentBox);
	 
	let chatScript = document.createElement('script');
	chatScript.type = 'text/javascript';
	chatScript.src = prefix_url + '/libs/majorelChat.js';
	chatScript.onload = function(){
		MajorelLivechatApp.init(); 
	}
	document.getElementsByTagName('body')[0].appendChild(chatScript);
	
})('https://lv.arvato-ocs.com/lv')//https://lv-stg..com/lv http://172.23.21.107:8080arvato-ocs