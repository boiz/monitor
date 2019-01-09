getXHR(`menu.html`,"text",res=>{
	document.querySelector(".navigation").innerHTML=res;

	if(location.pathname=="/"||location.pathname=="/index.html") index.classList.add("active");
	else if(location.pathname=="/cloud.html") cloud.classList.add("active");

});