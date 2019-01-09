/* ------------------------------------------------------------------------------
*
*  # Basic datatables
*
*  Specific JS code additions for datatable_basic.html page
*
*  Version: 1.0
*  Latest update: Aug 1, 2015
*
* ---------------------------------------------------------------------------- */

const dataTable=()=>{

    // Table setup
    // ------------------------------
    // Setting datatable defaults
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        columnDefs: [{ 
            orderable: false,
            width: '100px',
            targets: [ 3 ]
        }],
        dom: '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>',
        language: {
            search: '<span>Filter:</span> _INPUT_',
            searchPlaceholder: 'Type to filter...',
            lengthMenu: '<span>Show:</span> _MENU_',
            paginate: { 'first': 'First', 'last': 'Last', 'next': '&rarr;', 'previous': '&larr;' }
        },
        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });

    // Basic datatable
    $('.datatable-basic').DataTable();


    // Alternative pagination
    $('.datatable-pagination').DataTable({
        pagingType: "simple",
        language: {
            paginate: {'next': 'Next &rarr;', 'previous': '&larr; Prev'}
        }
    });

    // Datatable with saving state
    $('.datatable-save-state').DataTable({
        stateSave: true
    });

    // Scrollable datatable
    $('.datatable-scroll-y').DataTable({
        autoWidth: true,
        scrollY: 300
    });

    // External table additions
    // ------------------------------

    // Enable Select2 select for the length option
    $('.dataTables_length select').select2({
        minimumResultsForSearch: Infinity,
        width: 'auto'
    });
}




const url="https://limitlessroadclub.com/software/php/search.php";

const postForm=obj=>{
	const xml=new XMLHttpRequest;
	const fd=new FormData;
	for(key in obj.data) fd.append(key,obj.data[key]);
	xml.open("post",obj.url);
	xml.responseType="json";
	xml.send(fd);
	xml.onload=()=>{
		if(obj.callback) obj.callback(xml.response);
	}
}

const emptyHTML=modalbody.innerHTML;

const getPlanText=planID=>{
	let planText;
	if(planID==1) planText="Silver";
	else if(planID==2) planText="Gold";
	else if(planID==3) planText="Platinum";
	return planText;
}



postForm({
	url:url,
	data:{
		action:"list"
	},
	callback:res=>{
		for(const x of res){
			const node=clone.querySelector("tr").cloneNode(true);
			node.querySelector(".name").innerText=x.display_name;
			node.querySelector(".username").innerText=x.user_login;
			node.querySelector(".email").innerText=x.user_email;
			node.id=x.ID;
			node.querySelector(".view .icon-menu7").onclick=()=>{

				modalbody.innerHTML=emptyHTML;

				postForm({
					url:url,
					data:{
						action:"detail_part1",
						user_id:x.ID
					},
					callback:res=>{
						detail.querySelector(".name").innerText=x.display_name;
						detail.querySelector(".username").innerText=x.user_login;
						detail.querySelector(".email").innerText=x.user_email;
					}
				});

				postForm({
					url:url,
					data:{
						action:"detail_part2",
						user_id:x.ID
					},
					callback:res=>{
						for(const x of res){
							switch(x.meta_key){
								case "pmpro_baddress1":
									detail.querySelector(".address").innerText=x.meta_value;
									break;
								case "pmpro_driverlicense":
									detail.querySelector(".dl").innerText=x.meta_value;
									break;
							}
						}
					}
				});

				postForm({
					url:url,
					data:{
						action:"detail_part3",
						user_id:x.ID
					},
					callback:res=>{

						if(res.length==0) return;
						detail.querySelector(".plan").innerText=getPlanText(res[0].membership_id);
						detail.querySelector(".status").innerText=res[0].status;
						detail.querySelector(".expdate").innerText=res[0].enddate;
					}
				});




				postForm({
					url:url,
					data:{
						action:"detail_part4",
						user_id:x.ID
					},
					callback:res=>{

						if(res.length>0) thead.classList.remove("d-none");

						for(const x of res){
							const node=clone.querySelector(".order").cloneNode(true);
							console.log(node);
							node.querySelector(".date").innerText=x.timestamp;
							node.querySelector(".invoice").innerText=x.code;
							node.querySelector(".level").innerText=getPlanText(x.membership_id);
							node.querySelector(".total").innerText=x.subtotal;
							order.appendChild(node);
						}
					}
				});




			}
			tbody.appendChild(node);
		}
		dataTable();
	}
});


