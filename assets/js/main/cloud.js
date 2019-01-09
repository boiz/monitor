let getXHR=(url,callback)=>{
	let xml=new XMLHttpRequest;
	xml.open("get",url);
	xml.send();
	xml.responseType="json";
	xml.onload=()=>callback(xml.response);
}

let getISOTime=date=>{
  date=new Date(date);
  return new Date(date-date.getTimezoneOffset()*60000).toISOString().replace(/T|Z/g," ").substr(0,19);
}

let loadImap=()=>{
	ul.innerHTML="";
	getXHR(`http://${ip}:3001/imap`,res=>{
		for(let x of res){
			let li=document.createElement("li");
			li.innerHTML=`${getISOTime(x.time)} ${x.subject} ${x.skipped} ${x.copied} ${x.critical}`;
			ul.appendChild(li);
		}
		mystatus.innerText="completed";
	});

}

loadImap();

mystatus.innerText="receiving..";



/*
getXHR(`http://${ip}:3001/receive`,res=>{
	console.log(1111);
	mystatus.innerText="database updated, refresh page in 3 seconds..";

	setTimeout(()=>{
		loadImap();
		mystatus.innerText="completed";
	},3000);

});*/