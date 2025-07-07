let scrollTop;
let isOpen = false;
function MajorelLivechat(){
	let domaiName = 'https://lv.arvato-ocs.com';
	this.config = {
		app_name:'app',
		contentDom:'',
		contentDoc:'',
		vendors_link:`${domaiName}/lv/static/css/chunk-vendors.css`,
		app_link:`${domaiName}/lv/static/css/app.css`,
		vendors_script:`${domaiName}/lv/static/js/chunk-vendors.js`,
		app_script:`${domaiName}/lv/static/js/app.js`,
		ip_script:'https://pv.sohu.com/cityjson?ie=utf-8'
	}
}
MajorelLivechat.prototype.constructor = MajorelLivechat;
MajorelLivechat.prototype.init = function(){
	let that = this;
	that.config.contentDom = document.getElementById("majorelIframe");
	that.config.contentDoc = that.config.contentDom.contentWindow.document;
	
	var div = document.createElement('div');
	div.id = that.config.app_name;
	
	that.config.contentDoc.open()._l = function() {
		let vendorsLink = document.createElement('link');
		let appLink = document.createElement('link');
		 that.config.contentDoc.getElementsByTagName('body')[0].appendChild(div)
		 vendorsLink.rel = "stylesheet";
		 vendorsLink.href = that.config.vendors_link;
		 vendorsLink.type = "text/css";
		 vendorsLink.media = "all";
		 that.config.contentDoc.getElementsByTagName('head')[0].appendChild(vendorsLink);
		 appLink.rel = "stylesheet";
		 appLink.href = that.config.app_link;
		 appLink.type = "text/css";
		 appLink.media = "all";
		 that.config.contentDoc.getElementsByTagName('head')[0].appendChild(appLink);
		 
		loadScript(that.config.vendors_script,
			 function() {
				 loadScript(that.config.app_script,
					 function() {
						 loadScript(that.config.ip_script,function(){})
					 });
			 });
	
	}
	that.config.contentDoc.write('<body onload="document._l();">');
	that.config.contentDoc.close();
	
	window.onmessage = function(event){
		switch (event.data.type){
			case 'appStatus':
				that.dispatchStatus(event)
				break;
			case 'appWrapper':
				that.chatControl(event);
				break;
			default:
				break;
		}
	}
	window.addEventListener('load',() => {
		let openTabs = localStorage.getItem('openTabs');
		if(openTabs){
			openTabs++;
			localStorage.setItem('openTabs',openTabs);
		}else {
			localStorage.setItem('openTabs',1);
		}
	})
	window.addEventListener('unload',(event) => {
		event.preventDefault();
		let openTabs = localStorage.getItem('openTabs');
		if(openTabs){
			openTabs--;
			localStorage.setItem('openTabs',openTabs < 0 ? 1 : openTabs);
		}
		event.returnValue = ''
	})
	window.addEventListener('storage',(event) => {
		this.config.contentDom.contentWindow.postMessage({
			type:'openTabs',
			data:localStorage.getItem('openTabs')
		}, '*')	
	})
}
MajorelLivechat.prototype.openChat = function(){
	let that = this;
	let event = {
		data:{
			appWrapperToggle:isOpen
		}
	}
	this.chatControl(event)
}
MajorelLivechat.prototype.chatControl = function(event){
	let that = this;
	if(!event) return;
	isOpen = event.data.appWrapperToggle;
	that.config.contentDom.classList.remove('mobile_enter','mobile_leave','pc_enter','pc_leave');
		if(event.data.appWrapperToggle){
			if(isMobile()){
				that.config.contentDom.classList.add('mobile_enter');
				scrollTop = document.scrollingElement.scrollTop;
				document.body.style.position = 'fixed';
				document.body.style.top = -scrollTop + 'px';
			}else {
				that.config.contentDom.classList.add('pc_enter');
			}
		}else {
			if(isMobile()){
				that.config.contentDom.classList.add('mobile_leave');
				document.body.style.position = 'static';
				document.scrollingElement.scrollTop = scrollTop;
			}else {
				that.config.contentDom.classList.add('pc_leave');
			}
		}
}
MajorelLivechat.prototype.dispatchStatus = function(event){
	if(!event) return;
	var fireEvent = document.createEvent('Event');
	fireEvent.majorelValue = {'status':event.data.appStatus};
	fireEvent.initEvent('majorelStatus', true, true);
	document.dispatchEvent(fireEvent);
	if(event.data.appStatus != 1){
		this.config.contentDom.classList.remove('mobile_enter','mobile_leave','pc_enter','pc_leave');
	}
}
window.MajorelLivechatApp = new MajorelLivechat();

function isMobile(){
	if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) { //移动端
		return true
	}
	return false
}
function loadScript(url, callback){
	 var script = document.createElement("script");
	 script.type = "text/javascript";
	 if(script.readyState) { // IE
		 script.onreadystatechange = function() {
			 if(script.readyState == "loaded" || script.readyState == "complete") {
				 script.onreadystatechange = null;
				 callback();
			 }
		 };
	 } else {
		 script.onload = function() {
			 callback();
		 };
	 }
	 script.src = url;
	 document.getElementById('majorelIframe').contentWindow.document.getElementsByTagName('body')[0].appendChild(script);
}