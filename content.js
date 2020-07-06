let itad_request_timer = null;
let itad_display_timer = null;
let itad_included = false;
let itad_info_container = null;
let itad_info_status = null;
let itad_info_container_header = null;

function handleLinks()
{
	if (location.href.indexOf("isthereanydeal.com") === -1)
	{
		const external_links = document.querySelectorAll('a[href*="//store.steampowered.com/"]:not([data-itad-handled="1"])');
		for (let i = 0; i < external_links.length; i++)
		{
			let appIDs = external_links[i].href.match(/\/\/store.steampowered.com\/(app|apps|sub|bundle)\/([0-9]+)/);
			let appID = null;
			
			if (appIDs && appIDs.length === 3) appID = appIDs[2];
			
			if (appID)
			{
				const elementToAppend = document.createElement('span');
				elementToAppend.dataset.itadId = appIDs[1] + '/' + appIDs[2];
				elementToAppend.classList.add("itad_everywhere");
				elementToAppend.textContent = "E";
				appendAfterFirstText(external_links[i], elementToAppend);
				
				elementToAppend.addEventListener("mouseenter", OnEnterExtraElem, { passive: true });
				elementToAppend.addEventListener("mouseleave", OnLeaveExtraElem, { passive: true });
				
				external_links[i].dataset.itadHandled = "1";
			}
		}
	}
	
	if (itad_included && itad_info_container === null)
	{
		itad_info_container = document.createElement('div');
		itad_info_container.id = "itad_info_container";
		itad_info_container.classList.add("itad_info_container_hidden");
		itad_info_container.style.top = "-500px";
		itad_info_container.style.left = "-500px";
		itad_info_container_header = document.createElement('div');
		itad_info_container_header.innerHTML = "<a id='itad_info_container_header' target='_blank' rel='noopener' href='https://isthereanydeal.com/'>IsThereAnyDeal</a>";
		itad_info_container.appendChild(itad_info_container_header);
		itad_info_status = document.createElement('div');
		itad_info_status.id = "itad_info_status";
		itad_info_status.innerHTML = "Loading...";
		itad_info_container.appendChild(itad_info_status);
		document.body.appendChild(itad_info_container);
		
		itad_info_container.addEventListener("mouseenter", OnEnterContainer, { passive: true });
		itad_info_container.addEventListener("mouseleave", OnLeaveContainer, { passive: true });
	}
}

function appendAfterFirstText(parentElement, elementToAppend) 
{
	for (const childElement of parentElement.childNodes) 
	{
		
		if ((childElement.nodeType === Node.TEXT_NODE && childElement.textContent.trim().length > 0) || childElement.nodeName === 'I') 
		{
			parentElement.insertBefore(elementToAppend, childElement.nextSibling);
			itad_included = true;
			return true;
		}
		
		if (appendAfterFirstText(childElement, elementToAppend)) 
		{
			return true;
		}
	}
	return false;
}

function getItemInfo(e, currentInfoElemId)
{
	clearTimeout(itad_request_timer);
	itad_request_timer = setTimeout(function () {

		const feedURL = "https://api.isthereanydeal.com/v01/game/overview/?key=" + ITAD_API_KEY + "&shop=steam&ids=" + encodeURIComponent(e.target.dataset.itadId);
		const xhr1 = new XMLHttpRequest();
		xhr1.open("GET", feedURL, true);
		xhr1.onreadystatechange = function () {
			buildItemInfo(e, currentInfoElemId);
		};
		xhr1.send();
		
		function buildItemInfo(a, b)
		{
			if (xhr1.readyState === 4 && xhr1.status === 200)
			{
				let result = xhr1.responseText.replace(/(<([^>]+)>)/ig, "");
				result = JSON.parse(result);

				let itad_info_output = '';
				const keyvalue = Object.keys(result['data'])[0];
				const itad_item = result['data'][keyvalue];
				let itad_plain = '';
				const steamappid = b.match(/app-([0-9]+)/);

				if(itad_item && itad_item['urls'] && itad_item['urls']['info'])
				{
					itad_plain = itad_item['urls']['info'].match(/isthereanydeal.com\/game\/(\w+)\/info/);
				}
				
				if(itad_item && itad_item['price'])
				{
					var price_cut_output = '';
					if(itad_item['price']['cut'] !== 0) price_cut_output = '<div class="itad_info_elem_cut">-'+itad_item['price']['cut']+'%</div>';

					itad_info_output += '<a target="_blank" rel="noopener" href="'+itad_item['price']['url']+'" data-itad-handled="1" class="itad_info_elem_price">';
					itad_info_output += 'Best price now:<div class="itad_info_elem_highlighted">'+price_cut_output+itad_item['price']['price_formatted']+'</div> at '+itad_item['price']['store'];
                    itad_info_output += '</a>';
				} else {

                    itad_info_output += '<span data-itad-handled="1" class="itad_info_elem_btn itad_info_elem_btn--noprice">No current price found</span>';
                }

				if(itad_item && itad_item['urls'] && itad_item['urls']['info'])
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="'+itad_item['urls']['info']+'" class="itad_info_elem_btn">Show all deals</a>';
				}
				
				if(itad_item && itad_item['lowest'])
				{			
					var price_cut_output = '';
					if(itad_item['lowest']['cut'] !== 0) price_cut_output = '<div class="itad_info_elem_cut">-'+itad_item['lowest']['cut']+'%</div>';

					let lowest_url = '';
					if(itad_item['lowest']['url']) lowest_url = 'href="'+itad_item['lowest']['url']+'"';
					
					itad_info_output += '<a target="_blank" rel="noopener" '+lowest_url+' data-itad-handled="1" class="itad_info_elem_price itad_info_elem_price_lowest">History low:<div class="itad_info_elem_highlighted">'+price_cut_output+itad_item['lowest']['price_formatted']+'</div>at '+itad_item['lowest']['store']+' '+itad_item['lowest']['recorded_formatted']+'</a>';
				}
				
				if(itad_plain && itad_plain.length === 2)
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="https://isthereanydeal.com/#/page:game/wait?plain='+itad_plain[1]+'" class="itad_info_elem_btn">Wait for better price</a>';
				}
				
				if(itad_item && itad_item['urls'] && itad_item['urls']['history'])
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="'+itad_item['urls']['history']+'" class="itad_info_elem_btn">Price history</a>';
				}
				
				if(steamappid && steamappid.length === 2)
				{
					itad_info_output += '<a target="_blank" rel="noopener" href="http://steampeek.hu?appid='+steamappid[1]+'#itadext" class="itad_info_elem_btn">Browse similar games</a>';
				}

				const itad_info_elem = document.createElement("div");
				itad_info_elem.id = b;
				itad_info_elem.classList.add("itad_info_elem");
				
				if(itad_info_output !== '')
				{
					itad_info_elem.innerHTML = itad_info_output;
				}
				else
				{
					itad_info_elem.classList.add("noinfo");
					itad_info_elem.innerHTML = '<div class="itad_info_elem_info">Currently there is no information for this game.<br/><br/>You can visit our site and browse all deals:</div><a class="itad_info_elem_btn" target="_blank" rel="noopener" href="https://isthereanydeal.com/">Trending deals</a>';
				}
				
				if(!document.getElementById(b))
				{
					document.getElementById("itad_info_container").appendChild(itad_info_elem);
				}
				keepInViewPort(itad_info_container);
				itad_info_status.innerHTML = "";
			}
		}
	}, 350);
}

function OnEnterExtraElem(e)
{
	const rect = e.target.getBoundingClientRect();
	itad_info_container.style.left = (getCoords(e.target).left + (rect.right - rect.left) - 8) + "px";
	itad_info_container.style.top = (getCoords(e.target).top + (rect.bottom - rect.top) - 8 - 82) + "px";
	
	clearTimeout(itad_display_timer);
	itad_info_container.classList.remove("itad_info_container_hidden");

	const currentInfoElemId = "itad_info_elem_" + e.target.dataset.itadId.replace('/', '-');

	const divsToHide = document.getElementsByClassName("itad_info_elem");
	for (let i = 0; i < divsToHide.length; i++)
	{
		if (divsToHide.id !== currentInfoElemId)
		{
			divsToHide[i].style.display = "none";
		}
	}

	const currentInfoElem = document.getElementById(currentInfoElemId);

	if(currentInfoElem)
	{
		itad_info_status.innerHTML = "";
		currentInfoElem.style.display = 'flex';
	}
	else
	{
		itad_info_status.innerHTML = "Loading...";
		getItemInfo(e, currentInfoElemId);
	}
	
	keepInViewPort(itad_info_container);
}

function OnLeaveExtraElem(e)
{
	if(itad_info_container.classList.contains('itad_info_container_hidden')) clearTimeout(itad_request_timer);
	itad_display_timer = setTimeout(function () { itad_info_container.classList.add("itad_info_container_hidden"); }, 200);
}

function OnEnterContainer()
{
	clearTimeout(itad_display_timer);
	itad_info_container.classList.remove("itad_info_container_hidden");
}

function OnLeaveContainer()
{
	itad_display_timer = setTimeout(function () { itad_info_container.classList.add("itad_info_container_hidden"); }, 200);
}

function keepInViewPort(elem)
{
	let rect = elem.getBoundingClientRect();

	if(rect.bottom + 20 > window.innerHeight) { elem.style.top = (getCoords(elem).top - (rect.bottom - window.innerHeight) - 20) + "px"; }
	if(rect.right + 20 > window.innerWidth) { elem.style.left = (getCoords(elem).left - (rect.right - window.innerWidth) - 20) + "px"; }
}

function getCoords(elem) 
{
  let box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

let observer = new MutationObserver(mutationsList => {
	for (let mutation of mutationsList)
	{
		if (mutation.type === 'childList')
		{
			handleLinks();
		}
	}
});

observer.observe(document, {childList: true, subtree: true});
handleLinks();
