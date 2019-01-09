const getXHR=(url,dataType,callback)=>{
	let xml=new XMLHttpRequest;
	xml.open("get",url);
	xml.send();
	xml.responseType=dataType;
	xml.onload=()=>callback(xml.response);
}

const getFormData=data=>{
	var param="";
	var count=0;
	for(var k in data){
		var value=data[k];
		if(count++) k="&"+k;
		param+=k+"="+value;
	}
	count=0;
	return param;
}

const postXhr=obj=>{
	var xml=new XMLHttpRequest;
	xml.open("post",obj.url);
	xml.setRequestHeader("content-type","application/x-www-form-urlencoded");
	xml.responseType="json";
	xml.send(getFormData(obj.data));
	xml.onload=function(){
		obj.callback(this.response);
	}
}

const getRandomInt=max=>Math.floor(Math.random() * Math.floor(max));

const shuffle=array=>{
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const tillBottom=()=>{
    let html=document.getElementsByTagName("body")[0];
    let scrollPosition = window.pageYOffset;
    let windowSize = window.innerHeight;
    let bodyHeight = html.offsetHeight;
    return Math.max(bodyHeight - (scrollPosition + windowSize), 0);
};