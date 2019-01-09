let mycolors=shuffle([
	"pink",
	"blue",
	"purple",
	"indigo",
	"teal",
	"green",
	"orange",
	"brown",
	"grey",
	"success",
	"primary",
	"danger",
	"slate",
	"warning",
	"info",
	"violet"
]);

let sample=toclone.firstElementChild;

let stores=[
	"IP Canoga Park", 
	"IP Cerritos", 
	"IP Elk Grove", 
	"IP Fresno", 
	"IP Hayward", 
	"IP Long Beach", 
	"IP Oxnard", 
	"IP Panorama", 
	"IP Pittsburg", 
	"IP Santa Clarita", 
	"IP Silverado Ranch", 
	"IP Temecula", 
	"IP Tropicana", 
	"IP Union City", 
	"IP Vallejo", 
	"IP West Covina"
];


let setLoading=(status,selector)=>{
	if(status=="on") selector.classList.remove("d-none");
	else if(status=="off") selector.classList.add("d-none");
}

setLoading("on",loading);
setLoading("on",loading3);

getXHR(`http://${ip}:3000/imap`,"json",res=>{

	getXHR(`http://${ip}:3000/status`,"json",res=>{
		//console.log(res);
		setLoading("off",loading);
		res.forEach((x)=>{
			//stores.push(x.store);
			//excemption stores
			if(/Rancho|Chula Vista/i.test(x.store)){
				return;
			}

			let i=stores.indexOf(x.store);

			let clone=sample.cloneNode(true);
			
			clone.querySelector(".store").innerText=x.store;
			clone.querySelector(".ip").innerText=x.ip;
			clone.querySelector(".time").innerText=x.time;

			clone.querySelector(".color").classList.add(`bg-${mycolors[i]}-400`);
			clone.querySelector(".letter-icon").innerText=x.store.substr(3,1).toUpperCase();

			let status=clone.querySelector(".status")
			status.innerText=x.status;
			if(/lost|failed/i.test(x.status)){
				status.classList.remove("bg-green");
				status.classList.add("bg-danger");
			}
			mystatus.appendChild(clone);
		});
	});


	let dashsample=dashtoclone.firstElementChild;
	let makePost=()=>{
		setLoading("on",loading3);
		postXhr({
			url:`http://${ip}:3000/dashboard`,
			data:{
				id:mydashboard.dataset.id
			},
			callback:res=>{
				//console.log(res);
				setLoading("off",loading3);
				res.forEach(x=>{

					let i=stores.indexOf(x.store);

					let clone=dashsample.cloneNode(true);
					
					clone.querySelector(".store").innerText=x.store;
					//clone.querySelector(".ip").innerText=x.ip;
					clone.querySelector(".time").innerText=x.time;

					clone.querySelector(".color").classList.add(`bg-${mycolors[i]}-400`);
					clone.querySelector(".letter-icon").innerText=x.store.substr(3,1).toUpperCase();

					let icon=clone.querySelector(".dashicon")
					clone.querySelector(".status").innerText=x.status;
					if(x.status=="connection lost") icon.classList.add("icon-spinner11");
					else icon.classList.add("icon-checkmark3");
					mydashboard.appendChild(clone);
				});
				mydashboard.dataset.id=Number(mydashboard.dataset.id)+15;
			}
		});
	}

	makePost();
	//loadmore.onclick=()=>makePost();

	onscroll=()=>{
		if(tillBottom()==0) makePost();
	}

});






