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


let setLoading=(status,selector)=>{
	if(status=="on") selector.classList.remove("d-none");
	else if(status=="off") selector.classList.add("d-none");
}

const len=mycolors.length;


setLoading("on",loading);
setLoading("on",loading3);

getXHR(`http://${ip}:3001/imap`,"json",res=>{

	getXHR(`http://${ip}:3001/status`,"json",res=>{
		//console.log(res);
		setLoading("off",loading);
		res.forEach((x,i)=>{

			const reg=/(Aborted)|(Scan Failure)|(Internal Error)|Simulated/;
			if(reg.test(x.store)) return;

			let clone=sample.cloneNode(true);

			clone.querySelector(".store").innerText=x.store;
			clone.querySelector(".time").innerText=x.time;
			clone.querySelector(".color").classList.add(`bg-${mycolors[i%len]}-400`);
			clone.querySelector(".letter-icon").innerText=x.store[0].toUpperCase();
			clone.querySelector(".skipped").innerText=x.skipped;
			clone.querySelector(".copied").innerText=x.copied;
			clone.querySelector(".critical").innerText=x.critical;
			clone.querySelector(".non").innerText=x.non;


/*			
			clone.querySelector(".color").classList.add(`bg-${mycolors[i]}-400`);
			clone.querySelector(".letter-icon").innerText=x.store.substr(3,1).toUpperCase();*/

			let status=clone.querySelector(".status");
			status.innerText=x.status;
			if(/lost|fail/i.test(x.status)){
				status.classList.add("bg-danger");
			}
			else if(/outdated/i.test(x.status)){
				status.classList.add("bg-orange");
			}
			else status.classList.add("bg-green");



			mystatus.appendChild(clone);
		});

		ready=true;

	});


	let dashsample=dashtoclone.firstElementChild;
	let makePost=()=>{
		setLoading("on",loading3);
		postXhr({
			url:`http://${ip}:3001/dashboard`,
			data:{
				id:mydashboard.dataset.id
			},
			callback:res=>{

				
				//console.log(res);
				

				let stores=[];


				getXHR(`http://${ip}:3001/status`,"json",statusRes=>{

					setLoading("off",loading3);

					for(let x of statusRes) stores.push(x.store);

					//console.log(stores);
					res.forEach(x=>{

						let i=stores.indexOf(x.store);




						let clone=dashsample.cloneNode(true);
						
						clone.querySelector(".store").innerText=x.store;
						clone.querySelector(".time").innerText=x.time;
						clone.querySelector(".status.line1").innerText=`${x.status}`;
						clone.querySelector(".status.line2").innerText=`${x.skipped} ${x.copied}`;
						clone.querySelector(".status.line3").innerText=`${x.critical} ${x.non}`;
						clone.querySelector(".letter-icon").innerText=x.store[0].toUpperCase();




						clone.querySelector(".color").classList.add(`bg-${mycolors[i%len]}-400`);
						
						//clone.querySelector(".ip").innerText=x.ip;
						

						let icon=clone.querySelector(".dashicon")
						
						if(/failure|outdated/i.test(x.status)) icon.classList.add("icon-spinner11");
						else icon.classList.add("icon-checkmark3");

						mydashboard.appendChild(clone);

					});
					mydashboard.dataset.id=Number(mydashboard.dataset.id)+15;




				});





			}
		});
	}

	makePost();
	//loadmore.onclick=()=>makePost();

	onscroll=()=>{
		if(tillBottom()==0&&loading3.className=="d-none") makePost();
	}

});






